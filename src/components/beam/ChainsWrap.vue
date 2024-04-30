<template>
  <div class="chains-wrap">
    <h4 class="select-title">Select Networks</h4>
    <div class="chains-swap">
      <button class="select-item" @click="chainSelectHandler('from')">
        <div class="icon-wrap">
          <img class="chain-icon" :src="fromChainInfo.icon" alt="Icon" />
        </div>
        <p class="select-button-text">From: {{ fromChainInfo.title }}</p>
      </button>

      <button
        class="switch-chain-button"
        :disabled="isSwitchChainsDisabled"
        @click="switchChains"
      >
        <img
          class="switch-chain-image"
          src="@/assets/images/beam/switch-button.svg"
          alt="Switch network"
        />
      </button>

      <button class="select-item" @click="chainSelectHandler('to')">
        <div class="icon-wrap">
          <img class="chain-icon" :src="toChainInfo.icon" alt="Icon" />
        </div>
        <p class="select-button-text">To: {{ toChainInfo.title }}</p>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import type { BeamConfig } from "@/helpers/beam/types";

import { mapGetters } from "vuex";
import { useImage } from "@/helpers/useImage";
import type { PropType } from "vue";

const EmptyChain = {
  title: "Select Chain",
  icon: useImage(`assets/images/networks/no-chain.svg`),
};

export default {
  emits: ["onChainSelectClick", "switchChains"],
  props: {
    fromChain: {
      type: Object as PropType<BeamConfig>,
    },
    toChain: {
      type: Object as PropType<BeamConfig>,
    },
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    fromChainInfo() {
      if (!this.fromChain) return EmptyChain;

      return {
        title: this.fromChain.chainName,
        icon: this.fromChain.icon,
      };
    },

    toChainInfo() {
      if (!this.toChain) return EmptyChain;

      return {
        title: this.toChain.chainName,
        icon: this.toChain.icon,
      };
    },

    isSwitchChainsDisabled() {
      return !this.fromChain || !this.toChain;
    },
  },

  methods: {
    chainSelectHandler(type: "from" | "to") {
      this.$emit("onChainSelectClick", type);
    },
    switchChains() {
      this.$emit("switchChains");
    },
  },
};
</script>

<style lang="scss" scoped>
.chains-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 40px;
}

.select-title {
  align-self: self-start;
  font-size: 24px;
  font-weight: 500;
}

.chains-swap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 134px;
  width: 100%;
  gap: 54px;
}

.select-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

.icon-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  border-radius: 58px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.2) 0%,
    rgba(116, 92, 210, 0.2) 100%
  );
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
  transition: box-shadow 0.3s ease;
}

.icon-wrap:hover {
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.335);
}

.chain-icon {
  width: 78px;
  height: 78px;
  border-radius: 50%;
}

.switch-chain-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  min-width: 44px;
  height: 44px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(67.9000015258789px);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.switch-chain-button:hover {
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.335);
}

.switch-chain-button:disabled,
.switch-chain-button:disabled:hover {
  opacity: 0.5;
  box-shadow: none;
  border: 1px solid #2d4b9625;
}

.disabled {
  opacity: 0.5;
}

.switch-chain-image {
  width: 16px;
  height: 16px;
}

.select-button-text {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .chains-swap {
    gap: 5px;
  }

  .select-item {
    width: 100%;
  }

  .chain-icon {
    width: 64px;
    height: 64px;
  }

  .select-button-text {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
