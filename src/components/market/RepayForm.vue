<template>
  <div class="repay-form">
    <div class="block-wrap remove-block">
      <div class="row">
        <div class="title-wrap">
          <h3 class="title">{{ titleText }}</h3>
          <SlippagePopup
            v-if="actionConfig.useDeleverage"
            :amount="actionConfig.amounts.slippage"
            @updateSlippage="onUpdateSlippage"
          />
        </div>

        <Toggle
          v-if="isDeleverageAllowed"
          :selected="actionConfig.useDeleverage"
          text="Deleverge"
          @updateToggle="onToggleDeleverage"
        />
      </div>

      <h4 class="subtitle">{{ subtitleText }}</h4>

      <RemoveCollateralBlock
        v-if="!actionConfig.useDeleverage"
        :cauldron="cauldron"
        :inputAmount="actionConfig.amounts.withdrawAmount"
        :repayAmount="actionConfig.amounts.repayAmount"
        @updateWithdrawAmount="onUpdateWithdrawAmount"
      />

      <DeleverageBlock
        v-else
        :cauldron="cauldron"
        :slippage="actionConfig.amounts.slippage"
        :deleverageAmounts="actionConfig.amounts.deleverageAmounts"
        :withdrawAmount="actionConfig.amounts.withdrawAmount"
        @updateDeleverageAmounts="onUpdateDeleverageAmounts"
      />
    </div>

    <div class="block-wrap repay-block">
      <div class="repay-logic">
        <RepayBlock
          v-if="!actionConfig.useDeleverage"
          :cauldron="cauldron"
          :inputAmount="actionConfig.amounts.repayAmount"
          :withdrawAmount="actionConfig.amounts.withdrawAmount"
          @updateRepayAmount="onUpdateRepayAmount"
        />

        <RemoveCollateralRangeBlock
          v-else
          :cauldron="cauldron"
          :deleverageAmounts="actionConfig.amounts.deleverageAmounts"
          :withdrawAmount="actionConfig.amounts.withdrawAmount"
          @updateWithdrawAmount="onUpdateWithdrawAmount"
        />
      </div>

      <div class="btns-wrap">
        <BaseButton
          primary
          :disabled="!cookValidationData.isAllowed"
          @click="actionHandler"
          >{{ cookValidationData.btnText }}</BaseButton
        >
        <BaseButton
          v-if="isAbleToClosePosition"
          primary
          @click="closePositionHandler"
          >Close position
        </BaseButton>
      </div>
    </div>

    <!-- TODO: MOVE TO MARKET -->
    <OrdersManager
      v-if="cauldron && cauldron.config.cauldronSettings.isGMXMarket"
      :cauldronObject="cauldron"
      :deleverageSuccessPayload="gmDelevSuccessPayload"
      :recoverLeverage="gmRecoverLeverageOrder"
      :deleverageFromOrder="gmDeleverageFromOrder"
    />
  </div>

  <!-- TODO: MOVE TO MARKET -->
  <template v-if="activeOrder && isOpenGMPopup">
    <GMStatus
      :isOpened="isOpenGMPopup"
      @closePopup="closeGMPopup"
      :order="activeOrder"
      :orderType="2"
      :cauldronObject="cauldron"
      :successLeverageCallback="successGmLeverageCallback"
      :deleverageSuccessPayload="gmDelevSuccessPayload"
      :deleverageFromOrder="gmDeleverageFromOrder"
    />
  </template>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";
import type { SwapAmounts } from "@/helpers/cauldron/types";
import tempMixin from "@/mixins/temp";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import {
  getDeleverageAmounts,
  PERCENT_PRESITION,
  getMaxCollateralToRemove,
} from "@/helpers/cauldron/utils";

export default {
  emits: ["updateToggle", "updateAmounts"],
  mixins: [tempMixin],
  props: {
    cauldron: {
      type: Object as any,
    },
    actionConfig: {
      type: Object as any,
    },
  },

  data() {
    return {
      action: "repay",
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    // TODO: use estimateUserPosition
    expectedBorrowAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      //@ts-ignore
      const { amountToMin } = this.actionConfig.amounts.deleverageAmounts;

      const expectedBorrowAmount = userBorrowAmount.sub(amountToMin);

      return expectedBorrowAmount.lt(0)
        ? BigNumber.from(0)
        : expectedBorrowAmount;
    },

    // TODO: use estimateUserPosition
    maxToRemove() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      //@ts-ignore
      const { amountFrom } = this.actionConfig.amounts.deleverageAmounts;

      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      // after swap
      const expectedCollateralAmount = userCollateralAmount.sub(amountFrom);
      const maxToRemove = getMaxCollateralToRemove(
        expectedCollateralAmount,
        this.expectedBorrowAmount,
        mcr,
        oracleExchangeRate
      );

      if (maxToRemove.gt(userCollateralAmount)) return userCollateralAmount;

      return maxToRemove;
    },

    hasOpenPosition() {
      const { collateralInfo, borrowInfo } = this.cauldron.userPosition;
      return (
        collateralInfo.userCollateralShare.gt(0) ||
        borrowInfo.userBorrowPart.gt(0)
      );
    },

    isAbleToClosePosition() {
      if (this.chainId !== this.cauldron.config.chainId) return false;
      if (this.actionConfig.useDeleverage) return this.hasOpenPosition;
      const { mimBalance } = this.cauldron.userTokensInfo;
      const { borrowInfo } = this.cauldron.userPosition;

      return (
        this.hasOpenPosition && mimBalance.gte(borrowInfo.userBorrowAmount)
      );
    },

    isDeleverageAllowed() {
      const { liquidationSwapper } = this.cauldron.contracts;
      const { isSwappersActive } = this.cauldron.config.cauldronSettings;

      return liquidationSwapper && isSwappersActive;
    },

    titleText() {
      const { useDeleverage } = this.actionConfig;
      return useDeleverage ? "Deleverage" : "Remove collateral";
    },

    subtitleText() {
      const { useDeleverage } = this.actionConfig;
      const { name } = this.cauldron.config.collateralInfo;
      return useDeleverage
        ? "Choose the amount of MIM you want to repay"
        : `Select the amount of ${name} to withdraw from the Cauldron`;
    },
  },

  methods: {
    onToggleDeleverage() {
      this.$emit("updateToggle", "useDeleverage", true);
    },

    onUpdateWithdrawAmount(amount: BigNumber) {
      this.$emit("updateAmounts", "withdrawAmount", amount);
    },

    onUpdateRepayAmount(amount: BigNumber) {
      this.$emit("updateAmounts", "repayAmount", amount);
    },

    onUpdateDeleverageAmounts(amounts: SwapAmounts) {
      this.$emit("updateAmounts", "deleverageAmounts", amounts);
    },

    onUpdateSlippage(slippage: BigNumber) {
      this.$emit("updateAmounts", "slippage", slippage);
    },

    closePositionHandler() {
      if (this.actionConfig.useDeleverage) return this.maxDeleverage();

      return this.maxRemoveAndRepay();
    },

    maxDeleverage() {
      const { borrowInfo } = this.cauldron.userPosition;
      const { oracleExchangeRate } = this.cauldron.mainParams;

      const { slippage } = this.actionConfig.amounts;

      const deleverageAmounts = getDeleverageAmounts(
        borrowInfo.userBorrowAmount,
        slippage!,
        oracleExchangeRate
      );

      this.onUpdateDeleverageAmounts(deleverageAmounts);

      const withdrawAmount = this.maxToRemove;

      this.onUpdateWithdrawAmount(withdrawAmount);

      this.actionHandler();
    },

    maxRemoveAndRepay() {
      const { collateralInfo, borrowInfo } = this.cauldron.userPosition;

      this.onUpdateRepayAmount(borrowInfo.userBorrowAmount);
      this.onUpdateWithdrawAmount(collateralInfo.userCollateralAmount);
      this.actionHandler();
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    SlippagePopup: defineAsyncComponent(
      () => import("@/components/popups/SlippagePopup.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    RemoveCollateralBlock: defineAsyncComponent(
      () => import("@/components/market/RemoveCollateralBlock.vue")
    ),
    RemoveCollateralRangeBlock: defineAsyncComponent(
      () => import("@/components/market/RemoveCollateralRangeBlock.vue")
    ),
    RepayBlock: defineAsyncComponent(
      () => import("@/components/market/RepayBlock.vue")
    ),
    DeleverageBlock: defineAsyncComponent(
      () => import("@/components/market/DeleverageBlock.vue")
    ),
    OrdersManager: defineAsyncComponent(
      () => import("@/components/market/OrdersManager.vue")
    ),
    GMStatus: defineAsyncComponent(
      () => import("@/components/popups/GMStatus.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.repay-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
  height: 100%;
}

.block-wrap {
  @include block-wrap;
}

.remove-block {
  max-height: 206px;
  height: 100%;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  margin-bottom: 4px;
  position: relative;
}

.title-wrap {
  gap: 16px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 16px;
}

.repay-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  height: 100%;
}

.repay-logic {
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.btns-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media screen and (max-width: 1024px) {
  .repay-form {
    max-width: 640px;
    width: 100%;
  }
}
</style>
