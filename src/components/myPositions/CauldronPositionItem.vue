<template>
  <div class="position-item">
    <div class="position-header">
      <PositionTokensInfo :position="pool" :tokenName="collateralSymbol" />
      <PositionLinks :actions="positionActions" />
    </div>

    <PositionLiquidationPrice
      :positionRisk="positionRisk"
      :liquidationPrice="liquidationPrice"
    />

    <PositionAssets :assetsInfo="assetsInfo" />

    <div class="position-health" v-if="opened">
      <h4 class="title">Position health</h4>

      <HealthProgress :positionRisk="positionRisk" :percent="positionHealth" />

      <p class="health-parcent">{{ positionHealth }}% of 100%</p>

      <div class="drop-price">
        <div class="drop-text">
          <img
            class="tooltip"
            v-tooltip="tooltipText"
            src="@/assets/images/info.svg"
            alt="Tooltip"
          />
          <p>Required Drop in price</p>
        </div>
        <p class="drop-value">{{ formatLeftDrop }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import mimIcon from "@/assets/images/tokens/MIM.png";
import PositionTokensInfo from "@/components/myPositions/PositionTokensInfo.vue";
import PositionLinks from "@/components/myPositions/PositionLinks.vue";
import PositionLiquidationPrice from "@/components/myPositions/PositionLiquidationPrice.vue";
import PositionAssets from "@/components/myPositions/PositionAssets.vue";
import HealthProgress from "@/components/myPositions/HealthProgress.vue";

export default {
  props: {
    opened: { type: Boolean, default: true },
    pool: { type: Object, required: true },
  },

  data() {
    return {
      tooltipText:
        "If your Collateral Price drops by this amount, you will be flagged for liquidation",
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    collateralSymbol() {
      return this.chainId === 42161 && this.pool?.id === 2
        ? this.pool.lpLogic.name
        : this.pool.collateralToken.name;
    },

    collateralPrice() {
      return 1 / this.pool.borrowToken.exchangeRate;
    },

    liquidationPrice() {
      return +this.pool.userInfo.liquidationPrice;
    },

    userBorrow() {
      return +this.pool.userInfo.userBorrowPart;
    },

    leftToDrop() {
      return this.collateralPrice - this.liquidationPrice;
    },

    formatLeftDrop() {
      return filters.formatUSD(this.leftToDrop);
    },

    healthMultiplier() {
      return this.pool.cauldronSettings.healthMultiplier;
    },

    positionHealth() {
      if (+this.userBorrow === 0 || isNaN(this.liquidationPrice)) return 100;
      const priceToDrop = this.leftToDrop * this.healthMultiplier;
      const percent = (priceToDrop / this.collateralPrice) * 100;
      if (percent > 100) return 100;
      if (percent < 0) return 0;
      return parseFloat(percent).toFixed(2);
    },

    positionRisk() {
      if (this.positionHealth >= 0 && this.positionHealth <= 5) return "high";
      if (this.positionHealth > 5 && this.positionHealth <= 75) return "medium";
      return "safe";
    },

    userCollateralShare() {
      return this.pool.userInfo.userCollateralShare;
    },

    collateralAmount() {
      return this.formatTokenBalance(this.userCollateralShare);
    },

    collateralAmountUsd() {
      return this.formatUSD(
        this.userCollateralShare / this.pool.borrowToken.exchangeRate
      );
    },

    isDeleverage() {
      return this.pool?.isSwappersActive && !!this.pool?.liqSwapperContract;
    },

    positionActions() {
      const defaultActions = [
        {
          title: "Add Collateral/ Borrow MIM",
          icon: this.$image("assets/images/myposition/AddCollateral.png"),
          name: "BorrowId",
          id: this.pool.id,
        },
        {
          title: "Repay MIMs/ Remove Collateral",
          icon: this.$image("assets/images/myposition/Repay.png"),
          name: "RepayId",
          id: this.pool.id,
        },
      ];

      if (this.isDeleverage) {
        const deleverageLink = {
          title: "Deleverage",
          icon: this.$image("assets/images/myposition/Deleverage.png"),
          name: "DeleverageId",
          id: this.pool.id,
        };

        defaultActions.push(deleverageLink);
      }

      return defaultActions;
    },

    assetsInfo() {
      return [
        {
          title: "Collateral Deposited",
          symbol: this.collateralSymbol,
          icon: this.pool.icon,
          amount: this.collateralAmount,
          amountlUsd: this.collateralAmountUsd,
        },
        {
          title: "Borrowed",
          symbol: this.pool.borrowToken.name,
          icon: mimIcon,
          amount: this.formatTokenBalance(this.userBorrow),
        },
      ];
    },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
  },

  components: {
    PositionTokensInfo,
    PositionLinks,
    PositionLiquidationPrice,
    PositionAssets,
    HealthProgress,
  },
};
</script>

<style lang="scss" scoped>
// todo grid to flex
.position-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.position-header {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-row-gap: 20px;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.health-parcent {
  text-align: right;
  margin: 8px 0 14px;
}

.drop-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  position: relative;
  font-size: 18px;
  line-height: 27px;
}

.drop-price :after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 32px;
  right: 32px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
}

.drop-text {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  gap: 12px;
}

.tooltip {
  width: 20px;
  cursor: pointer;
}

.drop-value {
  font-weight: 700;
}

@media (max-width: 640px) {
  .position-item {
    padding: 20px 10px;
  }

  .position-header {
    grid-template-columns: 1fr;
  }
}

// ----------------

@media (max-width: 640px) {
  .pos-item .lp-data-token {
    font-size: 16px;
  }

  .pos-item .lp-data-balance {
    font-size: 15px;
  }

  .pos-item .footer-list-title,
  .pos-item .footer-list-value {
    font-size: 15px;
  }
}
</style>
