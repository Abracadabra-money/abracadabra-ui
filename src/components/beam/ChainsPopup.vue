<template>
  <div class="popup" v-if="isOpen" @click="closePopup">
    <h3 class="title">
      Select {{ popupTitle }} chain
      <img
        class="popup-close"
        @click="closePopup"
        src="@/assets/images/cross.svg"
        alt="Close popup"
      />
    </h3>
    <div class="content-wrap">
      <div
        class="select-item"
        v-for="(chain, index) in chainsArray"
        :key="index"
        @click="onChainClick(chain.chainId)"
      >
        <div class="description">
          <div class="chain-icon-wrap">
            <img
              class="current-chain-marker"
              src="@/assets/images/beam/current-chain-marker.png"
              v-if="chain.chainId == activeChain"
            />
            <img class="chain-icon" :src="chain.icon" alt="Icon" />
          </div>
          <p class="chain-title">{{ chain.chainName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { BeamInfo, BeamConfig } from "@/helpers/beam/types";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    popupType: {
      type: String as PropType<"from" | "to">,
    },
    beamInfoObject: {
      type: Object as PropType<BeamInfo>,
      required: true,
    },
    selectedFromChain: {
      type: Object as PropType<BeamConfig> | null,
    },
    selectedToChain: {
      type: Object as PropType<BeamConfig> | null,
    },
  },

  computed: {
    popupTitle() {
      return this.popupType == "to" ? "destination" : "origin";
    },
    chainsArray(): BeamConfig[] {
      if (this.popupType == "from") {
        return this.beamInfoObject.beamConfigs;
      } else {
        return this.beamInfoObject.destinationChainsInfo.map((info) => {
          return info.chainConfig;
        });
      }
    },
    activeChainId() {
      if(this.popupType == "from") {
        return this.selectedFromChain?.chainId;
      } else {
        return this.selectedToChain?.chainId;
      }
    }
  },

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    onChainClick(chainId) {
      this.$emit("changeChain", chainId, this.popupType);
      this.closePopup();
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  padding: 28px 28px 38px 28px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.popup-close {
  width: 17.5px;
  height: 17.5px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.popup-close:hover {
  opacity: 0.7;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 24px;
  font-weight: 500;
}

.content-wrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 4px;
  width: 100%;
}

.select-item {
  padding: 16px 0;
  min-width: 100%;
  border-radius: 20px;
  cursor: pointer;
}

.select-item:hover .description .chain-icon-wrap .chain-icon {
  box-shadow: 0px 0px 9px 0px rgba(255, 255, 255, 0.2);
}

.description {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

.chain-icon-wrap {
  position: relative;
}

.chain-icon {
  width: 60px;
  height: 60px;
  border-radius: 50px;
}

.chain-title {
  font-size: 16px;
  font-weight: 400;
  text-align: center;
}

.current-chain-marker {
  position: absolute;
  top: -8px;
  right: -10px;
}

@media screen and (max-width: 500px) {
  .title {
    font-size: 18px;
  }

  .popup-close {
    width: 24px;
    height: 24px;
  }

  .chain-icon {
    width: 38px;
    height: 38px;
  }

  .chain-title {
    font-size: 14px;
    font-weight: 400;
  }

  .current-chain-marker {
    width: 20px;
    height: 20px;
    top: -4px;
    right: -6px;
  }
}
</style>
