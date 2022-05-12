<template>
  <div class="home">
    <video
      v-if="!isMobile"
      class="home__video"
      loop
      height="100%"
      autoplay
      muted
      id="vid"
    >
      <source src="../assets/videos/home-animation.mp4" />
    </video>
    <div class="home__content">
      <div class="home__title">
        <h1>Abracadabra.Money</h1>
        <h2>Make your Interest bearing assets liquid</h2>
      </div>
      <div class="home__buttons">
        <BaseButton
          primary
          :width="isMobile ? '288px' : '200px'"
          @click="toBorrowPage"
        >
          Borrow
        </BaseButton>
        <BaseButton
          primary
          :width="isMobile ? '288px' : '200px'"
          @click="toLeveragePage"
        >
          Leverage Up
        </BaseButton>
      </div>
    </div>
  </div>
</template>
<script>
const BaseButton = () => import("@/components/base/BaseButton");

export default {
  data() {
    return {
      isMobile: false,
    };
  },
  methods: {
    toBorrowPage() {
      this.$router.push({ name: "Borrow" });
    },
    toLeveragePage() {
      this.$router.push({ name: "Leverage" });
    },
    onResize() {
      this.isMobile = window.innerWidth < 980;
    },
  },
  created() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  components: {
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.home {
  @media (max-width: 980px) {
    background-image: url("../assets/images/home-bg-full.png");
    padding: 0 10px;
    justify-content: center;
    text-align: center;
  }
  overflow-x: hidden;
  background-color: #4e4b64;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  &__video {
    position: absolute;
    right: 0;
  }
  &__content {
    max-width: 1050px;
    width: 100%;
    margin: 0 auto;
    padding: 100px 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    @media (max-width: 980px) {
      align-items: center;
      justify-content: center;
    }
    @media (max-width: 480px) {
      align-items: center;
      justify-content: center;
    }
  }
  &__title {
    max-width: 620px;
    & h1 {
      margin: 11px 0;
      font-family: "Prompt";
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      @media (max-width: 480px) {
        font-size: 16px;
        margin: 8px 0;
      }
    }
    & h2 {
      font-family: "Prompt";
      font-style: normal;
      font-weight: 700;
      font-size: 40px;
      line-height: 58px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: -webkit-linear-gradient(
        107.5deg,
        #abdeff -3.19%,
        #5552fd 101.2%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      @media (max-width: 480px) {
        font-size: 24px;
        line-height: 34px;
      }
    }
    z-index: 2;
    margin-bottom: 32px;
  }
  &__buttons {
    @media (max-width: 980px) {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }
}
</style>
