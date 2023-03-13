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

    <div class="header-item list-item">
      <p class="header-title">Token</p>
      <p class="header-title">Fees</p>
      <p class="header-title">Leveraged Amount of GLP</p>
    </div>

    <div v-if="!tokenInfo.length" class="loader-wrap">
      <BaseLoader />
    </div>

    <div v-else-if="tokenInfo.length" class="tokens-list">
      <div class="list-item" v-for="item in tokenInfo" :key="item.id">
        <div class="token-icon">
          <BaseTokenIcon />
          <p>{{ item.name }}</p>
        </div>
        <p>{{ item.fees }}</p>
        <p>{{ item.amount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const BaseLoader = () => import("@/components/base/BaseLoader");
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");

export default {
  props: {},
  methods: {
    closePopup() {
      this.$store.commit("closePopups");
    },
  },
  computed: {
    tokenInfo() {
      return [
        {
          id: 1,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "0.0",
          amount: "0.0",
        },
        {
          id: 2,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "2.0",
          amount: "3.0",
        },
        {
          id: 3,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 4,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 5,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 6,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 7,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 7,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 7,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 7,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 7,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 7,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
        {
          id: 7,
          icon: require("@/assets/images/base_token_icon.png"),
          name: "ETH",
          fees: "1.0",
          amount: "1.0",
        },
      ];
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
  max-width: 400px;
  width: 100%;
  height: 566px;
  max-height: 80vh;
  position: relative;
  padding: 68px 0 30px;
  border-radius: 0 0 30px 30px;
  background: #2a2835;
  border: 4px solid #3e4282;
  filter: drop-shadow(0px 4px 40px rgba(150, 149, 248, 0.4))
    drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25));
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
.header-item {
  margin: 0 14px 12px;
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
  box-shadow: 0px 0px 10px rgba(84, 234, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
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
