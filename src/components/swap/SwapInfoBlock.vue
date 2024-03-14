<template>
  <div class="swap-info">
    <div class="swap-info-item">
      <div class="info-title">Current price</div>
      <CurrentPrice :fromToken="fromToken" :toToken="toToken" />
    </div>
    <div class="swap-info-item" v-if="showPriceImpact">
      <div class="info-title">Price Impact</div>
      <div class="info-value">93.00%</div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Minimum received</div>
      <div class="info-value" v-if="isSelectedTokens">
        {{ minimumReceived }} {{ toToken?.config.name }}
      </div>
      <div class="info-value" v-else>-</div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Network Fee</div>
      <div class="info-value"><FeeIcon /> $0.01</div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent, type Prop } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";

export default {
  props: {
    fromToken: Object as Prop<TokenInfo>,
    toToken: Object as Prop<TokenInfo>,
    minAmount: BigInt as Prop<bigint>,
    showPriceImpact: { type: Boolean, default: true },
  },

  computed: {
    isSelectedTokens() {
      if (!this.toToken || !this.fromToken) return false;
      const { name: toTokenName } = this.toToken.config;
      const { name: fromTokenName } = this.fromToken.config;
      return ![toTokenName, fromTokenName].includes("Select Token");
    },

    minimumReceived() {
      return formatTokenBalance(
        formatUnits(this.minAmount || 0n, this.toToken?.config.decimals || 18)
      );
    },
  },

  components: {
    CurrentPrice: defineAsyncComponent(
      () => import("@/components/pools/CurrentPrice.vue")
    ),
    FeeIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/FeeIcon.vue")
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
</style>
