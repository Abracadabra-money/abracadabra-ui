<template>
  <div class="home">
    <video class="home__video" loop  height="100%" autoplay muted id="vid">
      <source src="../assets/videos/home-animation.mp4">
    </video>
    <div class="home__content">
      <div class="home__title">
        <h1>Abracadabra.Money</h1> 
        <h2>Make your Interest bearing assets liquid</h2>  
      </div>
      <div class="home__buttons">
        <BaseButton primary :width="'200px'" @click="toBorrowPage">
          Borrow
        </BaseButton>
        <BaseButton primary :width="'200px'" @click="toLeveragePage">
          Leverage
        </BaseButton>
      </div>
    </div>
  </div>
</template>
<script>
const BaseButton = () => import("@/components/base/BaseButton");

export default {
  methods: {
    toBorrowPage() {
      this.$router.push({ name: "Borrow" });
    },
    toLeveragePage() {
      this.$router.push({ name: "Leverage" });
    },
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
  }
  overflow-x: hidden;
  background-color: #4E4B64;
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  position: relative;
  align-items: center;
  padding-left: 185px;
  justify-content: left;
  &__video {
    position: absolute;
    right: 0;
    @media ( max-width: 980px ) {
      display: none;
    }
  }
  &__content {
    width: 570px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  &__title {
    & h1 {
      font-family: 'Prompt';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 20px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    & h2 {
      font-family: 'Prompt';
      font-style: normal;
      font-weight: 700;
      font-size: 40px;
      line-height: 58px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: -webkit-linear-gradient(107.5deg, #abdeff -3.19%, #5552fd 101.2%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    z-index: 2;
    margin-bottom: 32px;
  }
  &__buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    &__content {
      width: 570px;
    }
    &__title {
      font-family: Prompt;
      font-style: normal;
      font-weight: bold;
      font-size: 40px;
      line-height: 60px;
      text-align: center;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    &__buttons {
      display: flex;
      justify-content: center;
      & > a:first-child {
        margin-right: 12px;
      }
      & > a:last-child {
        margin-left: 12px;
      }
    }
  }
}
</style>

