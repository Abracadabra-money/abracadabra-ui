<template>
  <div class="banner" v-if="isBanner">
    <img
      class="banner-close"
      src="@/assets/images/close.svg"
      @click="closeBanner"
      alt="Close"
    />

    <img
      class="banner-img"
      src="@/assets/images/banner/coins.png"
      alt="Coins"
    />

    <div class="banner-text">
      Metamask currently does not support signatures using Ledger/Trezor devices
    </div>

    <BaseButton :width="'112px'"> Button </BaseButton>
  </div>
</template>

<script>
const BaseButton = () => import("@/components/base/BaseButton");
export default {
  data() {
    return {
      isBanner: true,
    };
  },

  methods: {
    closeBanner() {
      this.isBanner = false;
    },
  },

  components: {
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.banner {
  max-width: 920px;
  width: 100%;
  background: rgba(64, 58, 92, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  margin: 0 auto;
  padding: 12px 54px 12px 20px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  z-index: 10;
}

.banner-close {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}

.banner-img {
  max-width: 55px;
}
</style>
