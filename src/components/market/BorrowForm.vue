<template>
  <div class="market-actions-wrap">
    <div class="deposit-wrap">
      <DepositBlock
        :cauldron="cauldron"
        :inputAmpunt="borrowConfig.amounts.deposit.inputAmount"
        :useNativeToken="useNativeToken"
        :useUnwrapToken="useUnwrapToken"
        :toggleNativeToken="() => (useNativeToken = !useNativeToken)"
        :toggleUnwrapToken="() => (useUnwrapToken = !useUnwrapToken)"
        @updateDepositAmounts="onUpdateDepositAmounts"
      />
    </div>
    <div class="borrow-wrap">
      <div>
        <div class="row">
          <h3 class="title">Borrow MIM</h3>

          <Toggle
            :selected="borrowConfig.useLeverage"
            text="Leverage"
            @updateToggle="onToggleLeverage"
          />
        </div>

        <h4 class="subtitle">
          Select the amount of MIM to borrow from the Cauldron
        </h4>
      </div>
      <LeverageBlock
        v-if="borrowConfig.useLeverage"
        :depositCollateralAmount="
          borrowConfig.amounts.deposit.collateralTokenAmount
        "
        :leverageAmounts="borrowConfig.amounts.leverageAmounts"
        :cauldron="cauldron"
        @updateLeverageAmounts="onUpdateLeverageAmounts"
      />
      <BorrowBlock
        v-else
        :cauldron="cauldron"
        :inputAmount="borrowConfig.amounts.borrowAmount"
        :collateralTokenAmount="
          borrowConfig.amounts.deposit.collateralTokenAmount
        "
        @updateBorrowAmount="onUpdateBorrowAmount"
      />

      <BaseButton
        primary
        :disabled="actionInfo.buttonText === 'Nothing to do'"
        @click="actionHandler"
        >{{ actionInfo.buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { applyBorrowFee, getMaxToBorrow } from "@/helpers/cauldron/utils";

import { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";
import { approveToken } from "@/helpers/approval";
// @ts-ignore
import cookMixin from "@/mixins/borrow/cooksV2.js";
// @ts-ignore
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
// @ts-ignore
import notification from "@/helpers/notification/notification.js";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";

export default {
  mixins: [cookMixin],
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  data() {
    return {
      useNativeToken: false,
      useUnwrapToken: false,
      borrowInputValue: "",
      ltvRangeValue: "",
      // TODO: add types
      borrowConfig: {
        useLeverage: false,
        amounts: {
          deposit: {
            inputAmount: BigNumber.from(0),
            collateralTokenAmount: BigNumber.from(0),
            unwrapTokenAmount: BigNumber.from(0),
          },
          borrowAmount: BigNumber.from(0),
          leverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isTokenApproved() {
      if (!this.account) return true;

      const { unwrappedTokenAllowance } = this.cauldron.userTokensInfo;
      const { collateralAllowance } = this.cauldron.userTokensInfo;

      const { collateralTokenAmount, unwrapTokenAmount } =
        this.borrowConfig.amounts.deposit;

      if (this.useNativeToken) return true;

      if (this.useUnwrapToken)
        return unwrappedTokenAllowance.gte(unwrapTokenAmount);

      return collateralAllowance.gte(collateralTokenAmount);
    },

    isActionDisabled() {
      const { collateralBalance, unwrappedTokenBalance, nativeTokenBalance } =
        this.cauldron.userTokensInfo;

      const { inputAmount } = this.borrowConfig.amounts.deposit;
      const { borrowAmount } = this.borrowConfig.amounts;

      if (inputAmount.isZero() && borrowAmount.isZero()) return true;

      if (this.useNativeToken && inputAmount.gt(nativeTokenBalance))
        return true;
      if (this.useUnwrapToken && inputAmount.gt(unwrappedTokenBalance))
        return true;
      if (
        !this.useNativeToken &&
        !this.useUnwrapToken &&
        inputAmount.gt(collateralBalance)
      )
        return true;

      if (borrowAmount.gt(this.maxToBorrow)) return true;

      return false;
    },

    maxToBorrow() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      return getMaxToBorrow(
        this.expectedCollateralAmount,
        userBorrowAmount,
        mcr,
        oracleExchangeRate
      );
    },

    expectedCollateralAmount() {
      return this.cauldron.userPosition.collateralInfo.userCollateralAmount.add(
        this.borrowConfig.amounts.deposit.collateralTokenAmount
      );
    },

    expectedBorrowAmount() {
      const { borrowFee } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      return applyBorrowFee(
        this.borrowConfig.amounts.borrowAmount,
        borrowFee * 1000
      ).add(userBorrowAmount);
    },

    actionInfo(): any {
      const { borrowAmount } = this.borrowConfig.amounts;
      const { collateralTokenAmount } = this.borrowConfig.amounts.deposit;
      const { isCollateralLocked } = this.cauldron.additionalInfo;

      const info: any = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.chainId !== this.cauldron.config.chainId) {
        info.buttonText = "Switch Chain";
        return info;
      }

      if (!this.isTokenApproved) {
        info.buttonText = "Approve";
        return info;
      }

      if (this.isActionDisabled) return info;
      if (isCollateralLocked) return info;

      if (!borrowAmount.isZero() && !collateralTokenAmount.isZero()) {
        info.methodName = "addCollateralAndBorrowHandler";
        info.buttonText = "Add collateral and borrow";
      } else if (!borrowAmount.isZero()) {
        info.methodName = "borrowHandler";
        info.buttonText = "Borrow";
      } else if (!collateralTokenAmount.isZero()) {
        info.methodName = "addCollateralHandler";
        info.buttonText = "Add collateral";
      }

      return info;
    },
  },

  watch: {
    useUnwrapToken() {
      this.setEmptyState(); // NOTICE: do we need this?
    },

    useNativeToken() {
      this.setEmptyState(); // NOTICE: do we need this?
    },

    borrowConfig: {
      handler(value) {
        this.$emit("updateBorrowConfig", value);
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    setEmptyState() {
      this.borrowInputValue = "";
      this.ltvRangeValue = "";
      this.borrowConfig.amounts = {
        deposit: {
          inputAmount: BigNumber.from(0),
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
        },
        borrowAmount: BigNumber.from(0),
        leverageAmounts: {
          amountFrom: BigNumber.from(0),
          amountToMin: BigNumber.from(0),
        },
      };
    },

    onToggleLeverage() {
      this.borrowConfig.useLeverage = !this.borrowConfig.useLeverage;
    },

    onUpdateDepositAmounts(amounts: any) {
      this.borrowConfig.amounts.deposit = amounts;
      this.$emit("updateAmounts", this.borrowConfig.amounts);
    },

    onUpdateBorrowAmount(amount: BigNumber) {
      this.borrowConfig.amounts.borrowAmount = amount;
      this.$emit("updateAmounts", this.borrowConfig.amounts);
    },

    onUpdateLeverageAmounts(amounts: any) {
      this.borrowConfig.amounts.leverageAmounts = amounts;
      this.$emit("updateAmounts", this.borrowConfig.amounts);
    },

    async checkPermissionToCook(
      notificationId: number,
      borrowAmount: BigNumber
    ) {
      if (borrowAmount.isZero()) return true;
      const { id } = this.cauldron.config;
      const { whitelistedInfo } = this.cauldron.additionalInfo;
      const { userMaxBorrow, mimLeftToBorrow } = this.cauldron.mainParams;

      if (mimLeftToBorrow.lt(borrowAmount)) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.allowBorrow);
        return false;
      }

      if (borrowAmount.gt(userMaxBorrow)) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.borrowLimit);
        return false;
      }

      if (!whitelistedInfo && this.chainId === 1 && id === 33) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.whitelisted);
        return false;
      }

      return true;
    },

    async actionHandler() {
      if (this.chainId !== this.cauldron.config.chainId) {
        await switchNetwork(this.cauldron.config.chainId);
        return false;
      }

      if (!this.isTokenApproved) {
        this.approveTokenHandler();
        return false;
      }

      if (this.isActionDisabled) return false;
      // @ts-ignore
      if (!this[this.actionInfo.methodName]) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const isPermissionToCook = await this.checkPermissionToCook(
        notificationId,
        this.borrowConfig.amounts.borrowAmount
      );

      if (!isPermissionToCook) return false;

      try {
        // @ts-ignore
        await this[this.actionInfo.methodName]();

        // this.clearInputs();

        this.deleteNotification(notificationId);
        this.createNotification(notification.success);
      } catch (error) {
        console.log("borrow error", error);
        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },

    async approveTokenHandler() {
      if (this.isTokenApproved || this.isActionDisabled) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { address } = this.cauldron.contracts.bentoBox;

      const approve = await approveToken(this.activeToken.contract, address);

      if (approve) await this.$emit("updateMarket");
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    async addCollateralHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        amount: this.borrowConfig.amounts.deposit.unwrapTokenAmount,
        updatePrice,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      await this.cookAddCollateral(
        payload,
        isMasterContractApproved,
        this.cauldron,
        !!this.cauldron.config?.wrapInfo,
        !this.useUnwrapToken
      );

      this.$emit("updateMarket");
    },

    async borrowHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        amount: this.borrowConfig.amounts.borrowAmount,
        updatePrice,
      };

      await this.cookBorrow(payload, isMasterContractApproved, this.cauldron);

      this.$emit("updateMarket");
    },

    async addCollateralAndBorrowHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        collateralAmount: this.borrowConfig.amounts.deposit.unwrapTokenAmount,
        amount: this.borrowConfig.amounts.borrowAmount,
        updatePrice,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      await this.cookAddCollateralAndBorrow(
        payload,
        isMasterContractApproved,
        this.cauldron,
        !!this.cauldron.config?.wrapInfo,
        !this.useUnwrapToken
      );

      this.$emit("updateMarket");
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    DepositBlock: defineAsyncComponent(
      () => import("@/components/market/DepositBlock.vue")
    ),
    BorrowBlock: defineAsyncComponent(
      () => import("@/components/market/BorrowBlock.vue")
    ),
    // TODO: remove new
    LeverageBlock: defineAsyncComponent(
      () => import("@/components/market/LeverageBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-actions-wrap {
  @include font;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
}

.deposit-wrap {
  @include block-wrap;
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 370px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}

.dynamic-fee {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dynamic-fee-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
}

.dynamic-fee-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}
</style>
