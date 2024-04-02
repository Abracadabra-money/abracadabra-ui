<template>
  <div class="dropdown" v-click-outside="closeDropdown">
    <button
      class="dropdown-header"
      :class="{ 'dropdown-open': isOpenDropdown }"
      @click="toogleDropdown"
    >
      <div class="chain-info">
        <img
          class="chain-icon"
          :src="activeChain.icon"
          :alt="activeChain.symbol"
        />
        <span>{{ activeChain.symbol }}</span>
      </div>

      <img src="@/assets/images/arrow-down.svg" alt="Arrow" />
    </button>

    <div class="dropdown-list" v-show="isOpenDropdown">
      <button
        class="dropdown-item"
        v-for="(data, i) in filteredNetworks"
        @click="changeDropdownValue(data.chainId)"
        :key="i"
      >
        <img class="dropdown-item-icon" :src="data.icon" alt="" />
        {{ data.symbol }}
      </button>
    </div>
  </div>
</template>

<script>
import { chainsConfigs } from "@/helpers/chains/configs";

export default {
  data() {
    return {
      chainsConfigs,
      isOpenDropdown: false,
      activeChain: chainsConfigs[0],
      unsupportedChain: [2222, 59144],
    };
  },

  computed: {
    filteredNetworks() {
      return chainsConfigs.filter(
        (network) =>
          ![...this.unsupportedChain, this.activeChain.chainId].includes(
            network.chainId
          )
      );
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
      this.activeChain = chainsConfigs.find(
        (network) => network.chainId === chainId
      );
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
}

.dropdown-header:hover {
  background-color: #55535d;
}

.dropdown-open {
  background: #55535d;
  border-radius: 20px 20px 0 0;
}

.chain-icon {
  width: 20px;
  max-height: 25px;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  z-index: 1;
  top: 50px;
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
}

.dropdown-item :hover {
  color: #76c3f5;
}

.dropdown-item-icon {
  max-width: 20px;
  width: 100%;
  max-height: 25px;
}

.chain-info {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
