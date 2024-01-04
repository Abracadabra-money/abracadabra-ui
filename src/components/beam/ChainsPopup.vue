<template>
  <div class="popup" v-if="isOpen" @click="closePopup">
    <h3 class="title">
      Select network
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
        @click="enterChain(network.chainId)"
      >
        <div class="description">
          <img
            class="current-chain-marker"
            src="@/assets/images/beam/current-chain-marker.png"
            v-if="network.chainId == currentChainId"
          />
          <img class="chain-icon" :src="network.icon" alt="Icon" />
          <p class="chain-title">{{ network.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    selectChain: {
      type: Boolean,
    },
    currentChainId: { type: Number },
  },

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    enterChain(chainId) {
      this.$emit("enterChain", chainId, this.popupType);
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
  border: 2px solid transparent;
  min-width: 100%;
  border-radius: 20px;
  padding: 16px;
  cursor: pointer;
}

.description {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

.chain-icon {
  width: 60px;
  height: 60px;
}

.chain-title {
  font-size: 16px;
  font-weight: 400;
}

.current-chain-marker {
  position: absolute;
  top: -10%;
  right: 15%;
}

.active,
.select-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #6678aa;
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
  }
}
</style>
