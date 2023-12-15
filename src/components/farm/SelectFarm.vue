<template>
  <button class="select" @click="$emit('openFarmsPopup')">
    <div class="icon-text">
      <BaseTokenIcon
        v-if="selectedFarm"
        :name="selectedFarm.name"
        :icon="selectedFarm.icon"
      />
      <BaseTokenIcon v-else type="select" />
      <span class="select-text">
        {{ selectedFarm ? selectedFarm.name : "Select Farm" }}
      </span>

      <div
        class="chain-tag"
        :style="`background-color:${farmChain.color}`"
        v-if="farmChain"
      >
        <img class="chain-icon" :src="farmChain.icon" />
        <span class="chain-symbol">{{ farmChain.symbol }}</span>
      </div>
    </div>
    <img class="select-arrow" src="@/assets/images/arrow.svg" alt="Arrow" />
  </button>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    selectedFarm: { type: Object },
  },

  computed: {
    farmChain() {
      return this.chains[this.selectedFarm?.chainId];
    },

    chains() {
      return {
        1: {
          symbol: "ETH",
          icon: useImage("assets/images/networks/farm/ethereum.png"),
          color: "rgba(109, 80, 192, 0.24)",
        },
        10: {
          symbol: "OPT",
          icon: useImage("assets/images/networks/farm/optimism.png"),
          color: "rgba(255, 4, 33, 0.24)",
        },
        56: {
          symbol: "BSC",
          icon: useImage("assets/images/networks/farm/binance.png"),
          color: "rgba(239, 187, 61, 0.24)",
        },
        137: {
          symbol: "MATIC",
          icon: useImage("assets/images/networks/farm/polygon.png"),
          color: "rgba(130, 71, 229, 0.24)",
        },
        250: {
          symbol: "FTM",
          icon: useImage("assets/images/networks/farm/fantom.png"),
          color: "rgba(38, 194, 246, 0.24)",
        },
        1285: {
          symbol: "Moonriver",
          icon: useImage("assets/images/networks/farm/moonriver.png"),
          color: "rgba(83, 200, 198, 0.24)",
        },
        2222: {
          symbol: "KAVA",
          icon: useImage("assets/images/networks/farm/kava.png"),
          color: "rgba(209, 61, 114, 0.24)",
        },
        8453: {
          symbol: "Base",
          icon: useImage("assets/images/networks/farm/base.png"),
          color: "rgba(26, 88, 217, 0.24)",
        },
        42161: {
          symbol: "ARB",
          icon: useImage("assets/images/networks/farm/arbitrum.png"),
          color: "rgba(0, 125, 208, 0.24)",
        },
        43114: {
          symbol: "AVAX",
          icon: useImage("assets/images/networks/farm/avalanche.png"),
          color: "rgba(195, 51, 52, 0.24)",
        },
        59144: {
          symbol: "Linea",
          icon: useImage("assets/images/networks/farm/linea.png"),
          color: "rgba(70, 95, 158, 0.24)",
        },
      };
    },
  },

  mounted() {},
  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.select {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
  padding: 8px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.select:disabled {
  cursor: default;
}

.icon-text {
  display: flex;
  align-items: center;
}

.select-arrow {
  width: 16px;
  height: 16px;
}

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
