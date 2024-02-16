<template>
  <div class="balances-block">
    <h3 class="title">Your wallet balance</h3>
    <div class="balance-wrap">
      <div class="balance-item" v-for="config in configs" :key="config.label">
        <h4 class="label">
          {{ config.label }}
        </h4>
        <div class="value">
          <img class="token-icon" :src="config.icon" alt="Token icon" />
          {{ formatTokenBalance(config.balance) }}
        </div>
        <div class="price">{{ formatUSD(config) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    configs: {
      type: Array as any,
      required: true,
    },
  },

  methods: {
    formatTokenBalance(value: bigint, decimals = 18) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    formatUSD(config: any, decimals = 18) {
      const { balance, price }: any = config;
      const balanceUsd: any = balance * price;
      return formatUSD(
        formatUnits(balanceUsd / 1000000000000000000n, decimals)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.balances-block {
  gap: 16px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.45px;
}

.balance-wrap {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.balance-item {
  width: 100%;
  gap: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
}

.label {
  color: #99a0b2;
  font-weight: 500;
  line-height: 150%;
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.value {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  line-height: 32px;
}

.token-icon {
  width: 32px;
  height: 32px;
}

.price {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

@media screen and (max-width: 600px) {
  .balance-wrap {
    gap: 16px;
    flex-direction: column;
  }
}
</style>
