<template>
  <div class="popup-wrap" v-if="isOpen" @click="closePopup">
    <div class="popup">
      <img
        class="popup-close"
        @click="closePopup"
        src="@/assets/images/cross.svg"
        alt="Close popup"
      />
      <h3 class="title">Select network</h3>
      <div class="content-wrap">
        <div
          class="select-item"
          :class="network.chainId === activeChain && selectChain && 'active'"
          v-for="(network, inx) in networksArr"
          :key="inx"
          @click="enterChain(network.chainId)"
        >
          <div class="description">
            <img class="chain-icon" :src="network.icon" alt="Icon" />
            <p>{{ network.title }}</p>
          </div>
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
.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: $headerHeight 10px 60px;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
}

.popup {
  max-width: 585px;
  width: 100%;
  padding: 20px 20px 30px;
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  position: relative;
}

.popup-close {
  width: 14px;
  height: 14px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 23px;
  margin-bottom: 30px;
}

.content-wrap {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.select-item {
  max-width: 168px;
  border: 2px solid transparent;
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 16px;
  cursor: pointer;
}

.description {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

.chain-icon {
  width: 60px;
  height: 60px;
}

@media screen and (max-width: 500px) {
  .content-wrap {
    grid-template-columns: repeat(2, 1fr);
  }
}

.active,
.select-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #6678aa;
}
</style>
