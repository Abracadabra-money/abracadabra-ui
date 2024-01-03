<template>
  <div class="repay-form">
    <div class="block-wrap remove-block">
      <div class="row">
        <div class="title-wrap">
          <h3>{{ titleText }}</h3>
          <SlippagePopup
            v-if="actionConfig.useDeleverage"
            :amount="actionConfig.amounts.slippage"
            @updateSlippage="onUpdateSlippage"
          />
        </div>

        <Toggle
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
        <BaseButton primary :disabled="!cookValidationData.isAllowed">{{cookValidationData.btnText}}</BaseButton>
        <BaseButton primary disabled v-if="actionConfig.useDeleverage"
          >Close position
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import type { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";
import type { SwapAmounts } from "@/helpers/cauldron/types";
import tempMixin from "@/mixins/temp";

export default {
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
      action: "repay"
    }
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

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
  },
};
</script>

<style lang="scss" scoped>
.repay-form {
  @include font;
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
</style>
