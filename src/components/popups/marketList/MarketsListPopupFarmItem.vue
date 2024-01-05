<template>
  <div
    :class="['market-item', { positionOpened: isOpenedPosition }]"
    :style="farmStatusStyles.border"
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
        <TokenChainIcon
          :icon="marketItem.icon"
          :name="marketItem.name"
          :chainId="marketItem.chainId"
          size="60px"
        />

        <div class="name-apr">
          <p class="name">{{ marketItem.name }}</p>
          <p class="apr">APR: {{ apr }}</p>
        </div>
      </div>
      <div class="price">
        <p class="balance">{{ formatTokenBalance(balance) }}</p>
        <p class="usd-equivalent">
          {{ formatUSD(balanceInUSD) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";

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
        return Number(this.marketItem.accountInfo?.balance);
      }
      if (this.marketItem.isDeprecated)
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
      if (this.marketItem.isDeprecated)
        return {
          text: "Depreciated",
          flagColor:
            "background: linear-gradient(270deg, #320A0A 0%, #871D1F 100%), linear-gradient(90deg, #67A069 0%, #446A46 100%);",
          border: "border: 1px solid  #320A0A;",
          tokenInfoMargin: "margin-left: 8px",
        };
      if (this.marketItem.isNew)
        return {
          text: "New",
          flagColor:
            "background: linear-gradient(0deg, #2D4A96 0%, #5B7CD1 100%);",
          border: "border: 1px solid #2D4A96;",
          tokenInfoMargin: "margin-left: 8px;",
        };
      return {
        text: "",
        flagColor: "",
        border: "border: 1px solid #252f4d;",
        tokenInfoMargin: "",
      };
    },

    isOpenedPosition() {
      return (
        Number(this.marketItem.accountInfo?.depositedBalance) ||
        Number(this.marketItem.accountInfo?.balance)
      );
    },
  },

  methods: {
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
    TokenChainIcon,
  },
};
</script>

<style lang="scss" scoped>
.market-item {
  width: 100%;
  height: 100%;
  padding: 14px 16px;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  border: none;
  border-radius: 11px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.market-item:hover {
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.16);
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
      91deg,
      rgba(27, 24, 68, 0.6) 14.68%,
      rgba(13, 19, 38, 0.6) 76.58%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );

  background-repeat: no-repeat;
}
</style>
