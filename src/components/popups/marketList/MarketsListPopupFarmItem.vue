<template>
  <div class="gradient-background" :style="farmStatusStyles.backgroundColor">
    <div
      :class="['market-item', { positionOpened: isOpenedPosition }]"
      @click="choseItem(marketItem)"
    >
      <div
        class="status-flag"
        :style="farmStatusStyles.flagColor"
        v-if="farmStatusStyles.text"
      >
        {{ farmStatusStyles.text }}
      </div>

      <div class="market-info">
        <div class="token-info">
          <div class="token-info-icon">
            <BaseTokenIcon
              :icon="marketItem.icon"
              :name="marketItem.name"
              size="60px"
            />
            <img class="token-chain" :src="getChainIcon(marketItem.chainId)" />
          </div>

          <div class="name-apr">
            <p class="name">{{ marketItem.name }}</p>
            <p class="apr">APR: {{ apr }}</p>
          </div>
        </div>
        <div class="price" v-if="balance">
          <p class="balance">{{ formatTokenBalance(balance) }}</p>
          <p class="usd-equivalent" v-if="balance">
            {{ formatUSD(balanceInUSD) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

export default {
  props: {
    marketItem: {
      type: Object,
      require: true,
    },
  },

  computed: {
    balance() {
      if (this.marketItem.isMultiReward) {
        return this.marketItem.accountInfo?.balance;
      }
      if (this.marketItem.isDepreciated)
        return this.marketItem.accountInfo?.depositedBalance || 0;
      return Number(this.marketItem.accountInfo?.balance) / 1e18 || 0;
    },

    balanceInUSD() {
      return (this.balance * +this.marketItem.lpPrice) / 1e18;
    },

    apr() {
      return filters.formatPercent(this.marketItem.farmRoi);
    },

    farmStatusStyles() {
      if (this.marketItem.isDepreciated)
        return {
          text: "Depreciated",
          flagColor:
            "background: linear-gradient(180deg, #8C4040 0%, #6B2424 100%);",
          backgroundColor:
            "background: linear-gradient(90deg, rgba(50,10,10,1) 0%, rgba(50,10,10,1) 50%, rgba(0,0,0,0) 100%); backdrop-filter: blur(12.5px);",
        };
      if (this.marketItem.isNew)
        return {
          text: "new",
          flagColor:
            "background: linear-gradient(218deg, #67A069 23.2%, #446A46 79.7%);",
          backgroundColor:
            "background: linear-gradient(90deg, rgba(103,160,105,1) 0%, rgba(68,106,70,1) 50%, rgba(0,0,0,0) 100%); backdrop-filter: blur(12.5px);",
        };
      return {
        text: "",
        flagColor: "",
        backgroundColor:
          "background: linear-gradient(90deg, rgba(45,74,150,1) 0%, rgba(45,88,150,1) 50%, rgba(0,0,0,0) 100%); backdrop-filter: blur(12.5px);",
      };
    },

    isOpenedPosition() {
      return !!Number(this.marketItem.accountInfo.depositedBalance);
    },
  },

  methods: {
    getChainIcon,

    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    choseItem({ id, chainId }) {
      this.$emit("changeActiveMarket", { id, chainId });
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.gradient-background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 93px;
  border-radius: 10px;
}

.market-item {
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  padding: 14px 16px;
  background: linear-gradient(
    146deg,
    rgb(1, 12, 39) 50%,
    rgb(7, 26, 46) 101.49%
  );
  border: none;
  border-radius: 11px;
  position: relative;
  cursor: pointer;
}

.status-flag {
  position: absolute;
  top: 38px;
  left: -39px;
  width: 91px;
  height: 15px;
  border-radius: 10px 10px 0 0;
  transform: rotate(0.75turn);

  padding: 2px;
  color: #fff;
  text-align: center;
  font-size: 10px;
  font-weight: 500;
}

.market-info {
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  color: white;
}

.token-info {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 100%;
}

.token-info-icon {
  position: relative;
}

.token-chain {
  position: absolute;
  top: -4px;
  right: 4px;
  width: 20px;
  height: 20px;
}

.name-apr {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}

.apr {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 14px;
  font-weight: 600;
}

.price {
  text-align: right;
}

.balance {
  font-size: 16px;
  font-weight: 500;
}

.usd-equivalent {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
}

.positionOpened {
  background: url("../../../assets/images/farm/farm-opened-position-background.png"),
    linear-gradient(
      90deg,
      rgb(26, 14, 78) 0%,
      rgb(15, 8, 62) 50%,
      rgb(1, 12, 39) 100%
    );

  background-repeat: no-repeat;
}
</style>
