<template>
  <div class="popup-wrap" v-if="isOpen">
    <div class="popup" v-click-outside="closePopup">
      <img
        class="popup-close"
        @click="closePopup"
        src="@/assets/images/cross.svg"
        alt="Close popup"
      />
      <p class="title">Settings</p>

      <div class="popup-item">
        <div class="item-header">
          <p class="item-title">Slippage tolerance</p>
          <img src="@/assets/images/info.svg" alt="Tooltip" />
        </div>
        <input class="item-input" placeholder="Arto 1.0%" type="text" />
      </div>

      <div class="popup-item">
        <div class="item-header">
          <p class="item-title">Transaction ...</p>
          <img src="@/assets/images/info.svg" alt="Tooltip" />
        </div>
        <input class="item-input" placeholder="minutes" type="text" />
      </div>

      <div class="btn-wrap">
        <DefaultButton primary>Remove</DefaultButton>
      </div>
    </div>
  </div>
</template>

<script>
const DefaultButton = () => import("@/components/main/DefaultButton");
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
  },

  components: { DefaultButton },
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
  max-width: 300px;
  width: 100%;
  padding: 20px;
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  position: relative;
  height: 480px;
}

.popup-close {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.title {
  text-align: left;
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
  padding-bottom: 19px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.popup-item {
  margin-bottom: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.item-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.item-input {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(100px);
  border-radius: 20px;
  width: 100%;
  height: 50px;
  border: none;
  outline: transparent;
  padding: 0 30px;
  color: rgba(255, 255, 255, 0.6);
}

.item-input::placeholder {
  font-size: 20px;
  line-height: 30px;
  display: flex;
  align-items: center;
  text-align: center;

  color: rgba(255, 255, 255, 0.6);
}

.btn-wrap {
  margin-top: 130px;
}
</style>
