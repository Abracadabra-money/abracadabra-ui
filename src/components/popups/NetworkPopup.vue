<template>
  <TransitionWrapper>
    <div class="popup-wrap" @click.self="closePopup" v-if="isOpen">
      <div class="popup" v-if="isOpen">
        <h3 class="title">
          Select Chain
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
            v-for="(network, inx) in networksArr"
            :key="inx"
            @click="switchHandler(network.chainId)"
          >
            <div class="description">
              <div class="chain-icon-wrap">
                <img
                  class="current-chain-marker"
                  src="@/assets/images/beam/current-chain-marker.png"
                  v-if="network.chainId == activeChain"
                />
                <img class="chain-icon" :src="network.networkIcon" alt="Icon" />
              </div>
              <p class="chain-title">{{ network.chainName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionWrapper>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { switchNetwork } from "@/helpers/chains/switchNetwork";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    networksArr: {
      type: Array,
      default: () => [],
    },

    activeChain: {
      type: [String, Number],
    },

    popupType: {
      type: String,
    },
  },

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    async switchHandler(chainId) {
      await switchNetwork(chainId);
      this.closePopup();
    },
  },

  components: {
    TransitionWrapper: defineAsyncComponent(() =>
      import("@/components/ui/TransitionWrapper.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  display: grid;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding-top: 50px;
  background: rgba(25, 25, 25, 0.41);
  backdrop-filter: blur(3px);
}

.popup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  padding: 28px 28px 38px 28px;
  width: 533px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: #101622;
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
  min-width: 100%;
  border-radius: 20px;
  padding: 16px 0;
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

@media screen and (max-width: 600px) {
  .popup-wrap {
    padding: 0 15px;
  }

  .popup {
    padding: 16px;
    width: 100%;
  }

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
    border-radius: 50px;
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
