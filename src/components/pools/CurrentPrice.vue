<template>
  <div class="current-price" v-if="isSelectedTokens">
    <SwapIcon pointer fill="#7088CC" @click="toggle = !toggle" />
    <span
      >1 {{ fromTokenName }} = {{ tokensRateToShow }} {{ toTokenName }}</span
    >
    <span>({{ price }})</span>
  </div>
  <div v-else>-</div>
</template>

<script lang="ts">
import { defineAsyncComponent, type Prop } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";

type Token = {
  config: {
    contract: { address: string; abi: any };
    decimals: number;
    icon: string;
    name: string;
  };
  price: number;
  userInfo: {
    balance: bigint;
    allownce: bigint;
  };
};

export default {
  props: {
    fromToken: Object as Prop<Token | any>,
    toToken: Object as Prop<Token | any>,
    currentPriceInfo: {
      default: () => ({
        midPrice: 0n,
        amounts: { from: 0n, to: 0n },
        fromBase: false,
      }),
    },
  },

  data() {
    return {
      toggle: false,
    };
  },

  computed: {
    isSelectedTokens() {
      if (!this.toToken || !this.fromToken) return false;
      const { name: toTokenName } = this.toToken.config;
      const { name: fromTokenName } = this.fromToken.config;
      return ![toTokenName, fromTokenName].includes("Select Token");
    },

    tokensRateByDefelLama() {
      return this.fromToken.price / this.toToken.price;
    },

    tokensRate() {
      const precition = 1000000000000000000;
      const { midPrice, fromBase } = this.currentPriceInfo;
      const { from, to } = this.currentPriceInfo.amounts;

      if (from > 0n && to > 0n) {
        return Number(to) / Number(from);
      }

      if (midPrice === 0n) return this.tokensRateByDefelLama;

      const rate = fromBase
        ? Number(midPrice) / precition
        : precition / Number(midPrice);
      return rate;
    },

    tokensRateToShow() {
      return this.toggle
        ? formatTokenBalance(1 / this.tokensRate)
        : formatTokenBalance(this.tokensRate);
    },

    fromTokenName() {
      return this.toggle
        ? this.toToken.config.name
        : this.fromToken.config.name;
    },
    toTokenName() {
      return this.toggle
        ? this.fromToken.config.name
        : this.toToken.config.name;
    },

    price() {
      return this.toggle
        ? formatUSD(1 / this.tokensRate * this.fromToken.price)
        : formatUSD(this.tokensRate * this.toToken.price);
    },
  },

  methods: {
    formatUSD,
  },

  components: {
    SwapIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SwapIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.current-price {
  font-weight: 500;
  gap: 4px;
  display: flex;
  align-items: center;
}
</style>
