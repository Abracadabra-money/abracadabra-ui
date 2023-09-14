<template>
  <div class="dropdown" v-click-outside="closeDropdown">
    <button
      class="dropdown-header"
      :class="{ 'dropdown-open': isOpenDropdown }"
      @click="toogleDropdown"
    >
      <div class="chain-info">
        <img class="sort-icon" :src="activeChain.icon" alt="Sort reverse" />
        <span>{{ activeChain.symbol }}</span>
      </div>
      <img
        class="arrow-icon"
        src="@/assets/images/arrow-down.svg"
        alt="Arrow"
      />
    </button>

    <div class="dropdown-list" v-show="isOpenDropdown">
      <button
        class="dropdown-item"
        v-for="(data, i) in chainsInfo"
        @click="changeDropdownValue(data.chainId)"
        :key="i"
      >
        <img class="dropdown-item-icon" :src="data.icon" alt="" />
        {{ data.symbol }} {{ data.id }}
      </button>
    </div>
  </div>
</template>

<script>
import { useImage } from "@/helpers/useImage";

export default {
  data() {
    return {
      isSortReverse: false,
      isOpenDropdown: false,
      sortList: [
        {
          title: "Title",
          name: "name",
        },
        {
          title: "TVL",
          name: "tvl",
        },
        {
          title: "MIMs Left",
          name: "mimLeftToBorrow",
        },
        {
          title: "Interest",
          name: "interest",
        },
        {
          title: "Fee",
          name: "fee",
        },
      ],
      activeSortValue: "name",

      chainsInfo: {
        1: {
          chainId: 1,
          icon: useImage("assets/images/networks/ethereum-icon.svg"),
          symbol: "ETH",
        },
        42161: {
          chainId: 42161,
          icon: useImage("assets/images/networks/arbitrum-icon.svg"),
          symbol: "AETH",
        },
        43114: {
          chainId: 43114,
          icon: useImage("assets/images/networks/avalanche-icon.png"),
          symbol: "AVAX",
        },
        250: {
          chainId: 250,
          icon: useImage("assets/images/networks/fantom-icon.svg"),
          symbol: "FTM",
        },
        56: {
          chainId: 56,
          icon: useImage("assets/images/networks/binance-icon.svg"),
          symbol: "BSC",
        },
        137: {
          chainId: 137,
          icon: useImage("assets/images/networks/polygon-icon.svg"),
          symbol: "MATIC",
        },
        1285: {
          chainId: 1285,
          icon: useImage("assets/images/networks/moonriver.svg"),
          symbol: "Moonriver",
        },
        2222: {
          chainId: 2222,
          icon: useImage("assets/images/networks/kava.png"),
          symbol: "Kava EVM",
        },
        8453: {
          chainId: 8453,
          icon: useImage("assets/images/networks/base.png"),
          symbol: "Base",
        },
        59144: {
          chainId: 59144,
          icon: useImage("assets/images/networks/linea.png"),
          symbol: "Linea",
        },
      },
      activeChain: {
        id: 6,
        icon: useImage("assets/images/tokens/ETH.png"),
        symbol: "ETH",
      },
    };
  },

  computed: {
    dropdownList() {
      return this.sortList.filter(({ name }) => name !== this.activeSortValue);
    },
  },

  methods: {
    toogleDropdown() {
      this.isOpenDropdown = !this.isOpenDropdown;
    },

    closeDropdown() {
      this.isOpenDropdown = false;
    },

    changeDropdownValue(chainId) {
      this.closeDropdown();
      this.$emit("changeForkId", chainId);
      this.activeChain = this.chainsInfo[chainId];
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}

.dropdown-header {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 17px 0 12px;
  border-radius: 20px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: hsla(0, 0%, 100%, 0.06);

  &:hover {
    background-color: #55535d;
  }
}

.dropdown-open {
  background: #55535d;
  border-radius: 20px 20px 0 0;
}

.sort-icon {
  width: 20px;
}

.sort-reverse {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  width: 100%;
  z-index: 1;
  top: 50px;
  // border: 1px solid red;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 0 0 20px 20px;
}

.dropdown-item {
  height: 50px;
  width: 100%;
  border: none;
  color: white;
  cursor: pointer;
  background-color: #55535d;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  &:hover {
    color: #76c3f5;
  }
}

.dropdown-item-icon {
  max-width: 20px;
  width: 100%;
}

.chain-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-icon {
  width: 30px;
}
</style>
