<template>
  <div class="home">
    <div class="home__content">
      <h1 class="home__title">
        Abracadabra.Money <br />
        Make your Interest bearing assets liquid
      </h1>
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
  background: url("../assets/images/home-bg-full.png") no-repeat top right;
  background-size: cover;
  background-position: 0 -10%;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  &__content {
    width: 570px;
    display: flex;
    flex-direction: column;
    align-items: center;
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
