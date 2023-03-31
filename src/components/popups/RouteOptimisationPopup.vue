<template>
  <div class="popup">
    <img
      class="popup-header"
      src="@/assets/images/routeOptimisation.png"
      alt=""
    />

    <div class="popup-top">
      <h3 class="popup-title">Route Optimisation</h3>
      <img
        class="popup-close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div v-if="!routeDatas.length" class="loader-wrap">
      <BaseLoader />
    </div>

    <div v-else class="tokens-list">
      <div class="header-item list-item">
        <p class="header-title">Token</p>
        <p class="header-title">Fees</p>
        <p class="header-title">{{ amountTitle }}</p>
      </div>
      <div class="list-item" v-for="(item, idx) of routeDatas" :key="item.address"
      :class="{accent: itsDeleverage && idx === 0 || !itsDeleverage}">
        <div class="token-icon">
          <BaseTokenIcon :icon="item.icon" />
          <p>{{ item.name }}</p>
        </div>
        <p>{{ item.fees }}%</p>
        <p>{{ item.amount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

const getInfoFromAddress = (address) => {
  return {
    "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f": {
      name: "WBTC",
      icon: "assets/images/tokens/BTC.png",
    },
    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": {
      name: "WETH",
      icon: "assets/images/tokens/WETH.png",
    },
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8": {
      name: "USDC",
      icon: "assets/images/tokens/USDC.png",
    },
    "0xf97f4df75117a78c1a5a0dbb814af92458539fb4": {
      name: "LINK",
      icon: "assets/images/tokens/LINK.png",
    },
    "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9": {
      name: "USDT",
      icon: "assets/images/tokens/USDT.png",
    },
    "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1": {
      name: "DAI",
      icon: "assets/images/tokens/DAI.png",
    },
  }[address];
};

export default {
  props: {},
  computed: {
    itsDeleverage() {
      return this.$route.name === "DeleverageId";
    },
    amountTitle() {
      if(this.itsDeleverage) return  "Buy Amount of MIM"
      return "Leveraged Amount of GLP"
    },
    routeDatas() {
      const data = this.$store.getters.getRouteData;
      if (!data.length) return false;

      return data.map((item) => {
        const { name, icon } = getInfoFromAddress(item.address.toLowerCase());
        return {
          name,
          icon: this.$image(icon),
          address: item.address,
          fees: item.feeBasisPoints / 100,
          amount: parseFloat(
            this.$ethers.utils.formatUnits(item.amount)
          ).toFixed(2),
        };
      });
    },
  },
  methods: {
    closePopup() {
      this.$store.commit("closePopups");
    },
  },
  components: {
    BaseLoader,
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.popup {
  display: grid;
  grid-template-rows: auto 1fr;
  max-width: 95%;
  width: 400px;
  height: 566px;
  max-height: 80vh;
  position: relative;
  padding: 68px 0 30px;
  border-radius: 0 0 30px 30px;
  background: #2a2835;
  border: 4px solid #3e4282;
  filter: drop-shadow(0px 4px 40px rgba(150, 149, 248, 0.4))
    drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25));
  margin: 0 auto;
}

.popup-header {
  position: absolute;
  top: -10%;
  left: 50%;
  right: 0;
  margin: 0 auto;
  transform: translateX(-50%);
  max-width: 100vw;
}

.popup-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 14px;
  z-index: 1;
}

.popup-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.popup-close {
  cursor: pointer;
}

.header-title {
  width: 100%;
  max-width: 125px;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
}

.list-item {
  padding: 8px;
  background: rgba(35, 33, 45, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  &.accent {
    box-shadow: 0px 0px 10px rgba(84, 234, 255, 0.2);
  }
}

.token-icon {
  display: flex;
  align-items: center;
}

.tokens-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 12px;
  padding: 6px 14px;
  width: 100%;
}

.loader-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 52px;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  border-width: 1px 1px 1px 2px;
  border-radius: 2px;
  background-color: #252423;
}

::-webkit-scrollbar-thumb:hover {
  border-width: 1px 1px 1px 2px;
  background-color: #565656;
}

::-webkit-scrollbar-track {
  border-width: 1px;

  background-color: #414141;
  border-color: transparent;
}

@media screen and (max-width: 500px) {
  .popup {
    padding: 30px 0;
    border-radius: 30px;
  }

  .popup-header {
    display: none;
  }

  .header-title {
    font-size: 12px;
  }
}
</style>
