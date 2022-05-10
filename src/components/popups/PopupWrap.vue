<template>
  <div class="popup-wrap" v-if="isOpened" @click="closePopup">
    <div class="popup" @click.stop :style="{ maxWidth, minHeight: height }">
      <div class="popup-content">
        <button class="close-btn" @click="closePopup">
          <img
            class="close-img"
            src="@/assets/images/cross.svg"
            alt="Close popup"
          />
        </button>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopupWrap",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: "300px",
    },
    height: {
      type: String,
      default: "480px",
    },
  },
  methods: {
    closePopup() {
      this.isOpened = false;
    },
  },
  computed: {
    isOpened: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    isOpened(value) {
      document.body.style.overflow = value ? "hidden" : "auto";
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
  padding: $headerHeight 10px 60px;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
}

.popup {
  width: 100%;
  padding: 10px 10px 36px;
  background: #302e38;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  position: relative;

  .popup-content {
    height: 100%;
  }
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
</style>
