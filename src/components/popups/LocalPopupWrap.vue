<template>
  <div class="popup-wrap" @click="closePopup" ref="backdrop">
    <div :class="['popup', { farmPopup: isFarm }]" @click.stop ref="popup">
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
import gsap from "gsap";

export default {
  name: "LocalPopupWrap",
  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
    isFarm: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openingAnimation() {
      gsap.fromTo(
        this.$refs.backdrop,
        { autoAlpha: 0 },
        { duration: 0.3, autoAlpha: 1, display: "grid" }
      );
      gsap.fromTo(
        this.$refs.popup,
        { scale: 0 },
        { duration: 0.3, scale: 1, ease: "power2.out" }
      );
    },

    closingAnimation() {
      gsap.to(this.$refs.backdrop, { duration: 0.3, autoAlpha: 0 });
      gsap.to(this.$refs.popup, {
        duration: 0.3,
        scale: 0,
        ease: "power2.in",
      });
    },

    closePopup() {
      this.closingAnimation();
      this.$emit("closePopup");
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  overflow-y: auto;
  padding-top: 50px;
}

.popup {
  padding: 10px 10px 16px;
  background: #302e38;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  position: relative;

  max-width: 95vw;

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

.farmPopup {
  width: 533px;
  padding: 32px;
  gap: 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

@media screen and (max-width: 600px) {
  .farmPopup {
    padding: 24px 16px;
  }
}
</style>
