<template>
  <div class="statistic-item">
    <div class="title-wrap">
      <img class="icon" :src="data.mainToken.icon" alt="" />
      <h3 class="title">{{ data.name }} tranche</h3>
    </div>

    <div class="row">
      <span class="label">APR</span>
      <span class="value">{{ formatPercent(apy) }}</span>
    </div>

    <div class="row">
      <span class="label">Total rewards</span>
      <span class="value">{{ formatAmountUSD(rewards) }}</span>
    </div>

    <div class="row">
      <span class="label">Total supply</span>
      <span class="value">{{ formatUSD(data.mainToken.totalSupplyUsd) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
// @ts-ignore
import filters from "@/filters/index.js";

export default {
  props: {
    data: { type: Object as any },
    apy: { type: Number, default: 0 },
    rewards: { type: Number, default: 0 },
  },

  methods: {
    formatAmountUSD(amount: number) {
      return filters.formatUSD(amount);
    },

    formatUSD(amount: bigint, decimals = 18) {
      return filters.formatUSD(formatUnits(amount, decimals));
    },

    formatPercent(amount: number) {
      return filters.formatPercent(amount);
    },
  },
};
</script>

<style lang="scss" scoped>
.statistic-item {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #304d99;
  background: linear-gradient(146deg, #0f1323 0%, #0d1629 101.49%);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.title-wrap {
  gap: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  &::first-letter {
    text-transform: uppercase;
  }
}

.icon {
  width: 36px;
  height: 36px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  color: #878b93;
  line-height: 150%;
}

.value {
  font-weight: 500;
  line-height: 150%;
}
</style>
