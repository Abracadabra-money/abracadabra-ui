<template>
  <div class="token-ratio">
    <img
      class="mim-icon"
      src="@/assets/images/market/m-icon.svg"
      alt="Mim icon"
    />

    <div class="ratio-icon-wrap">
      <img class="ratio-icon" src="@/assets/images/spell-icon.svg" alt="" />
      <img class="ratio-icon" :src="mainToken.rateIcon" alt="" />
    </div>

    <div>
      <h3 class="title">Ratio</h3>
      <div class="ratio-value">{{ tokensRatio }}</div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import filters from "@/filters/index.js";
import { formatUnits } from "viem";

interface MainToken {
  name: string;
  rateIcon: string;
  rate: bigint;
  decimals: number;
}

interface StakeToken {
  name: string;
}

export default {
  props: {
    mainToken: {
      type: Object as () => MainToken,
      required: true,
    },
    stakeToken: {
      type: Object as () => StakeToken,
      required: true,
    },
  },

  computed: {
    tokensRatio() {
      return `1 ${this.mainToken.name} = ${filters.formatToFixed(
        formatUnits(this.mainToken.rate, this.mainToken.decimals),
        4
      )} ${this.stakeToken.name}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.token-ratio {
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  padding: 24px;
  width: 100%;
  height: 150px;
  position: relative;
  overflow: hidden;
  gap: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mim-icon {
  position: absolute;
  top: 17px;
  left: -11px;
}

.ratio-icon-wrap {
  width: 60px;
  height: 60px;
  padding: 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ratio-icon {
  width: 20px;
  height: 20px;
}

.title {
  font-size: 18px;
  line-height: 150%;
}

.ratio-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 150%;
}

@media screen and (max-width: 600px) {
  .ratio-value {
    font-size: 18px;
  }
}
</style>
