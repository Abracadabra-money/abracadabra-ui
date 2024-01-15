<template>
    <div class="banner" v-if="showBanner && !closeClicked">
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
        Get Testnet BERA
        <a
          href="https://artio.faucet.berachain.com/"
          target="_blank"
          class="banner-link"
          > here.</a
        >
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        routes: [
          "Cauldrons",
          "BorrowId",
          "RepayId",
          "LeverageId",
          "DeleverageId",
        ],
        ids: [1],
        closeClicked: false,
      };
    },
  
    computed: {
      chainId() {
        return this.$store.getters.getChainId;
      },
  
      showBanner() {
        return this.chainId === 80085;
      },
    },
  
    methods: {
      closeBanner() {
        this.closeClicked = true;
      },
    },
  
    components: {},
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
    padding: 12px 54px 12px 20px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 100px;
    left: 50%;
    right: 0;
    z-index: 10;
    transform: translateX(-50%);
    min-height: 55px;
  }
  
  .banner-text,
  .banner-link {
    font-weight: 400;
    font-size: 16px;
    letter-spacing: 0.035em;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .banner-text {
    text-align: center;
  }
  
  .banner-text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .banner-link {
    background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    position: relative;
    margin: 0 5px;
  }
  
  .banner-link::after {
    content: "";
    position: absolute;
    bottom: 3px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  }
  
  .banner-close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }
  
  .banner-img {
    max-width: 35px;
    margin-right: 30px;
  }
  </style>
  