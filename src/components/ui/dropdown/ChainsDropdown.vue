<template>
  <div class="dropdown" v-click-outside="closeDropdown">
    <button class="dropdown-btn" @click="toogleDropdown">
      Chains
      <div
        :class="[
          'selected-chains',
          { 'chains-list': selectedChains.length > 3 },
        ]"
        :style="chainsStyle"
      >
        <img
          class="selected-chain-icon"
          v-for="id in chains"
          :key="id"
          :src="getChainIcon(id)"
        />
        <div class="count">{{ selectedChains.length - 3 }}+</div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        :class="['arrow', { 'arrow-rotate': showDropdownList }]"
      >
        <g clip-path="url(#clip0_1818_12849)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.707 15.7071C12.5194 15.8946 12.2651 15.9999 12 15.9999C11.7348 15.9999 11.4805 15.8946 11.293 15.7071L5.63598 10.0501C5.54047 9.95785 5.46428 9.84751 5.41188 9.7255C5.35947 9.6035 5.33188 9.47228 5.33073 9.3395C5.32957 9.20672 5.35487 9.07504 5.40516 8.95215C5.45544 8.82925 5.52969 8.7176 5.62358 8.6237C5.71747 8.52981 5.82913 8.45556 5.95202 8.40528C6.07492 8.355 6.2066 8.32969 6.33938 8.33085C6.47216 8.332 6.60338 8.35959 6.72538 8.412C6.84739 8.46441 6.95773 8.54059 7.04998 8.6361L12 13.5861L16.95 8.6361C17.1386 8.45394 17.3912 8.35315 17.6534 8.35542C17.9156 8.3577 18.1664 8.46287 18.3518 8.64828C18.5372 8.83369 18.6424 9.0845 18.6447 9.3467C18.6469 9.60889 18.5461 9.8615 18.364 10.0501L12.707 15.7071Z"
            fill="#99A0B2"
          />
        </g>
        <defs>
          <clipPath id="clip0_1818_12849">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>

    <div class="dropdown-list" v-if="showDropdownList">
      <div class="select-all">
        <h6 class="list-title">Select all</h6>
        <Toggle
          :selected="selectedChains.length === orderedActiveChains.length"
          @updateToggle="updateSelectedChain"
        />
      </div>

      <div
        class="list-item"
        v-for="chainId in orderedActiveChains"
        :key="chainId"
      >
        <div class="chain-info">
          <img class="chain-icon" :src="getChainIcon(+chainId)" alt="" />
          <span class="chain-name">{{ getChainName(+chainId) }}</span>
        </div>

        <div
          :class="['checkbox', { active: selectedChains.includes(+chainId) }]"
          @click="updateSelectedChain(+chainId)"
        >
          <svg
            class="checked"
            v-show="selectedChains.includes(+chainId)"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M15.5 5.5L8.83333 12.5L5.5 9"
              stroke="#7088CC"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChainById } from "@/helpers/chains";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    activeChains: {
      type: Array,
      default: () => [],
    },
    selectedChains: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      chainsOrder: [1, 42161, 2222, 43114, 10, 250, 56],
      showDropdownList: false,
    };
  },

  computed: {
    chains() {
      if (!this.selectedChains.length) return [];
      else return [...this.selectedChains].splice(0, 3) || [];
    },

    orderedActiveChains() {
      const orderedActiveChains = this.chainsOrder.filter((orderId) =>
        this.activeChains.find((chain) => chain == orderId)
      );

      this.activeChains.forEach((chain) => {
        if (!this.chainsOrder.find((chainId) => chainId == chain))
          orderedActiveChains.push(chain);
      });

      return orderedActiveChains;
    },

    chainsStyle() {
      if (!this.chains.length) return "";
      return `width: ${20 + 10 * (this.chains.length - 1)}px`;
    },
  },

  methods: {
    getChainIcon,
    getChainName(chainId) {
      const chain = getChainById(chainId);
      return chain.chainName;
    },

    toogleDropdown() {
      if (!this.activeChains.length) return false;
      this.showDropdownList = !this.showDropdownList;
    },

    closeDropdown() {
      this.showDropdownList = false;
    },

    updateSelectedChain(value) {
      this.$emit("updateSelectedChain", value);
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.dropdown {
  position: relative;
}

.dropdown-btn {
  @include button;
  padding: 6px 10px;
  color: #878b93;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in;
  cursor: pointer;
  height: 36px;
}

.dropdown-btn:hover {
  color: #fff;

  path {
    transition: all 0.3s ease-in;
    fill: #fff;
  }
}

.selected-chains {
  width: 0;
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.2s ease-in-out;
  margin-left: 4px;
}

.selected-chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.selected-chain-icon:nth-child(2) {
  position: absolute;
  left: 25%;
}
.selected-chain-icon:nth-child(3) {
  position: absolute;
  left: 50%;
}

.count {
  width: 20px;
  height: 20px;
  border-radius: 50px;
  border: 1px solid #878b93;
  background: #0e172a;
  display: none;
  justify-content: center;
  align-items: center;
}

.chains-list {
  width: 20px;
  .selected-chain-icon:nth-child(3) {
    display: none;
  }

  .count {
    position: absolute;
    left: 50%;
    display: flex;
    font-size: 10px;
    font-weight: 500;
  }
}

path {
  transition: all 0.2s ease-in;
}

.arrow {
  width: 24px;
  height: 24px;
}

.arrow-rotate {
  transition: all 0.3s ease-in;
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 50px;
  left: 0;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(0deg, #131b2d 0%, #131b2d 100%), #151826;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 200px;
  max-height: 220px;
  overflow: hidden;
  overflow-y: scroll;
  z-index: 1;
}

.select-all {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-title {
  font-size: 16px;
  color: #878b93;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chain-info {
  display: flex;
  gap: 4px;
  align-items: center;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.chain-name {
  color: #878b93;
}

.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 2px solid #99a0b2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active {
  border: 2px solid #5971b5;
}

.checked {
  max-width: 18px;
}

@media screen and (max-width: 600px) {
  .dropdown-list {
    left: inherit;
    right: 0;
  }
}
</style>
