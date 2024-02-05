<template>
  <div :class="['statistic-item', { deprecated: deprecated }]">
    <div class="deprecated-label" v-if="deprecated">Deprecated</div>

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
      <span class="value">{{ formatUSD(rewards) }}</span>
    </div>

    <div class="row">
      <span class="label">Total supply</span>
      <span class="value">{{
        formatAmountUSD(data.mainToken.totalSupplyUsd)
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { formatUSD, formatPercent } from "@/helpers/filters";

export default {
  props: {
    data: { type: Object as any },
    apy: { type: Number, default: 0 },
    rewards: { type: Number, default: 0 },
    deprecated: { type: Boolean, default: false },
  },

  methods: {
    formatUSD,
    formatPercent,

    formatAmountUSD(amount: bigint, decimals = 18) {
      return formatUSD(formatUnits(amount, decimals));
    },
  },
};
</script>

<style lang="scss" scoped>
.statistic-item {
  gap: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 16px 20px 16px;
  border-radius: 12px;
  border: 1px solid #304d99;
  background: linear-gradient(146deg, #0f1323 0%, #0d1629 101.49%);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  position: relative;
}

.deprecated {
  border: 1px solid #4a2130;
}

.deprecated-label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 15px;
  max-width: 120px;
  width: 100%;
  font-size: 10px;
  font-weight: 500;
  position: absolute;
  border-radius: 0px 8px;
  top: 0;
  right: 0;
  background: linear-gradient(180deg, #8c4040 0%, #6b2424 100%),
    linear-gradient(0deg, #2d4a96 0%, #5b7cd1 100%);
}

.title-wrap {
  gap: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.title {
  font-size: 16px;

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

@media screen and (max-width: 1200px) {
  .title {
    font-size: 15px;
  }
}
</style>
