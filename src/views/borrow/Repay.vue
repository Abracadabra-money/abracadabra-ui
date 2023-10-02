<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>Choose Chain</h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel title="Remove collateral" :amount="maxCollateralAmount" />

          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="maxCollateralAmount"
            :error="errorCollateralValue"
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
            :name="borrowToken.name"
            :icon="borrowToken.icon"
            :value="borrowValue"
            :max="maxBorrowValue"
            :error="errorBorrowValue"
            :disabled="!cauldron"
            @updateValue="updateBorrowValue"
          />

          <DynamicallyEstimatedPrice
            :isClose="true"
            :amount="borrowValue"
            :mimAddress="borrowToken.address"
          />
        </div>

        <BalanceBlock v-if="cauldron" :cauldron="cauldron" />
      </div>

      <div class="cauldron-stand" :style="backgroundInfo.stand">
        <h1 class="title">
          Repay
          <MagicApeIcon v-if="cauldron" :cauldron="cauldron" />
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
                :expectedCollateralAmount="+expectedCollateralAmount"
                :expectedBorrowAmount="expectedBorrowAmount"
                :expectedLiquidationPrice="expectedLiquidationPrice"
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
              :disabled="isTokenApproved || isActionDisabled"
              @click="approveTokenHandler"
              >Approve</BaseButton
            >
            <BaseButton
              @click="actionHandler"
              :disabled="!isTokenApproved || isActionDisabled"
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
import { COLLATERAL_EMPTY_DATA, MIM_EMPTY_DATA } from "@/constants/cauldron.ts";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

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

    parseCollateralAmount() {
      const { decimals } = this.activeToken;
      return utils.parseUnits(
        filters.formatToFixed(+this.collateralValue || 0, decimals),
        decimals
      );
    },

    parseBorrowAmount() {
      return utils.parseUnits(filters.formatToFixed(this.borrowValue || 0, 18));
    },

    isCauldronLoading() {
      return !!(this.$route.params.id && !this.cauldron);
    },

    isTokenApproved() {
      if (!this.account) return true;
      if (!this.borrowValue) return true;
      const { mimAllowance } = this.cauldron.userTokensInfo;
      const allowance = +utils.formatUnits(mimAllowance);
      return allowance > +this.borrowValue;
    },

    isActionDisabled() {
      if (this.errorCollateralValue || this.errorBorrowValue) return true;
      if (!this.collateralValue && !this.borrowValue) return true;
      return false;
    },

    isMaxBorrow() {
      const { userBorrowAmount, userCollateralAmount } = this.positionInfo;

      return (
        +this.borrowValue === +userBorrowAmount &&
        +this.collateralValue === +userCollateralAmount
      );
    },

    maxCollateralAmount() {
      if (!this.cauldron) return 0;

      const { mcr } = this.cauldron.config;
      const { decimals } = this.activeToken;
      const { userCollateralAmount } = this.positionInfo;
      const { userBorrowAmount, oracleExchangeRate, maxWithdrawAmount } =
        this.positionInfo;

      if (+this.borrowValue === userBorrowAmount || !userBorrowAmount) {
        if (maxWithdrawAmount && maxWithdrawAmount < +userCollateralAmount) {
          return maxWithdrawAmount;
        }

        return userCollateralAmount;
      }

      const collateralInUsd = +userCollateralAmount / oracleExchangeRate;
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

      const { mimBalance } = this.borrowToken;
      const { userBorrowAmount } = this.positionInfo;
      if (userBorrowAmount > mimBalance) return mimBalance;
      return userBorrowAmount;
    },

    errorCollateralValue() {
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
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      const expectedAmount = userCollateralAmount.sub(
        this.parseCollateralAmount
      );

      return +expectedAmount < 0 ? 0 : utils.formatUnits(expectedAmount);
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.positionInfo;
      const expectedAmount = userBorrowAmount - +this.borrowValue;
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

    positionInfo() {
      const { decimals } = this.activeToken;
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { oracleRate } = this.cauldron.userPosition;
      const { maxWithdrawAmount } = this.cauldron.additionalInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      return {
        userBorrowAmount: +utils.formatUnits(userBorrowAmount),
        oracleExchangeRate: +utils.formatUnits(oracleRate, decimals),
        maxWithdrawAmount: +utils.formatUnits(maxWithdrawAmount, decimals),
        userCollateralAmount: utils.formatUnits(userCollateralAmount),
      };
    },

    collateralToken() {
      const { icon } = this.cauldron.config;
      const { name, decimals, address } = this.cauldron.config.collateralInfo;

      return {
        name,
        address,
        icon,
        decimals,
      };
    },

    borrowToken() {
      if (!this.cauldron) return MIM_EMPTY_DATA;

      const { name, icon, address } = this.cauldron.config.mimInfo;
      const { mimBalance } = this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        address,
        mimBalance: +utils.formatUnits(mimBalance),
      };
    },

    activeToken() {
      if (!this.cauldron) return COLLATERAL_EMPTY_DATA;

      return this.collateralToken;
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
      if (this.cauldron === null) this.$router.push(`/repay`);
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    clearInputs() {
      this.borrowValue = "";
      this.collateralValue = "";
    },

    async changeActiveMarket(marketId) {
      clearInterval(this.updateInterval);
      this.cauldronId = marketId;
      this.cauldron = "";
      this.collateralValue = "";
      this.borrowValue = "";

      const duplicate = this.$route.fullPath === `/repay/${marketId}`;
      if (!duplicate) this.$router.push(`/repay/${marketId}`);

      this.isOpenMarketListPopup = false;
    },

    updateCollateralValue(value) {
      this.collateralValue = value;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    async checkAllowance(amount) {
      const { bentoBox, mim } = this.cauldron.contracts;

      const allowance = await mim.allowance(this.account, bentoBox.address);

      if (allowance.lt(amount)) {
        return await approveToken(mim, bentoBox.address);
      }

      return true;
    },

    async approveTokenHandler() {
      if (this.isTokenApproved || this.isActionDisabled) return false;

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
      if (!this.isTokenApproved || this.isActionDisabled) return false;
      if (!this[this.actionInfo.methodName]) return false;
      const notificationId = await this.createNotification(
        notification.pending
      );
      try {
        await this[this.actionInfo.methodName]();
      } catch (error) {
        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }

      this.clearInputs();
    },

    async repayHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.positionInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const payload = {
        amount: this.parseBorrowAmount,
        updatePrice,
        itsMax: +this.borrowValue === +userBorrowAmount,
      };

      const isTokenToCookApprove = await this.checkAllowance(payload.amount);

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
      const { address } = this.activeToken;
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const payload = {
        amount: await bentoBox.toShare(
          address,
          this.parseCollateralAmount,
          true
        ),
        updatePrice,
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
      const { address } = this.activeToken;
      const { updatePrice } = this.cauldron.mainParams;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const payload = {
        collateralAmount: this.parseBorrowAmount,
        amount: await bentoBox.toShare(
          address,
          this.parseCollateralAmount,
          true
        ),
        updatePrice,
      };

      if (this.isMaxBorrow) {
        payload.itsMax = true;
        payload.collateralAmount = userBorrowPart;
        payload.amount = userCollateralShare;
      }

      const isTokenToCookApprove = await this.checkAllowance(
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
      import("@/components/borrow/BalanceBlock.vue")
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
