<template>
  <div class="popup-wrap" v-if="isOpen" @click="closePopup">
    <div class="popup" @click.stop>
      <div>
        <button class="close-btn" @click="closePopup">
          <img
            class="close-img"
            src="@/assets/images/cross.svg"
            alt="Close popup"
          />
        </button>
        <p class="title">Settings</p>
        <div class="subtitle-wrap">
          <p class="subtitle">Slippage tolerance</p>
          <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
        </div>
        <input
          v-model="tolerance"
          type="text"
          placeholder="Auto 1.0%"
          class="settings-input"
        />
        <div class="subtitle-wrap">
          <p class="subtitle">Transaction deadline</p>
          <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
        </div>
        <input
          v-model="deadline"
          type="text"
          placeholder="minutes"
          class="settings-input"
        />
      </div>
      <DefaultButton primary>Save</DefaultButton>
    </div>
  </div>
</template>

<script>
import DefaultButton from "@/components/main/DefaultButton.vue";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    tolerance: "",
    deadline: "",
  }),

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
  },
  components: {
    DefaultButton,
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 300px;
  width: 100%;
  padding: 20px 20px 46px;
  background: #302e38;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  position: relative;
  min-height: 480px;
}

.close-btn {
  position: absolute;
  top: 27px;
  right: 20px;
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.close-img {
  width: 14px;
  height: 14px;
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 23px;
}
.subtitle-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  .subtitle {
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
  }
}

.settings-input {
  background-color: rgba(255, 255, 255, 0.1);
  height: 50px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  margin-top: 6px;
  color: white;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
