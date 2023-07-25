<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>Choose Chain</h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel :amount="formatTokenBalance(activeToken.balance)" />
          <SelectButton
            :activeToken="activeToken"
            @click="isOpenMarketListPopup = true"
          />
        </div>

        <div class="range-wrap underline" v-if="cauldron">
          <div class="setting-button-wrap">
            <SettingsButton @click="isSettingsOpen = true" />
          </div>

          <Range
            :value="repayMimAmount"
            :max="+formatToFixed(positionInfo.userBorrowAmount, 4)"
            :step="borrowRangeStep"
            title="Choose the amount of MIM you want to repay"
            @updateValue="updateRepayMimAmount"
          />
          <div class="repay-amount">{{ formatRepayBorrowAmount }}</div>

          <InfoLink
            v-if="isInfoLinkVisibility"
            text="Check current Burn Fees"
            href="https://app.gmx.io/#/buy_glp#redeem"
            tooltip="Abracadabra leverage engine optmises the best route to join/leave GLP. These fees are not included in the slippgae tollerance"
          />

          <DynamicallyEstimatedPrice
            :itsClose="true"
            :amount="repayMimAmount"
            :mimAddress="cauldron.config.mimInfo.address"
          />
        </div>

        <div class="range-wrap" v-if="cauldron">
          <Range
            :value="removeCollateralAmount"
            :max="maxRemoveCollateralAmount"
            :step="collateralRangeStep"
            :parallelRange="repayMimAmount"
            title="Choose the amount of collateral you want to remove"
            @updateValue="updateRemoveCollateralAmount"
          />
          <div class="repay-amount">{{ formatRemoveCollateralAmount }}</div>
        </div>

        <BaseButton
          v-if="cauldron"
          primary
          :disabled="isDisabledClosePosition"
          @click="closePositionHandler"
          >Close Position
        </BaseButton>

        <router-link class="position-link link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>

      <div class="cauldron-stand" :style="backgroundInfo.stand">
        <h1 class="title">
          Borrow
          <MagicApeIcon v-if="cauldron" :cauldronId="cauldron.config.id" />
          MIM
        </h1>

        <div class="stand-info">
          <div class="stand-tags">
            <SpecialInfoBlock v-if="cauldron" :cauldron="cauldron" />
            <Tooltip
              v-if="cauldron"
              @click="showAdditionalInfo = !showAdditionalInfo"
            />
          </div>
          <div>
            <template v-if="cauldron">
              <PositionInfoBlock
                v-if="showAdditionalInfo"
                :cauldron="cauldron"
                :expectedCollateralAmount="expectedCollateralDeposit"
                :expectedBorrowAmount="+expectedBorrowAmount"
                :expectedLiquidationPrice="+expectedLiquidationPrice"
              />

              <AdditionalInfoBlock v-else :cauldron="cauldron" />
            </template>
            <EmptyState v-else />
          </div>
        </div>

        <CollateralApyBlock v-if="cauldron" :cauldron="cauldron" />

        <template v-if="cauldron">
          <div class="btn-wrap">
            <BaseButton
              primary
              :disabled="isTokenApproved"
              @click="approveTokenHandler"
              >Approve Token</BaseButton
            >
            <BaseButton @click="actionHandler" :disabled="isActionDisabled"
              >{{ actionInfo }}
            </BaseButton>
          </div>

          <div class="main-info-wrap">
            <MainInfoBlock :cauldron="cauldron" />
          </div>
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap
      :isOpened="isSettingsOpen"
      @closePopup="isSettingsOpen = false"
    >
      <SettingsPopup :slippage="slippage" @saveSettings="changeSlippage"
    /></LocalPopupWrap>

    <LocalPopupWrap
      :isOpened="isOpenMarketListPopup"
      @closePopup="isOpenMarketListPopup = false"
    >
      <MarketsListPopup
        popupType="borrow"
        @changeActiveMarket="changeActiveMarket($event)"
    /></LocalPopupWrap>
  </div>
</template>

<script>
import { utils, BigNumber } from "ethers";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification.js";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import { approveToken } from "@/helpers/approval";
import { COLLATERAL_EMPTY_DATA } from "@/constants/cauldron.ts";

export default {
  mixins: [cookMixin],
  data() {
    return {
      slippage: 1,
      cauldron: "",
      cauldronId: null,
      repayMimAmount: 0,
      updateInterval: null,
      isSettingsOpen: false,
      borrowRangeStep: 0.0001,
      removeCollateralAmount: 0,
      showAdditionalInfo: true,
      isOpenMarketListPopup: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),

    isCauldronLoading() {
      return !!(this.$route.params.id && !this.cauldron);
    },

    isDisabledClosePosition() {
      return !(this.cauldron && this.positionInfo.userBorrowAmount);
    },

    isTokenApproved() {
      if (!this.account) return true;

      const allowance = +utils.formatUnits(
        this.activeToken.allowance,
        this.activeToken.decimals
      );

      return allowance > 0;
    },

    isMaxRepayMimAmount() {
      return (
        +filters.formatToFixed(this.repayMimAmount, 4) ===
        +filters.formatToFixed(this.positionInfo.userBorrowAmount, 4)
      );
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      if (!this.repayMimAmount) return true;
      return false;
    },

    isInfoLinkVisibility() {
      return this.chainId === 42161 && this.cauldron?.config?.id === 3;
    },

    formatRepayBorrowAmount() {
      return `${filters.formatTokenBalance(this.expectedRepayBorrowAmount)} ${
        this.cauldron.config.mimInfo.name
      }`;
    },

    formatRemoveCollateralAmount() {
      const { decimals } = this.activeToken;
      return `${filters.formatTokenBalance(
        utils.formatUnits(this.finalRemoveCollateralAmount, decimals)
      )} ${this.activeToken.name}`;
    },

    maxRemoveCollateralAmount() {
      if (!+this.repayMimAmount) return 0;

      const { decimals } = this.activeToken;
      const { userBorrowAmount, maxWithdrawAmount } = this.positionInfo;

      const repayPersent = this.repayMimAmount / userBorrowAmount;
      const usdPercent =
        (this.collateralInUsd - +this.expectedBorrowAmount) /
        this.collateralInUsd;

      const maxRepayAmount =
        this.expectedCollateralAmount * usdPercent * 0.995 * repayPersent;

      if (maxWithdrawAmount && maxWithdrawAmount < maxRepayAmount)
        return filters.formatToFixed(maxWithdrawAmount, decimals);

      return +filters.formatToFixed(maxRepayAmount, decimals);
    },

    expectedCollateralDeposit() {
      if (!this.cauldron) return 0;
      const { decimals } = this.activeToken;
      const { userCollateralAmount } = this.positionInfo;

      const finalAmount =
        +this.finalCollateralAmount +
        +utils.formatUnits(this.finalRemoveCollateralAmount, decimals);

      const finalRemoveAmount = userCollateralAmount - +finalAmount;

      return finalRemoveAmount;
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.positionInfo;
      if (this.isMaxRepayMimAmount) return 0;
      return +userBorrowAmount - +this.repayMimAmount;
    },

    expectedRepayBorrowAmount() {
      if (this.isMaxRepayMimAmount) return this.positionInfo.userBorrowAmount;
      return this.repayMimAmount;
    },

    expectedLiquidationPrice() {
      return (
        +this.expectedBorrowAmount /
          +this.expectedCollateralDeposit /
          (this.cauldron.config.mcr / 100) || 0
      );
    },

    expectedCollateralAmount() {
      const { userCollateralAmount } = this.positionInfo;
      return userCollateralAmount - +this.finalCollateralAmount;
    },

    finalCollateralAmount() {
      const { decimals } = this.activeToken;
      const { oracleExchangeRate } = this.positionInfo;

      const borrowAmount = filters.formatToFixed(this.repayMimAmount, 18);
      const slippageMutiplier = (100 + +this.slippage) / 100;

      return filters.formatToFixed(
        borrowAmount * oracleExchangeRate * slippageMutiplier,
        decimals
      );
    },

    finalRemoveCollateralAmount() {
      const { decimals } = this.activeToken;
      const exponential = this.isExponential(this.removeCollateralAmount);

      const removeAmount = exponential
        ? this.noExponents(this.removeCollateralAmount)
        : this.removeCollateralAmount;

      return utils.parseUnits(
        filters.formatToFixed(removeAmount, decimals),
        decimals
      );
    },

    actionInfo() {
      if (this.isActionDisabled) return "Nothing to do";

      if (+this.repayMimAmount && +this.removeCollateralAmount) {
        return "Flash repay & Remove collateral";
      } else if (+this.repayMimAmount) {
        return "Flash Repay";
      }

      return "Nothing to do";
    },

    positionInfo() {
      if (!this.cauldron) return false;

      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { oracleRate } = this.cauldron.userPosition;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { maxWithdrawAmount } = this.cauldron.additionalInfo;

      return {
        oracleExchangeRate: +utils.formatUnits(oracleRate, decimals),
        userBorrowAmount: +utils.formatUnits(userBorrowAmount),
        userCollateralAmount: +utils.formatUnits(
          userCollateralAmount,
          decimals
        ),
        maxWithdrawAmount: +utils.formatUnits(maxWithdrawAmount, decimals),
      };
    },

    backgroundInfo() {
      if (!this.cauldron) return false;
      const { id } = this.cauldron.config;
      if (id === 39)
        return {
          deposit: `background-image: url(${useImage(
            "assets/images/ape/bg.png"
          )})`,
          stand: `background-image: url(${useImage(
            "assets/images/ape/bg-info.png"
          )})`,
        };
      return false;
    },

    activeToken() {
      if (!this.cauldron) return COLLATERAL_EMPTY_DATA;
      return this.collateralToken;
    },

    collateralToken() {
      const { icon } = this.cauldron.config;
      const { name, decimals } = this.cauldron.config.collateralInfo;
      const { collateral } = this.cauldron.contracts;
      const { collateralBalance, collateralAllowance } =
        this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        balance: utils.formatUnits(collateralBalance, decimals), //
        decimals,
        allowance: collateralAllowance,
        contract: collateral,
      };
    },

    collateralRangeStep() {
      const { decimals } = this.activeToken;
      return +utils.formatUnits(1, decimals);
    },

    collateralInUsd() {
      const { userCollateralAmount, oracleExchangeRate } = this.positionInfo;
      const expectedAmount = userCollateralAmount - +this.finalCollateralAmount;
      return expectedAmount / oracleExchangeRate;
    },
  },

  watch: {
    async cauldronId() {
      await this.createCauldronInfo();
    },

    cauldron() {
      if (this.cauldron === null) this.$router.push(`/leverage`);
    },

    expectedRepayBorrowAmount() {
      if (+this.expectedRepayBorrowAmount === 0)
        this.removeCollateralAmount = 0;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(amount) {
      return filters.formatTokenBalance(amount);
    },

    formatToFixed(amount, decimals = 4) {
      return filters.formatToFixed(amount, decimals);
    },

    updateRepayMimAmount(amount) {
      this.repayMimAmount = amount;
    },

    updateRemoveCollateralAmount(amount) {
      this.removeCollateralAmount = amount;
    },

    isExponential(value) {
      return String(value).includes("e") || String(value).includes("E");
    },

    noExponents(value) {
      const data = String(value).split(/[eE]/);
      if (data.length == 1) return data[0];

      let result = "",
        sign = value < 0 ? "-" : "",
        str = data[0].replace(".", ""),
        mag = Number(data[1]) + 1;

      if (mag < 0) {
        result = sign + "0.";
        while (mag++) result += "0";
        /*eslint-disable */
        return result + str.replace(/^\-/, "");
      }
      mag -= str.length;
      while (mag--) result += "0";
      return str + result;
    },

    changeSlippage(value) {
      if (!value) this.slippage = 1;
      else this.slippage = value;
      this.isSettingsOpen = false;
    },

    async changeActiveMarket(marketId) {
      clearInterval(this.updateInterval);
      this.cauldronId = marketId;
      this.cauldron = "";

      const duplicate = this.$route.fullPath === `/deleverage/${marketId}`;
      if (!duplicate) this.$router.push(`/deleverage/${marketId}`);

      this.isOpenMarketListPopup = false;
    },

    async approveTokenHandler() {
      if (this.isTokenApproved) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { address } = this.cauldron.contracts.bentoBox;
      const approve = await approveToken(this.activeToken.contract, address);

      if (approve) await this.createCauldronInfo();
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    async actionHandler() {
      if (!+this.repayMimAmount || !this.slippage) return false;

      const { bentoBox } = this.cauldron.contracts;
      const { oracleExchangeRate } = this.positionInfo;
      const { userBorrowPart } = this.cauldron.userPosition.borrowInfo;
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const repayAmount = utils.parseUnits(
        filters.formatToFixed(this.repayMimAmount, 18)
      );

      const amountFrom = utils.parseUnits(
        filters.formatToFixed(
          this.expectedRepayBorrowAmount * oracleExchangeRate,
          18
        )
      );

      const slippage = BigNumber.from(
        parseFloat(this.slippage * 1e10).toFixed(0)
      );

      const slippageAmount = amountFrom.div(100).mul(slippage).div(1e10);

      const collateralAmount = await bentoBox.toShare(
        this.activeToken.contract.address,
        amountFrom.add(slippageAmount),
        false
      );

      const removeCollateralAmount = await bentoBox.toShare(
        this.activeToken.contract.address,
        this.finalRemoveCollateralAmount,
        true
      );

      const payload = {
        borrowAmount: this.isMaxRepayMimAmount ? userBorrowPart : repayAmount,
        collateralAmount,
        removeCollateralAmount,
        updatePrice,
        itsMax: this.isMaxRepayMimAmount,
        slipage: this.slippage, // todo type
      };

      const isTokenToCookApprove = await this.checkAllowance(
        payload.collateralAmount
      );

      if (+isTokenToCookApprove) {
        this.cookDeleverage(
          payload,
          isMasterContractApproved,
          this.cauldron,
          this.account,
          notificationId
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    async closePositionHandler() {
      this.repayMimAmount = this.positionInfo.userBorrowAmount;
      this.removeCollateralAmount = this.maxRemoveCollateralAmount;

      setTimeout(await this.actionHandler(), 100);
    },

    async checkAllowance(amount) {
      const { isNative, contract } = this.activeToken;
      const { bentoBox } = this.cauldron.contracts;
      if (!isNative) {
        const allowance = await contract.allowance(
          this.account,
          bentoBox.address
        );

        if (allowance.lt(amount)) {
          return await approveToken(contract, bentoBox.address);
        }
      }

      return true;
    },

    async createCauldronInfo() {
      if (!this.cauldronId) return false;

      const userSigner = this.account ? this.signer : this.provider;
      this.cauldron = await getCauldronInfo(
        this.cauldronId,
        this.chainId,
        this.provider,
        userSigner
      );

      this.updateInterval = await setInterval(async () => {
        this.cauldron = await getCauldronInfo(
          this.cauldronId,
          this.chainId,
          this.provider,
          this.signer
        );
      }, 60000);
    },
  },

  async created() {
    this.cauldronId = this.$route.params.id;
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList: defineAsyncComponent(() =>
      import("@/components/ui/NetworksList.vue")
    ),
    InputLabel: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputLabel.vue")
    ),
    SelectButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/SelectButton.vue")
    ),

    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    SettingsButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/SettingsButton.vue")
    ),
    Range: defineAsyncComponent(() => import("@/components/ui/Range.vue")),
    DynamicallyEstimatedPrice: defineAsyncComponent(() =>
      import("@/components/borrow/DynamicallyEstimatedPrice.vue")
    ),
    InfoLink: defineAsyncComponent(() =>
      import("@/components/ui/links/InfoLink.vue")
    ),
    MagicApeIcon: defineAsyncComponent(() =>
      import("@/components/icons/MagicApe.vue")
    ),
    SpecialInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/SpecialInfoBlock.vue")
    ),
    PositionInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/PositionInfoBlock.vue")
    ),
    AdditionalInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/AdditionalInfoBlock.vue")
    ),
    EmptyState: defineAsyncComponent(() =>
      import("@/components/borrow/EmptyState.vue")
    ),
    CollateralApyBlock: defineAsyncComponent(() =>
      import("@/components/borrow/CollateralApyBlock.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    ExecutionPrice: defineAsyncComponent(() =>
      import("@/components/borrow/ExecutionPrice.vue")
    ),
    MainInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/MainInfoBlock.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    LocalPopupWrap: defineAsyncComponent(() =>
      import("@/components/popups/LocalPopupWrap.vue")
    ),
    SettingsPopup: defineAsyncComponent(() =>
      import("@/components/leverage/SettingsPopup.vue")
    ),
    MarketsListPopup: defineAsyncComponent(() =>
      import("@/components/popups/MarketsListPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.cauldron-view {
  display: grid;
  grid-gap: 20px;
  margin: 0 auto;
  max-width: calc(100% - 20px);
  padding: 100px 0;
  grid-template-columns: 550px 1fr;
  width: 1320px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.cauldron-deposit {
  padding: 30px 30px 50px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  background-position: center;
  background-size: cover;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collateral-assets {
  padding-top: 27px;
  padding-bottom: 24px;
}

.range-wrap {
  margin-bottom: 30px;
  padding-bottom: 30px;
}

.setting-button-wrap {
  display: flex;
  justify-content: flex-end;
}

.repay-amount {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}

.position-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.cauldron-stand {
  min-height: 520px;
  padding: 30px 20px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
}

.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stand-info {
  background-color: #23212d4d;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
}

.stand-tags {
  display: flex;
  justify-content: space-between;
  padding: 9px 30px 7px;
  min-height: 40px;
  gap: 15px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.main-info-wrap {
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .cauldron-view {
    grid-template-columns: 1fr;
    width: 95%;
  }

  .cauldron-deposit {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .collateral-assets {
    padding: 20px 0 15px;
  }

  .position-link {
    bottom: 15px;
  }

  .cauldron-stand {
    padding: 20px 10px;
    min-height: auto;
  }

  .title {
    margin-bottom: 20px;
  }

  .btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 375px) {
  .btn-wrap {
    grid-gap: 10px;
  }
}
</style>
