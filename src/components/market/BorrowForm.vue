<template>
  <div class="borrow-form">
    <!-- TODO: MOVE TO MARKET -->
    <OrdersManager
      v-if="cauldron && cauldron.config.cauldronSettings.isGMXMarket"
      :cauldronObject="cauldron"
      :recoverLeverage="gmRecoverLeverageOrder"
      :deleverageFromOrder="gmDeleverageFromOrder"
    />

    <div class="deposit-wrap">
      <DepositBlock
        :cauldron="cauldron"
        :inputAmpunt="actionConfig.amounts.depositAmounts.inputAmount"
        :useNativeToken="actionConfig.useNativeToken"
        :useUnwrapToken="actionConfig.useUnwrapToken"
        :toggleNativeToken="onToggleNativeToken"
        :toggleUnwrapToken="onToggleUnwrapToken"
        @updateDepositAmounts="onUpdateDepositAmounts"
      />
    </div>

    <div class="borrow-wrap">
      <div class="borrow-logic">
        <div class="borrow-head">
          <div class="borrow-head-row">
            <h3 class="title-wrap">
              <span> Mint MIM</span>
              <SlippagePopup
                v-if="actionConfig.useLeverage"
                :amount="actionConfig.amounts.slippage"
                @updateSlippage="onUpdateSlippage"
              />
            </h3>

            <Toggle
              v-if="isLeverageAllowed"
              :selected="actionConfig.useLeverage"
              text="Leverage"
              @updateToggle="onToggleLeverage"
            />
          </div>

          <h4 class="subtitle">
            Select the amount of MIM to borrow from the Cauldron
          </h4>
        </div>

        <LeverageBlock
          v-if="actionConfig.useLeverage"
          :slippage="actionConfig.amounts.slippage"
          :depositCollateralAmount="
            actionConfig.amounts.depositAmounts.collateralTokenAmount
          "
          :leverageAmounts="actionConfig.amounts.leverageAmounts"
          :cauldron="cauldron"
          @updateLeverageAmounts="onUpdateLeverageAmounts"
        />

        <BorrowBlock
          v-else
          :cauldron="cauldron"
          :inputAmount="actionConfig.amounts.borrowAmount"
          :collateralTokenAmount="
            actionConfig.amounts.depositAmounts.collateralTokenAmount
          "
          @updateBorrowAmount="onUpdateBorrowAmount"
        />
      </div>

      <BaseButton
        primary
        :disabled="!cookValidationData.isAllowed"
        @click="actionHandler"
        >{{ cookValidationData.btnText }}</BaseButton
      >
    </div>
  </div>

  <LocalPopupWrap
    :isOpened="isDeleverageInfoPopupOpened"
    :isFarm="true"
    @closePopup="isDeleverageInfoPopupOpened = false"
  >
    <NoDeleverageConfirmationPopup
      :cauldron="cauldron"
      :actionConfig="actionConfig"
      @confirmAction="actionHandler"
    />
  </LocalPopupWrap>

  <!-- TODO: MOVE TO MARKET -->
  <template v-if="activeOrder && isOpenGMPopup">
    <GMStatus
      :isOpened="isOpenGMPopup"
      @closePopup="closeGMPopup"
      :order="activeOrder"
      :orderType="1"
      :cauldronObject="cauldron"
      :successLeverageCallback="successGmLeverageCallback"
    />
  </template>
</template>

<script lang="ts">
import type { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";
import type { DepositAmounts, SwapAmounts } from "@/helpers/cauldron/types";
//@ts-ignore
import tempMixin from "@/mixins/temp";

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
      action: "borrow",
      isDeleverageInfoPopupOpened: false,
    };
  },
  computed: {
    isLeverageAllowed() {
      const { isSwappersActive } = this.cauldron.config.cauldronSettings;

      return isSwappersActive && this.cauldron.contracts.leverageSwapper;
    },
  },

  methods: {
    onToggleNativeToken() {
      this.$emit("updateToggle", "useNativeToken", true);
    },

    onToggleUnwrapToken() {
      this.$emit("updateToggle", "useUnwrapToken", true);
    },

    onToggleLeverage() {
      this.$emit("updateToggle", "useLeverage", true);
    },

    onUpdateDepositAmounts(amounts: DepositAmounts) {
      this.$emit("updateAmounts", "depositAmounts", amounts);
    },

    onUpdateBorrowAmount(amount: BigNumber) {
      this.$emit("updateAmounts", "borrowAmount", amount);
    },

    onUpdateLeverageAmounts(amounts: SwapAmounts) {
      this.$emit("updateAmounts", "leverageAmounts", amounts);
    },

    onUpdateSlippage(slippage: BigNumber) {
      this.$emit("updateAmounts", "slippage", slippage);
    },
  },

  components: {
    DepositBlock: defineAsyncComponent(
      () => import("@/components/market/DepositBlock.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    SlippagePopup: defineAsyncComponent(
      () => import("@/components/popups/SlippagePopup.vue")
    ),
    LeverageBlock: defineAsyncComponent(
      () => import("@/components/market/LeverageBlock.vue")
    ),
    BorrowBlock: defineAsyncComponent(
      () => import("@/components/market/BorrowBlock.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    OrdersManager: defineAsyncComponent(
      () => import("@/components/market/OrdersManager.vue")
    ),
    GMStatus: defineAsyncComponent(
      //@ts-ignore
      () => import("@/components/popups/GMStatus.vue")
    ),
    LocalPopupWrap: defineAsyncComponent(
      () => import("@/components/popups/LocalPopupWrap.vue")
    ),
    NoDeleverageConfirmationPopup: defineAsyncComponent(
      () => import("@/components/popups/NoDeleverageConfirmationPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.borrow-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
  height: 100%;
}

.deposit-wrap {
  @include block-wrap;
}

.borrow-wrap {
  @include block-wrap;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.borrow-logic {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.borrow-head-row {
  height: 30px;
  display: flex;
  margin-bottom: 4px;
  align-items: center;
  justify-content: space-between;
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

.subtitle {
  color: #878b93;
  font-size: 12px;
  line-height: 20px;
}

@media screen and (max-width: 1024px) {
  .borrow-form {
    max-width: 640px;
    width: 100%;
  }
}
</style>
