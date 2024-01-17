<template>
  <div class="popup">
    <div class="popup-top">
      <h3 class="popup-title">Route Optimisation</h3>
      <img
        class="popup-close"
        @click="closePopup"
        src="@/assets/images/close-popup.svg"
        alt="close"
      />
    </div>

    <div class="loader-wrap" v-if="!routeDatas.length">
      <BaseLoader medium />
    </div>

    <div v-else class="tokens-list">
      <div class="header-item">
        <p class="header-title">Token</p>
        <p class="header-title">Fees</p>
        <p class="header-title">{{ amountTitle }}</p>
      </div>
      <div
        class="list-item"
        v-for="(item, idx) of routeDatas"
        :key="item.address"
        :class="{ accent: (itsDeleverage && idx === 0) || !itsDeleverage }"
      >
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
      name: "USDC.e",
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
      if (this.itsDeleverage) return "Buy Amount of MIM";
      return "Leveraged Amount of GLP";
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
  width: 480px;
  height: 566px;
  max-height: 80vh;
  position: relative;
  padding: 32px;
  margin: 0 auto;

  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  background: #101622;

  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.popup-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  z-index: 1;
}

.popup-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.popup-close {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.header-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 12px 6px;
  border-radius: 12px 12px 0px 0px;
  background: linear-gradient(90deg, #13182c 0%, #111523 55.82%, #14213a 100%);
}

.header-title {
  max-width: 125px;
  color: #99a0b2;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
}

.list-item {
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #304d99;
  background: rgba(8, 14, 31, 0.6);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  background-size: cover;

  &.accent {
    background-image: url("@/assets/images/cauldrons/table-item-background.png");
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
  gap: 16px;
  width: 100%;
}

.loader-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 52px;
  height: 300px;
  overflow: hidden;
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
