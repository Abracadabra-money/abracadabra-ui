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
      <span class="status-text">
        {{ farmStatusStyles.text }}
      </span>
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
import {
  formatUSD,
  formatTokenBalance,
  formatPercent,
} from "@/helpers/filters";
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
      return formatPercent(this.marketItem.farmRoi);
    },

    farmStatusStyles() {
      if (this.marketItem.isDeprecated)
        return {
          text: "Deprecated",
          flagColor:
            "background: linear-gradient(180deg, #8c4040 0%, #6b2424 100%);",
          border: "border: 1px solid  #4a2130;",
          tokenInfoMargin: "margin-left: 8px",
        };
      if (this.marketItem.config?.isNew)
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
        border: "border: 1px solid rgba(180, 180, 180, 0.08);",
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
    formatUSD,
    formatTokenBalance,

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
  transition: all 0.3s ease-in-out;
}

.market-item:hover {
  transform: scale(1.01);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.16);
}

.status-flag {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 36px;
  left: -39px;
  width: 90px;
  max-height: 15px;
  border-radius: 10px 10px 0 0;
  transform: rotate(0.75turn);
  color: #fff;
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
