<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>Choose Chain</h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel
            title="Remove collateral"
            :amount="formatTokenBalance(maxCollateralAmount)"
          />

          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="maxCollateralAmount"
            :error="errorCallateralValue"
            :disabled="!cauldron"
            @updateValue="updateCollateralValue"
            @openTokensList="isOpenMarketListPopup = true"
            isChooseToken
          />
        </div>

        <div class="borrow-assets underline">
          <div class="header-balance">
            <h4>Repay MIM</h4>
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

          <DynamicallyEstimatedPrice
            :itsClose="true"
            :amount="borrowValue"
            :mimAddress="mimInfo.address"
          />
        </div>

        <BalanceBlock v-if="cauldron" :cauldron="cauldron" />
      </div>

      <div class="cauldron-stand" :style="backgroundInfo.stand">
        <h1 class="title">
          Repay
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

          <div class="info-wrap">
            <MainInfoBlock :cauldron="cauldron" />
          </div>
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
import { approveToken } from "@/helpers/approval";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification.js";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";

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
      borrowValue: "",
      collateralValue: "",
      cauldronId: null,
      updateInterval: null,
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

    isTokenApproved() {
      if (!this.account) return true;

      const { mimAllowance } = this.cauldron.userTokensInfo;
      const allowance = +utils.formatUnits(mimAllowance);
      return allowance > 0;
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      if (this.errorCallateralValue || this.errorBorrowValue) return true;
      if (!this.collateralValue && !this.borrowValue) return true;
      return false;
    },

    maxCollateralAmount() {
      if (!this.cauldron) return 0;

      const { borrowAmount } = this.mimInfo;
      const { collateralAmount, decimals } = this.activeToken;
      const { config, additionalInfo, mainParams } = this.cauldron;
      const { mcr } = config;
      const { maxWithdrawAmount: withdrawAmount } = additionalInfo;
      const { oracleExchangeRate: exchangeRate } = mainParams;

      const oracleExchangeRate = +utils.formatUnits(exchangeRate, decimals);
      const maxWithdrawAmount = +utils.formatUnits(withdrawAmount, decimals);

      if (+this.borrowValue === borrowAmount || !borrowAmount) {
        if (maxWithdrawAmount && maxWithdrawAmount < collateralAmount) {
          return maxWithdrawAmount;
        }

        return collateralAmount;
      }

      const collateralInUsd = collateralAmount / oracleExchangeRate;
      const maxBorrow =
        (collateralInUsd / 100) * (mcr - 1) - this.expectedBorrowAmount;
      const borrowLeft = ((maxBorrow * oracleExchangeRate) / mcr) * 100;

      if (borrowLeft < 0) return "0";
      if (maxWithdrawAmount && maxWithdrawAmount < +borrowLeft) {
        return maxWithdrawAmount;
      }

      return filters.formatToFixed(borrowLeft, decimals);
    },

    maxBorrowValue() {
      if (!this.cauldron) return 0;

      const { borrowAmount, mimBalance } = this.mimInfo;
      if (borrowAmount > mimBalance) return mimBalance;
      return borrowAmount;
    },

    errorCallateralValue() {
      if (isNaN(this.collateralValue)) return "Please input valid value";
      if (+this.collateralValue > +this.maxCollateralAmount)
        return `The value cannot be greater than ${this.maxCollateralAmount}`;
      return "";
    },

    errorBorrowValue() {
      if (isNaN(this.borrowValue)) return "Please input valid value";
      if (+this.borrowValue > +this.maxBorrowValue)
        return `The value cannot be greater than ${this.maxBorrowValue}`;

      return "";
    },

    expectedCollateralAmount() {
      const { collateralAmount } = this.activeToken;
      const expectedAmount = collateralAmount - +this.collateralValue;
      return expectedAmount < 0 ? 0 : expectedAmount;
    },

    expectedBorrowAmount() {
      const { borrowAmount } = this.mimInfo;
      const expectedAmount = borrowAmount - +this.borrowValue;
      return expectedAmount < 0 ? 0 : expectedAmount;
    },

    expectedLiquidationPrice() {
      if (!this.expectedCollateralAmount) return 0;

      return (
        this.expectedBorrowAmount /
        this.expectedCollateralAmount /
        (+this.cauldron.config.mcr / 100)
      );
    },

    collateralToken() {
      const { config, userPosition } = this.cauldron;
      const { icon } = config;
      const { name, decimals, address } = config.collateralInfo;
      const { userCollateralAmount, userCollateralShare } =
        userPosition.collateralInfo;

      return {
        name,
        address,
        icon,
        decimals,
        collateralAmount: +utils.formatUnits(userCollateralAmount),
        collateralShare: +utils.formatUnits(userCollateralShare),
      };
    },

    activeToken() {
      if (!this.cauldron) return EMPTY_DATA;

      return this.collateralToken;
    },

    mimInfo() {
      if (!this.cauldron) return MIM_INFO;

      const { name, icon, decimals, address } = this.cauldron.config.mimInfo;
      const { mimBalance } = this.cauldron.userTokensInfo;
      const { userBorrowAmount, userBorrowPart } =
        this.cauldron.userPosition.borrowInfo;

      return {
        name,
        icon,
        address,
        borrowAmount: +utils.formatUnits(userBorrowAmount),
        borrowPart: +utils.formatUnits(userBorrowPart),
        mimBalance: +utils.formatUnits(mimBalance),
        mimDecimals: decimals,
      };
    },

    actionInfo() {
      const info = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.isActionDisabled) return info;

      if (+this.borrowValue && +this.collateralValue) {
        info.methodName = "removeAndRepayHandler";
        info.buttonText = "Remove and Repay";
      } else if (+this.borrowValue) {
        info.methodName = "repayHandler";
        info.buttonText = "Repay";
      } else if (+this.collateralValue) {
        info.methodName = "removeCollateralHandler";
        info.buttonText = "Remove collateral";
      }

      return info;
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
  },

  watch: {
    async cauldronId() {
      await this.createCauldronInfo();
    },

    cauldron() {
      if (this.cauldron === null) this.$router.push(`/repayTest`);
    },
  },
  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    updateCollateralValue(value) {
      this.collateralValue = value;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
      this.collateralValue = +this.maxCollateralAmount;
    },

    async approveTokenHandler() {
      if (this.isTokenApproved) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { mim, bentoBox } = this.cauldron.contracts;
      const approve = await approveToken(mim, bentoBox.address);

      if (approve) await this.createCauldronInfo();
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    async actionHandler() {
      this[this.actionInfo.methodName]();
    },

    async repayHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { borrowAmount } = this.mimInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const payload = {
        amount: utils.parseUnits(filters.formatToFixed(this.borrowValue, 18)),
        updatePrice: true, // todo updatePrice: this.selectedPool.askUpdatePrice,
        itsMax: +this.borrowValue === +borrowAmount,
      };

      const isTokenToCookApprove = this.checkAllowance(payload.amount);

      if (+isTokenToCookApprove) {
        await this.cookRepay(
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

    async removeCollateralHandler() {
      const { bentoBox } = this.cauldron.contracts;
      const { decimals, address } = this.activeToken;
      const { isMasterContractApproved } = this.cauldron.additionalInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const parsedAmount = utils.parseUnits(
        this.collateralValue.toString(),
        decimals
      );

      const payload = {
        amount: await bentoBox.toShare(address, parsedAmount, true),
        updatePrice: true, // rodo  updatePrice: this.selectedPool.askUpdatePrice,
      };

      await this.cookRemoveCollateral(
        payload,
        isMasterContractApproved,
        this.cauldron,
        notificationId
      );

      return await this.createCauldronInfo();
    },

    async removeAndRepayHandler() {
      const { bentoBox } = this.cauldron.contracts;
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { userCollateralShare } = this.cauldron.userPosition.collateralInfo;
      const { userBorrowPart } = this.cauldron.userPosition.borrowInfo;
      const { decimals, address, collateralShare } = this.activeToken;
      const { mimDecimals, borrowPart } = this.mimInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const parsedBorrowValue = utils.parseUnits(
        filters.formatToFixed(+this.borrowValue, mimDecimals)
      );

      const parsedCollateralValue = utils.parseUnits(
        filters.formatToFixed(+this.collateralValue, decimals),
        decimals
      );

      const payload = {
        collateralAmount: parsedBorrowValue,
        amount: await bentoBox.toShare(address, parsedCollateralValue, true),
        updatePrice: true, //todo updatePrice: this.selectedPool.askUpdatePrice,
      };

      if (
        +this.borrowValue === +borrowPart &&
        +this.collateralValue === +collateralShare
      ) {
        payload.itsMax = true;
        payload.collateralAmount = userBorrowPart;
        payload.updatePrice = true; //todo updatePrice: this.selectedPool.askUpdatePrice,
        payload.amount = await bentoBox.toShare(
          address,
          userCollateralShare,
          true
        );
      }

      const isTokenToCookApprove = this.checkAllowance(
        payload.collateralAmount
      );

      if (+isTokenToCookApprove) {
        await this.cookRemoveCollateralAndRepay(
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

    async checkAllowance(amount) {
      const { bentoBox, mim } = this.cauldron.contracts;

      const allowance = await mim.allowance(this.account, bentoBox.address);

      if (allowance.lt(amount)) {
        return await approveToken(mim, bentoBox.address);
      }

      return true;
    },

    async changeActiveMarket(marketId) {
      clearInterval(this.updateInterval);
      this.cauldronId = marketId;
      this.cauldron = "";
      this.collateralValue = "";
      this.borrowValue = "";

      // todo
      // const duplicate = this.$route.fullPath === `/repay/${marketId}`;
      // if (!duplicate) this.$router.push(`/repay/${marketId}`);
      const duplicate = this.$route.fullPath === `/repayTest/${marketId}`;
      if (!duplicate) this.$router.push(`/repayTest/${marketId}`);

      this.isOpenMarketListPopup = false;
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
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    DynamicallyEstimatedPrice: defineAsyncComponent(() =>
      import("@/components/borrow/DynamicallyEstimatedPrice.vue")
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
  margin-bottom: 30px;
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
