<template>
  <div class="market-actions-wrap">
    <div class="deposit-wrap">
      <RemoveCollateralBlock
        :cauldron="cauldron"
        :inputAmount="repayConfig.amounts.withdrawAmount"
        :repayAmount="repayConfig.amounts.repayAmount"
        @updateWithdrawAmount="onUpdateWithdrawAmount"
      />
    </div>

    <div class="borrow-wrap">
      <div>
        <div class="row">
          <h3 class="title">Borrow MIM</h3>

          <Toggle
            :selected="repayConfig.useDeleverage"
            text="Deleverge"
            @updateToggle="onToggleDeleverage"
          />
        </div>

        <h4 class="subtitle">
          Select the amount of MIM to borrow from the Cauldron
        </h4>
      </div>

      <RepayBlock
        :cauldron="cauldron"
        :inputAmount="repayConfig.amounts.repayAmount"
        :withdrawAmount="repayConfig.amounts.withdrawAmount"
        @updateRepayAmount="onUpdateRepayAmount"
      />

      <BaseButton primary disabled>Nothing to do </BaseButton>
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
      repayConfig: {
        useDeleverage: false,
        amounts: {
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
    onToggleDeleverage() {
      this.repayConfig.useDeleverage = !this.repayConfig.useDeleverage;
    },
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    LtvRange: defineAsyncComponent(
      () => import("@/components/ui/range/LtvRange.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    RemoveCollateralBlock: defineAsyncComponent(
      () => import("@/components/market/RemoveCollateralBlock.vue")
    ),
    RepayBlock: defineAsyncComponent(
      () => import("@/components/market/RepayBlock.vue")
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
  margin-bottom: 4px;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 16px;
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
