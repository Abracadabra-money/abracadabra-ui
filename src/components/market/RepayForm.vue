<template>
  <div class="repay-form">
    <div class="block-wrap remove-block">
      <div class="row">
        <div class="title-wrap">
          <h3>{{ titleText }}</h3>
          <SlippagePopup v-if="repayConfig.useDeleverage" />
        </div>

        <Toggle
          :selected="repayConfig.useDeleverage"
          text="Deleverge"
          @updateToggle="onToggleDeleverage"
        />
      </div>

      <h4 class="subtitle">{{ subtitleText }}</h4>

      <RemoveCollateralBlock
        v-if="!repayConfig.useDeleverage"
        :cauldron="cauldron"
        :inputAmount="repayConfig.amounts.withdrawAmount"
        :repayAmount="repayConfig.amounts.repayAmount"
        @updateWithdrawAmount="onUpdateWithdrawAmount"
      />

      <DeleverageBlock
        v-else
        :cauldron="cauldron"
        :deleverageAmounts="repayConfig.amounts.deleverageAmounts"
        :withdrawAmount="repayConfig.amounts.withdrawAmount"
        @updateDeleverageAmounts="onUpdateDeleverageAmounts"
      />
    </div>

    <div class="block-wrap repay-block">
      <div class="repay-logic">
        <RepayBlock
          v-if="!repayConfig.useDeleverage"
          :cauldron="cauldron"
          :inputAmount="repayConfig.amounts.repayAmount"
          :withdrawAmount="repayConfig.amounts.withdrawAmount"
          @updateRepayAmount="onUpdateRepayAmount"
        />

        <RemoveCollateralRangeBlock
          v-else
          :cauldron="cauldron"
          :deleverageAmounts="repayConfig.amounts.deleverageAmounts"
          :withdrawAmount="repayConfig.amounts.withdrawAmount"
          @updateWithdrawAmount="onUpdateWithdrawAmount"
        />
      </div>

      <div class="btns-wrap">
        <BaseButton primary disabled>Nothing to do </BaseButton>
        <BaseButton primary disabled v-if="repayConfig.useDeleverage"
          >Close position
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  data() {
    return {
      showSlippagePopup: false,
      repayConfig: {
        useLeverage: false,
        useDeleverage: true,

        amounts: {
          // TODO: rename to depositAmounts
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
          deleverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          repayAmount: BigNumber.from(0),
          withdrawAmount: BigNumber.from(0),
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    titleText() {
      const { useDeleverage } = this.repayConfig;
      return useDeleverage ? "Deleverage" : "Remove collateral";
    },

    subtitleText() {
      const { useDeleverage } = this.repayConfig;
      const { name } = this.cauldron.config.collateralInfo;
      return useDeleverage
        ? "Choose the amount of MIM you want to repay"
        : `Select the amount of ${name} to withdraw from the Cauldron`;
    },
  },

  watch: {
    repayConfig: {
      handler(value) {
        this.$emit("updateRepayConfig", value);
      },
      deep: true,
    },
  },

  methods: {
    onUpdateWithdrawAmount(amount: BigNumber) {
      this.repayConfig.amounts.withdrawAmount = amount;
    },
    onUpdateRepayAmount(amount: BigNumber) {
      this.repayConfig.amounts.repayAmount = amount;
    },
    onUpdateDeleverageAmounts(amounts: any) {
      this.repayConfig.amounts.deleverageAmounts = amounts;
    },
    onToggleDeleverage() {
      // IMPORTANT: fix this
      this.repayConfig = {
        useLeverage: false,
        useDeleverage: !this.repayConfig.useDeleverage,

        amounts: {
          // TODO: rename to depositAmounts
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
          deleverageAmounts: {
            amountFrom: BigNumber.from(0),
            amountToMin: BigNumber.from(0),
          },
          repayAmount: BigNumber.from(0),
          withdrawAmount: BigNumber.from(0),
        },
      };
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
