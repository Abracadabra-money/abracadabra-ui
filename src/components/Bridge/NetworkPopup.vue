<template>
  <div class="popup-wrap" v-if="isOpen">
    <div class="popup" v-click-outside="closePopup">
      <img
        class="popup-close"
        @click="closePopup"
        src="@/assets/images/cross.svg"
        alt="Close popup"
      />
      <p class="title">Select network</p>
      <div class="networks-wrap">
        <button
          v-for="(network, inx) in networksArr"
          :key="inx"
          class="network"
          :class="network.chainId === activeChain.chainId && 'active'"
          @click="enterChain(network.chainId)"
        >
          <img class="network-image" :src="network.icon" alt="network" />
          <span>{{ network.title }}</span>
        </button>
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
      type: Object,
    },

    popupType: {
      type: String,
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
  max-width: 400px;
  width: 100%;
  padding: 20px 20px 86px;
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
  margin-bottom: 23px;
}

.networks-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.network {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  cursor: pointer;
  border: none;
  color: white;
  max-width: 170px;
  width: 100%;
}

.network:not(:last-child) {
  margin-bottom: 10px;
}

.network-image {
  height: 20px;
  min-width: 20px;
  margin-right: 8px;
}

.selected {
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(118, 195, 245, 0.5);
}

.active,
.network:hover {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #6678aa;
}
</style>
