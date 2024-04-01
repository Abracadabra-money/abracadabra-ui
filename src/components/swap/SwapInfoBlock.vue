<template>
  <div class="swap-info">
    <div class="swap-info-item">
      <div class="info-title">Current price</div>
      <CurrentPrice
        :fromToken="actionConfig?.fromToken"
        :toToken="actionConfig?.toToken"
      />
    </div>
    <div class="swap-info-item" v-if="showPriceImpact">
      <div class="info-title">Price Impact</div>
      <div
        :class="['info-value', { warning: isWarning }]"
        v-if="priceImpact && isSelectedTokens"
      >
        {{ priceImpact }}%
      </div>
      <div class="info-value" v-else>-</div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Minimum received</div>
      <div class="info-value" v-if="isSelectedTokens">
        {{ minimumReceived }} {{ actionConfig?.toToken?.config.name }}
      </div>
      <div class="info-value" v-else>-</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  formatPercent,
  formatTokenBalance,
  formatUSD,
} from "@/helpers/filters";
import { formatUnits } from "viem";
import { defineAsyncComponent, type Prop } from "vue";
import type { ActionConfig } from "@/helpers/pools/swap/getSwapInfo";

export default {
  props: {
    minAmount: BigInt as Prop<bigint>,
    actionConfig: Object as Prop<ActionConfig>,
    priceImpact: { type: [String, Number], default: 0 },
    showPriceImpact: { type: Boolean, default: true },
  },

  computed: {
    isSelectedTokens() {
      if (!this.actionConfig) return false;
      const { fromToken, toToken } = this.actionConfig;
      const { name: toTokenName } = toToken.config;
      const { name: fromTokenName } = fromToken.config;
      return ![toTokenName, fromTokenName].includes("Select Token");
    },

    isWarning() {
      return +this.priceImpact <= -15;
    },

    minimumReceived() {
      return formatTokenBalance(
        formatUnits(
          this.minAmount || 0n,
          this.actionConfig?.toToken?.config.decimals || 18
        )
      );
    },
  },

  methods: {
    formatUSD,
    formatPercent,
  },

  components: {
    CurrentPrice: defineAsyncComponent(
      () => import("@/components/pools/CurrentPrice.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.swap-info {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.swap-info-item {
  display: flex;
  justify-content: space-between;
  color: #878b93;
  line-height: normal;
  flex-wrap: wrap;
}

.info-value {
  font-weight: 500;
  gap: 4px;
  display: flex;
  align-items: center;
}

.info-price {
  color: #575c62;
}

.warning {
  color: #8c4040;
}
</style>
