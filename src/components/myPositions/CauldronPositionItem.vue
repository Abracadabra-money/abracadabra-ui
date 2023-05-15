<template>
  <div class="position-item">
    <div class="position-header">
      <PositionTokensInfo :position="cauldron" :tokenName="collateralSymbol" />
      <PositionLinks :actions="positionActions" />
    </div>

    <PositionLiquidationPrice
      :positionRisk="positionRisk"
      :liquidationPrice="cauldron.liquidationPrice"
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
        <p class="drop-value">{{ formatUSD(leftToDrop) }}</p>
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
    cauldron: { type: Object, required: true },
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
      return this.chainId === 42161 && this.cauldron.config.id === 2
        ? this.cauldron.config?.wrapInfo?.unwrappedToken?.name
        : this.cauldron.config.collateralInfo.name;
    },

    oracleRate() {
      return this.$ethers.utils.formatUnits(
        this.cauldron.oracleRate,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    collateralPrice() {
      return 1 / this.oracleRate;
    },

    leftToDrop() {
      return +this.collateralPrice - +this.cauldron.liquidationPrice;
    },

    positionHealth() {
      const { liquidationPrice } = this.cauldron;
      const { healthMultiplier } = this.cauldron.config.cauldronSettings;
      const { userBorrowAmount } = this.cauldron.borrowInfo;

      if (userBorrowAmount.toString() === "0" || isNaN(+liquidationPrice))
        return 100;

      const priceToDrop = this.leftToDrop * healthMultiplier;
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

    userCollateralAmount() {
      return this.$ethers.utils.formatUnits(
        this.cauldron.collateralInfo.userCollateralAmount,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    userCollateralAmountUsd() {
      return this.userCollateralAmount / this.oracleRate;
    },

    userBorrowAmount() {
      return this.$ethers.utils.formatUnits(
        this.cauldron.borrowInfo.userBorrowAmount,
        this.cauldron.config.mimInfo.decimals
      );
    },

    positionActions() {
      const defaultActions = [
        {
          title: "Add Collateral/ Borrow MIM",
          icon: this.$image("assets/images/myposition/AddCollateral.png"),
          name: "BorrowId",
          id: this.cauldron.config.id,
        },
        {
          title: "Repay MIMs/ Remove Collateral",
          icon: this.$image("assets/images/myposition/Repay.png"),
          name: "RepayId",
          id: this.cauldron.config.id,
        },
      ];

      if (this.cauldron.config.cauldronSettings.isSwappersActive) {
        const deleverageLink = {
          title: "Deleverage",
          icon: this.$image("assets/images/myposition/Deleverage.png"),
          name: "DeleverageId",
          id: this.cauldron.config.id,
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
          icon: this.cauldron.config.icon,
          amount: this.formatTokenBalance(this.userCollateralAmount),
          amountlUsd: this.formatUSD(this.userCollateralAmountUsd),
        },
        {
          title: "Borrowed",
          symbol: this.cauldron.config.mimInfo.name,
          icon: mimIcon,
          amount: this.formatTokenBalance(this.userBorrowAmount),
        },
      ];
    },
  },

  methods: {
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    formatUSD(value) {
      return filters.formatUSD(value);
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
