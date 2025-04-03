<template>
  <div class="banner" v-if="showPopup && !closeClicked">
    <img
      class="banner-close"
      src="@/assets/images/close.svg"
      @click="closeBanner"
      alt="Close"
    />
    <img
      class="bg-img-1"
      src="@/assets/images/banner/gmx_banner_bg1.png"
      alt=""
    />
    <img
      class="bg-img-2"
      src="@/assets/images/banner/gmx_banner_bg2.png"
      alt=""
    />
    <img
      class="bg-img-3"
      src="@/assets/images/banner/gmx_banner_bg3.png"
      alt=""
    />

    <img
      class="bg-img-1-mobile"
      src="@/assets/images/banner/gmx_banner_bg1_mob.png"
      alt=""
    />
    <img
      class="bg-img-2-mobile"
      src="@/assets/images/banner/gmx_banner_bg2_mob.png"
      alt=""
    />
    <div class="banner-content">
      <p class="banner-text">
        Deleverage for the gmCauldrons is currently under maintenance, until
        ready please deleverage your collateral manually
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      closeClicked: !!localStorage.getItem("GMXBannerClosed"),
    };
  },
  computed: {
    showPopup() {
      return true;
    },
  },
  methods: {
    closeBanner() {
      localStorage.setItem("GMXBannerClosed", "true");
      this.closeClicked = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.banner-close {
  position: absolute;
  top: 10px;
  right: 16px;
  cursor: pointer;
  z-index: 2;
}

.banner {
  overflow: hidden;
  max-width: 1280px;
  width: 95%;
  min-height: 80px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.52) 0%,
    rgba(116, 92, 210, 0.52) 100%
  );

  border: 1px solid rgba(45, 74, 150, 1);

  backdrop-filter: blur(39.2px);

  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  position: fixed;
  top: 100px;
  left: 50%;
  right: 0;
  z-index: 10;
  transform: translateX(-50%);
}

.banner-content {
//   min-width: 70%;
  max-width: 600px;
  text-align: center;
  position: relative;
}

.bg-img-1 {
  position: absolute;
  bottom: 0;
  left: 21px;
  width: 100%;
  max-width: 262px;
  height: auto;
}
.bg-img-2 {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 530px;
  height: auto;
}
.bg-img-3 {
  position: absolute;
  bottom: 3px;
  left: 40%;
  width: 34px;
  height: auto;
}

.bg-img-1-mobile {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 69px;
  height: auto;
  display: none;
}
.bg-img-2-mobile {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 57px;
  height: auto;
  display: none;
}

.banner-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  letter-spacing: 0.035em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.banner-text,
.banner-link {
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff;
}

.banner-text {
  margin-bottom: 5px;
  position: relative;
}

@media screen and (max-width: 800px) {
  .banner-text {
    font-size: 16px;
  }
}

@media screen and (max-width: 600px) {
    .banner {
        padding: 20px;
    }

  .bg-img-1,
  .bg-img-2,
  .bg-img-3 {
    display: none;
  }

  .bg-img-1-mobile, .bg-img-2-mobile {
    display: block;
  }

  .banner {
    flex-direction: column;
    gap: 10px;
  }

  .banner-content {
    max-width: 240px;
  }
}
</style>
