<template>
  <div class="wrapper">
    <h3 class="title">Your wallet balance</h3>

    <div
      class="tranche-info"
      v-for="{ stakeToken, mainToken, name, tokensRate } in trancheInfo"
      :key="stakeToken.name"
    >
      <div class="row">
        <div class="tranche">
          <img class="tranche-icon" :src="stakeToken.icon" alt="" />
          <span class="tranche-name">{{ name }} tranche</span>
        </div>
        <div class="tokens-rate">
          <img class="rate-icon" :src="stakeToken.rateIcon" alt="" />
          1 {{ mainToken.name }} =
          {{ getTokensRate(tokensRate, stakeToken.decimals) }}
          {{ stakeToken.name }}
        </div>
      </div>

      <div class="row">
        <div class="token-info">
          <img class="token-icon" :src="stakeToken.icon" alt="" />
          <span class="token-name"> {{ stakeToken.name }}</span>
        </div>

        <div>
          {{ formatTokenBalance(stakeToken.balance, stakeToken.decimals) }}
        </div>
      </div>

      <div class="row">
        <div class="token-info">
          <img class="token-icon" :src="mainToken.icon" alt="" />
          <span class="token-name"> {{ mainToken.name }}</span>
        </div>

        <div>
          {{ formatTokenBalance(mainToken.balance, mainToken.decimals) }}
        </div>
      </div>

      <div :class="['underline', `underline-${name}`]"></div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import filters from "@/filters/index.js";
import { formatUnits, parseUnits } from "viem";

export default {
  props: {
    trancheInfo: {
      type: Array as any,
    },
  },

  methods: {
    formatTokenBalance(amount: bigint, decimals = 18) {
      return filters.formatTokenBalance(formatUnits(amount, decimals));
    },

    getTokensRate(tokensRate: bigint, decimals: number) {
      const precision = parseUnits("1", decimals);
      return filters.formatTokenBalance(
        formatUnits((precision * tokensRate) / precision, decimals)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 16px 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.title {
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
  margin-bottom: 16px;
}

.tranche-info {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tranche,
.token-info {
  gap: 8px;
  display: flex;
  align-items: center;
}

.tranche-icon {
  width: 28px;
  height: 28px;
}

.tranche-name {
  font-weight: 500;
  line-height: 150%;

  &::first-letter {
    text-transform: uppercase;
  }
}

.tokens-rate {
  display: flex;
  align-items: center;
}

.rate-icon {
  margin-right: 4px;
}

.rate-icon,
.token-icon {
  width: 24px;
  height: 24px;
}

.token-name {
  line-height: 150%;
}

.underline {
  margin: 4px 0 16px;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    270deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 55.73%,
    rgba(255, 255, 255, 0) 100%
  );
}

.underline-junior {
  display: none;
}
</style>
