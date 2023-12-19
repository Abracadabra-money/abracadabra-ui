<template>
  <div class="chain-tag" :style="`background-color:${farmChain.color}`">
    <img class="chain-icon" :src="farmChain.icon" />
    <span class="chain-symbol">{{ farmChain.symbol }}</span>
  </div>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    chainId: { type: Number },
  },

  computed: {
    farmChain() {
      return this.chains[this.chainId];
    },

    chains() {
      return {
        1: {
          symbol: "ETH",
          icon: useImage("assets/images/chains/ethereum.svg"),
          color: "rgba(109, 80, 192, 0.24)",
        },
        10: {
          symbol: "OPT",
          icon: useImage("assets/images/chains/optimism.svg"),
          color: "rgba(255, 4, 33, 0.24)",
        },
        56: {
          symbol: "BSC",
          icon: useImage("assets/images/chains/binance.svg"),
          color: "rgba(239, 187, 61, 0.24)",
        },
        137: {
          symbol: "MATIC",
          icon: useImage("assets/images/chains/polygon.svg"),
          color: "rgba(130, 71, 229, 0.24)",
        },
        250: {
          symbol: "FTM",
          icon: useImage("assets/images/chains/fantom.svg"),
          color: "rgba(38, 194, 246, 0.24)",
        },
        1285: {
          symbol: "Moonriver",
          icon: useImage("assets/images/chains/moonriver.svg"),
          color: "rgba(83, 200, 198, 0.24)",
        },
        2222: {
          symbol: "KAVA",
          icon: useImage("assets/images/chains/kava.svg"),
          color: "rgba(209, 61, 114, 0.24)",
        },
        8453: {
          symbol: "Base",
          icon: useImage("assets/images/chains/base.svg"),
          color: "rgba(26, 88, 217, 0.24)",
        },
        42161: {
          symbol: "ARB",
          icon: useImage("assets/images/chains/arbitrum.svg"),
          color: "rgba(0, 125, 208, 0.24)",
        },
        43114: {
          symbol: "AVAX",
          icon: useImage("assets/images/chains/avalanche.svg"),
          color: "rgba(195, 51, 52, 0.24)",
        },
        59144: {
          symbol: "Linea",
          icon: useImage("assets/images/chains/linea.svg"),
          color: "rgba(70, 95, 158, 0.24)",
        },
      };
    },
  },

  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.chain-tag {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  gap: 4px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 9px 0px rgba(134, 92, 230, 0.08);
  margin-left: 12px;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.chain-symbol {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}
</style>
