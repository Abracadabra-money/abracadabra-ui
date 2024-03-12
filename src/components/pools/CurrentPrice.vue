<template>
  <div class="current-price" v-if="isSelectedTokens">
    <SwapIcon pointer fill="#7088CC" @click="toggle = !toggle" />
    <span>1 {{ fromTokenName }} = {{ tokensRate }} {{ toTokenName }}</span>
    <span>({{ price }})</span>
  </div>
  <div v-else>-</div>
</template>

<script lang="ts">
import { formatUSD } from "@/helpers/filters";
import { defineAsyncComponent, type Prop } from "vue";

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
  },

  data() {
    return {
      toggle: false,
    };
  },

  computed: {
    isSelectedTokens() {
      if (!this.toToken || this.fromToken) return false;
      const { name: toTokenName } = this.toToken.config;
      const { name: fromTokenName } = this.fromToken.config;
      return ![toTokenName, fromTokenName].includes("Select Token");
    },

    tokensRate() {
      return this.toggle
        ? formatUSD(this.toToken.price / this.fromToken.price)
        : formatUSD(this.fromToken.price / this.toToken.price);
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
        ? formatUSD(this.toToken.price)
        : formatUSD(this.fromToken.price);
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
