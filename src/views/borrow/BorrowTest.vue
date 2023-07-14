<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>Choose Chain</h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel :amount="formatTokenBalance(activeToken.balance.value)" />

          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="activeToken.balance.value"
            :error="errorCallateralValue"
            :disabled="!cauldron"
            @updateValue="updateCollateralValue"
            @openTokensList="isOpenMarketListPopup = true"
            isChooseToken
          />

          <UseCheckbox :config="cauldron.config" @toggle="changeToken" />
        </div>

        <div class="borrow-assets underline">
          <div class="header-balance">
            <h4>MIM to Borrow</h4>
          </div>
          <BaseTokenInput
            :name="mimInfo.name"
            :icon="mimInfo.icon"
            :value="borrowValue"
            :max="maxBorrowValue"
            :error="errorBorrowValue"
            :disabled="!cauldron"
            @updateValue="updateBorrowValue"
          />
        </div>

        <div class="ltv-wrap underline" v-if="cauldron">
          <LtvBlock :ltv="calculateLtv" />
        </div>

        <div class="percent-wrap" v-if="cauldron">
          <PercentageButtons
            :maxParcent="cauldron.config.mcr"
            :isDisabled="!!collateralValue"
            @onchange="updatePercentValue"
          />
        </div>

        <BalanceBlock v-if="cauldron" :cauldron="cauldron" />

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
          <div class="stand-data">
            <template v-if="cauldron">
              <PositionInfoBlock
                v-if="showAdditionalInfo"
                :cauldron="cauldron"
                :expectedCollateralAmount="expectedCollateralAmount"
                :expectedBorrowAmount="expectedBorrowAmount"
                :expectedLiquidationPrice="expectedLiquidationPrice"
              />

              <AdditionalInfoBlock v-else :cauldron="cauldron" />
            </template>
            <EmptyState v-else />
          </div>
        </div>

        <CollateralApyBlockNew v-if="cauldron" :cauldron="cauldron" />

        <template v-if="cauldron">
          <div class="btn-wrap">
            <BaseButton
              primary
              :disabled="isTokenApproved"
              @click="approveTokenHandler"
              >Approve</BaseButton
            >
            <BaseButton @click="actionHandler" :disabled="isActionDisabled"
              >{{ actionInfo.buttonText }}
            </BaseButton>
          </div>

          <div class="main-info-wrap">
            <MainInfoBlock :cauldron="cauldron" />
          </div>

          <LeftToBorrowBlock
            :borrowLeft="cauldron.mainParams.mimLeftToBorrow"
          />
        </template>
      </div>
    </template>

    <BaseLoader v-else />

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
import { utils } from "ethers";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import notification from "@/helpers/notification/notification.js";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import { approveToken } from "@/helpers/approval";

const MAX_ALLOWANCE_VALUE =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
const EMPTY_DATA = {
  name: "",
  icon: "",
  balance: { value: 0 },
};
const MIM_INFO = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
};

export default {
  mixins: [cookMixin],
  data() {
    return {
      cauldron: "",
      useOtherToken: false,
      collateralValue: "",
      isOpenMarketListPopup: false,
      borrowValue: "",
      showAdditionalInfo: true,
      cauldronId: null,
      updateInterval: null,
      ltvTooltip:
        "Loan to Value: percentage of debt compared to the collateral. The higher it is, the riskier the position",
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

    nativeToken() {
      const { symbol, icon } = getChainInfo(this.chainId);
      const { nativeTokenBalance } = this.cauldron.userTokensInfo;
      const allowance = this.$ethers.BigNumber.from(MAX_ALLOWANCE_VALUE);

      return {
        name: symbol,
        icon,
        balance: {
          hex: nativeTokenBalance,
          value: utils.formatUnits(nativeTokenBalance),
        },
        decimals: 18,
        allowance,
      };
    },

    collateralToken() {
      const { name, decimals } = this.cauldron.config.collateralInfo;
      const { icon } = this.cauldron.config;
      const { collateral } = this.cauldron.contracts;
      const { collateralBalance, collateralAllowance } =
        this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        balance: {
          hex: collateralBalance,
          value: utils.formatUnits(collateralBalance, decimals),
        },
        decimals,
        allowance: collateralAllowance,
        contract: collateral,
        isNative: true,
      };
    },

    unwrappedToken() {
      const { name, icon } = this.cauldron.config.wrapInfo.unwrappedToken;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { unwrappedToken } = this.cauldron.contracts;
      const { unwrappedTokenBalance, unwrappedTokenAllowance } =
        this.cauldron.userTokensInfo;
      const value = utils.formatUnits(unwrappedTokenBalance, decimals);

      return {
        name,
        icon,
        balance: {
          hex: unwrappedTokenBalance,
          value,
        },
        decimals,
        allowance: unwrappedTokenAllowance,
        contract: unwrappedToken,
      };
    },

    mimInfo() {
      if (!this.cauldron) return MIM_INFO;
      const { name, icon } = this.cauldron.config.mimInfo;
      return { name, icon };
    },

    activeToken() {
      if (!this.cauldron) return EMPTY_DATA;

      const { acceptUseDefaultBalance } = this.cauldron.config.cauldronSettings;
      const { wrapInfo } = this.cauldron.config;
      const { useUnwrappedByDefault } = wrapInfo;

      if (acceptUseDefaultBalance && this.useOtherToken)
        return this.nativeToken;
      if (!!wrapInfo && useUnwrappedByDefault && !this.useOtherToken)
        return this.unwrappedToken;
      return this.collateralToken;
    },

    errorCallateralValue() {
      if (isNaN(this.collateralValue)) return "Please input valid value";
      if (+this.collateralValue > +this.activeToken.balance.value)
        return `The value cannot be greater than ${this.activeToken.balance.value}`;
      return "";
    },

    collateralInUsd() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;
      const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);
      return this.expectedCollateralAmount / exchangeRate;
    },

    maxBorrowValue() {
      if (!this.cauldron) return 0;

      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { mcr } = this.cauldron.config;
      const borrowAmount = +utils.formatUnits(userBorrowAmount);
      const maxBorrow = (this.collateralInUsd / 100) * (mcr - 1) - borrowAmount;
      return maxBorrow < 0 ? 0 : maxBorrow;
    },

    calculateLtv() {
      const { mcr } = this.cauldron.config;

      if (this.collateralValue) {
        const percent = this.maxBorrowValue / +mcr;
        const ltv = this.borrowValue / percent;
        if (ltv > +mcr) return mcr;
        return parseFloat(ltv).toFixed(0);
      }

      if (this.borrowValue) {
        const ltv =
          Math.round((this.expectedBorrowAmount / this.collateralInUsd) * 100) +
          1;

        if (ltv <= +mcr) return parseFloat(ltv).toFixed(0);
        return +mcr;
      }

      return 0;
    },

    errorBorrowValue() {
      if (isNaN(this.borrowValue)) return "Please input valid value";
      if (+this.borrowValue > +this.maxBorrowValue)
        return `The value cannot be greater than ${this.maxBorrowValue}`;

      return "";
    },

    expectedCollateralAmount() {
      const { tokensRate } = this.cauldron.additionalInfo;
      const { userCollateralAmount, decimals } =
        this.cauldron.userPosition.collateralInfo;

      const collateralDeposit = +utils.formatUnits(
        userCollateralAmount,
        decimals
      );
      const rates = +utils.formatUnits(tokensRate, decimals);

      if (this.useOtherToken) return collateralDeposit + +this.collateralValue;
      else return collateralDeposit + +this.collateralValue / rates;
    },

    expectedBorrowAmount() {
      const { borrowFee } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const borrowAmount = +utils.formatUnits(userBorrowAmount);
      if (borrowFee) return +this.borrowValue * +borrowFee + borrowAmount;
      return +this.borrowValue + borrowAmount;
    },

    expectedLiquidationPrice() {
      if (!this.expectedCollateralAmount) return 0;

      return (
        this.expectedBorrowAmount /
        this.expectedCollateralAmount /
        (+this.cauldron.config.mcr / 100)
      );
    },

    isTokenApproved() {
      if (!this.account) return true;

      const allowance = +utils.formatUnits(
        this.activeToken.allowance,
        this.activeToken.decimals
      );

      return allowance > 0;
    },

    actionInfo() {
      const info = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.isActionDisabled) return info;

      if (+this.borrowValue && +this.collateralValue) {
        info.methodName = "addCollateralAndBorrowHandler";
        info.buttonText = "Add collateral and borrow";
      } else if (+this.borrowValue) {
        info.methodName = "borrowHandler";
        info.buttonText = "Borrow";
      } else if (+this.collateralValue) {
        info.methodName = "addCollateralHandler";
        info.buttonText = "Add collateral";
      }

      return info;
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      if (this.errorCallateralValue || this.errorBorrowValue) return true;
      if (!this.collateralValue && !this.borrowValue) return true;
      return false;
    },

    // todo isUserLocked() {
    //   return (
    //     this.selectedPool.userInfo?.userLockedTimestamp &&
    //     Number(this.selectedPool.userInfo?.userLockedTimestamp) !== 0
    //   );
    // },

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
  },

  watch: {
    async cauldronId() {
      await this.createCauldronInfo();
    },

    cauldron() {
      // todo
      if (this.cauldron === null) this.$router.push(`/borrowTest`);
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    changeToken(value) {
      this.collateralValue = "";
      this.borrowValue = "";
      this.useOtherToken = value;
    },

    updateCollateralValue(value) {
      this.collateralValue = value;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    updatePercentValue(value) {
      if (!value) this.borrowValue = "";
      const { mcr } = this.cauldron.config;
      const amount = (this.maxBorrowValue * value) / +mcr;
      if (amount > +this.maxBorrowValue) this.borrowValue = this.maxBorrowValue;
      this.borrowValue = !amount ? "" : amount;
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

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
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
      }, 15000);
    },

    async actionHandler() {
      this[this.actionInfo.methodName]();
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

    async addCollateralAndBorrowHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const collateralAmount = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.activeToken.decimals
      );

      // if (!this.checkCauldronBorrowLimit(+this.borrowValue, notificationId))
      //   return false;

      const borrowAmount = this.$ethers.utils.parseUnits(
        filters.formatToFixed(this.borrowValue, 18)
      );

      const payload = {
        collateralAmount,
        amount: borrowAmount,
        // todo updatePrice: this.selectedPool.askUpdatePrice,
        updatePrice: true,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      const isTokenToCookApprove = await this.checkAllowance(collateralAmount);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateralAndBorrow(
          payload,
          isMasterContractApproved,
          this.cauldron,
          notificationId,
          !!this.cauldron.config.wrapInfo,
          !this.useOtherToken
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    async addCollateralHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const collateralAmount = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.activeToken.decimals
      );

      const payload = {
        amount: collateralAmount,
        // todo updatePrice: this.selectedPool.askUpdatePrice,
        updatePrice: true,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      const isTokenToCookApprove = await this.checkAllowance(collateralAmount);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateral(
          payload,
          isMasterContractApproved,
          this.cauldron,
          notificationId,
          !!this.cauldron.config.wrapInfo,
          !this.useOtherToken
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    async borrowHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      // todo
      // if (!this.checkCauldronBorrowLimit(+this.borrowValue, notificationId)) {
      //   return false;
      // }

      // if (!this.checkIsUserWhitelistedBorrow()) {
      //   return false;
      // }

      // if (!this.checkIsAcceptNewYvcrvSTETHBorrow()) {
      //   return false;
      // }

      const borrowAmount = this.$ethers.utils.parseUnits(
        filters.formatToFixed(this.borrowValue, 18)
      );

      const payload = {
        amount: borrowAmount,
        // todo updatePrice: this.selectedPool.askUpdatePrice,
        updatePrice: true,
      };

      const isTokenToCookApprove = await this.checkAllowance(0);

      if (+isTokenToCookApprove) {
        await this.cookBorrow(
          payload,
          isMasterContractApproved,
          this.cauldron,
          notificationId
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    async changeActiveMarket(marketId) {
      clearInterval(this.updateInterval);
      this.cauldronId = marketId;
      this.cauldron = "";
      this.useOtherToken = false;
      this.collateralValue = "";
      this.borrowValue = "";

      // todo
      // const duplicate = this.$route.fullPath === `/borrow/${marketId}`;
      // if (!duplicate) this.$router.push(`/borrow/${marketId}`);
      const duplicate = this.$route.fullPath === `/borrowTest/${marketId}`;
      if (!duplicate) this.$router.push(`/borrowTest/${marketId}`);

      this.isOpenMarketListPopup = false;
    },

    // todo
    async checkCauldronBorrowLimit(amount, notificationId) {
      let dynamicBorrowAmount;
      let borrowlimit;

      if (+this.selectedPool.borrowlimit) {
        borrowlimit = +amount < +this.selectedPool.borrowlimit;
      } else {
        borrowlimit = true;
      }

      dynamicBorrowAmount = +amount < +this.selectedPool.dynamicBorrowAmount;

      if (dynamicBorrowAmount && borrowlimit) return true;

      if (notificationId) {
        this.$store.commit("notifications/delete", notificationId);
      }

      if (!dynamicBorrowAmount) {
        this.$store.dispatch("notifications/new", notification.allowBorrow);
      } else {
        this.$store.dispatch("notifications/new", notification.borrowLimit);
      }

      return false;
    },

    // todo
    checkIsUserWhitelistedBorrow() {
      if (!this.selectedPool.userInfo?.whitelistedInfo) return true;

      if (!this.selectedPool.userInfo?.whitelistedInfo?.isUserWhitelisted) {
        const notification = {
          msg: "Your wallet is not currently whitelisted. Please try again once the whitelist is removed.",
          type: "error",
        };

        this.$store.dispatch("notifications/new", notification);

        return false;
      }

      return true;
    },

    // todo
    checkIsAcceptNewYvcrvSTETHBorrow() {
      if (this.selectedPool.id === 33 && this.chainId === 1) {
        const oldYvCrvSTETH = this.$store.getters.getPoolById(12);
        const hasOpenedBorrowPosition = +oldYvCrvSTETH.userBorrowPart > 50;

        if (hasOpenedBorrowPosition) {
          const notification = {
            msg: "Please close down your old yvcrvSTETH position before opening a new one.",
            type: "error",
          };

          this.$store.dispatch("notifications/new", notification);

          return false;
        }

        return true;
      }

      return true;
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
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    UseCheckbox: defineAsyncComponent(() =>
      import("@/components/ui/checkboxes/UseCheckbox.vue")
    ),
    LtvBlock: defineAsyncComponent(() =>
      import("@/components/borrow/LtvBlock.vue")
    ),
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    PercentageButtons: defineAsyncComponent(() =>
      import("@/components/borrow/PercentageButtons.vue")
    ),
    BalanceBlock: defineAsyncComponent(() =>
      import("@/components/borrow/BalanceBlockNew.vue")
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
    CollateralApyBlockNew: defineAsyncComponent(() =>
      import("@/components/borrow/CollateralApyBlockNew.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    MainInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/MainInfoBlock.vue")
    ),
    LeftToBorrowBlock: defineAsyncComponent(() =>
      import("@/components/borrow/LeftToBorrowBlock.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    LocalPopupWrap: defineAsyncComponent(() =>
      import("@/components/popups/LocalPopupWrap.vue")
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

.borrow-assets {
  padding-top: 27px;
  padding-bottom: 14px;
}

.ltv-wrap {
  padding: 15px 0;
}

.percent-wrap {
  padding: 30px 0;
}

.position-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
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

.cauldron-stand {
  min-height: 520px;
  padding: 30px 20px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
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

  .title {
    margin-bottom: 20px;
  }

  .cauldron-stand {
    padding: 20px 10px;
    min-height: auto;
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
