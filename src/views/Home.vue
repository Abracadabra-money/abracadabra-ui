<template>
  <div class="home">
    
    <div class="home__content">
      <Banner :title="getBannerTitle()" >
        <p>We are monitoring the situation and will implement a fix as soon as its available We are monitoring the situation and will implement a fix as soon as its available <Link>Button</Link></p>
      </Banner>
      <Banner :title="getBannerTitle()" no-close>
        <p>We are monitoring the situation and will implement a fix as soon as its available We are monitoring the situation and will implement a fix as soon as its available <Link>Button</Link></p>
      </Banner>
      <Banner :title="getBannerTitle()" icon :button="{text: 'Button', click: onBannerClick}" >
       
      </Banner>
      <Banner :title="getBannerTitle()" icon >
        <p>We are monitoring the situation and will implement a fix as soon as its available We are monitoring the situation and will implement a fix as soon as its available</p>
      </Banner>
      <Banner :title="getBannerTitle()" icon icon-right >
        <p>We are monitoring the situation and will implement a fix as soon as its available We are monitoring the situation and will implement a fix as soon as its available <Link>Button</Link></p>
      </Banner>
      <h1 class="home__title">Magic.Money <br/> Make your Interest bearing assets liquid</h1>
      <div class="home__buttons">
        <DefaultButton 
          primary
          :width="'270px'"
          @click="mint">
          MINT
        </DefaultButton>
        <DefaultButton
          :width="'270px'"
          @click="leverageUp">
          Leverage up
        </DefaultButton>
      </div>
    </div>
    
  </div>
</template>
<script>
import DefaultButton from "@/components/main/DefaultButton.vue";
const Banner = () => import("@/components/main/Banner");
const Link = () => import("@/components/main/Link");

export default  {
  methods: {
    onBannerClick() {

    },
    mint() {
      console.log("mint");
    },
    leverageUp() {
      console.log("leverageUp");
    },
    getBannerTitle() {
      return "Metamask currently does not support signatures using Ledger/Trezor devices"
    }
  },
  components: {
    DefaultButton,
    Banner,
    Link
  }
}


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
