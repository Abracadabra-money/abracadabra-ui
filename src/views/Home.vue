<template>
  <div class="home">
    <h1 class="home-title">Magic.Money <br/> Make your Interest bearing assets liquid</h1>
    <div class="home-buttons">
      <ButtonGradient 
        primary
        @click="mint">
        MINT
      </ButtonGradient>
      <ButtonGradient
        @click="leverageUp">
        Leverage up
      </ButtonGradient>
    </div>
  </div>
</template>
<script>
import ButtonGradient from "@/components/main/ButtonGradient.vue";

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
    ButtonGradient
  }
}


</script>

<style lang="scss" scoped>
  .home-title {
    margin-top: 240px;
    margin-bottom: 38px;
    font-family: Prompt;
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 60px;
    text-align: center;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .home-buttons {
    display: flex;
    justify-content: space-between;
  }
  .home {
    margin: 0 auto;
    width: 570px;
  }
</style>
