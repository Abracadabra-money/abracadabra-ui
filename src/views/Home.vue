<template>
  <div class="home">
    <div class="home__content">
      <h1 class="home__title">Magic.Money <br/> Make your Interest bearing assets liquid</h1>
      <div class="home__buttons">
        <DefaultButton 
          primary
          @click="mint">
          MINT
        </DefaultButton>
        <DefaultButton
          @click="leverageUp">
          Leverage up
        </DefaultButton>
      </div>
    </div>
    
  </div>
</template>
<script>
import DefaultButton from "@/components/main/DefaultButton.vue";

export default  {
  methods: {
    mint() {
      console.log("mint");
    },
    leverageUp() {
      console.log("leverageUp");
    },
  },
  components: {
    DefaultButton
  }
}


</script>

<style lang="scss" scoped>
  .home {
    background: url("../assets/images/home-bg-full.png") no-repeat top right;
    background-size: cover;
    background-position: 0 -10%;
    margin: 0 auto;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
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
      justify-content: space-between;
    }
  }
</style>
