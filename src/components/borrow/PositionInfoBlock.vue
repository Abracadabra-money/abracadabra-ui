<template>
  <div class="position-info">
    <div class="item">
      <p class="item-title">Collateral Deposit</p>
      <p class="item-value">
        {{ collateralDeposit }}
      </p>
    </div>

    <div class="item">
      <p class="item-title">Collateral Value</p>
      <p class="item-value">{{ collateralValue }}</p>
    </div>

    <div class="item">
      <p class="item-title">MIM Borrowed</p>
      <p class="item-value">{{ mimBorrowed }}</p>
    </div>

    <div class="item">
      <p class="item-title">Liquidation Price</p>
      <p class="item-value" :class="liquidationRiskClass">
        {{ liquidationPrice }}
      </p>
    </div>
  </div>
</template>
<script>
import filters from "@/filters/index.js";
import { utils } from "ethers";
export default {
  props: {
    cauldron: { type: Object },
    expectedCollateralAmount: { type: Number, default: 0 },
    expectedBorrowAmount: { type: Number, default: 0 },
    expectedLiquidationPrice: { type: Number, default: 0 },
  },
  computed: {
    collateralDeposit() {
      return filters.formatTokenBalance(this.expectedCollateralAmount);
    },

    oracleExchangeRate() {
      return utils.formatUnits(
        this.cauldron.mainParams.oracleExchangeRate,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    collateralValue() {
      return filters.formatUSD(
        this.expectedCollateralAmount / this.oracleExchangeRate
      );
    },

    mimBorrowed() {
      return filters.formatTokenBalance(this.expectedBorrowAmount);
    },

    liquidationPrice() {
      return filters.formatExactPrice(this.expectedLiquidationPrice);
    },

    liquidationRisk() {
      if (this.cauldron) {
        const priceDifferens =
          1 / this.oracleExchangeRate - this.expectedLiquidationPrice;

        const riskPersent =
          priceDifferens *
          this.cauldron.config.cauldronSettings.healthMultiplier *
          this.oracleExchangeRate *
          100;

        if (riskPersent > 100) return 100;

        if (riskPersent <= 0) return 0;

        return parseFloat(riskPersent).toFixed(2);
      }

      return 0;
    },

    liquidationRiskClass() {
      if (this.liquidationPrice === "$ 0.0") return "";

      if (this.liquidationRisk >= 0 && this.liquidationRisk <= 5) return "high";

      if (this.liquidationRisk > 5 && this.liquidationRisk <= 75)
        return "medium";

      if (this.liquidationRisk > 75) return "safe";

      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
.position-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 30px;
  background: #2b2b3c;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(100px);
  border-radius: 30px;
}

.item {
  text-align: center;
  border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
  padding-top: 14px;
  padding-bottom: 14px;
}

.item:nth-child(odd) {
  border-right: 1px rgba(255, 255, 255, 0.1) solid;
}

.item:nth-last-child(-n + 2) {
  border-bottom: none;
  padding-bottom: 0;
}

.item:nth-child(-n + 2) {
  padding-top: 0;
}

.item-title {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
}

.item-value {
  font-size: 30px;
  font-weight: 700;
}
.safe {
  color: #75c9ee;
}
.medium {
  color: #ffb800;
}

.high {
  color: #fe1842;
}

@media (max-width: 1200px) {
  .position-info {
    padding: 30px 5px;
  }

  .item-value {
    font-size: 24px;
  }
}

@media (max-width: 600px) {
  .item-value {
    font-size: 22px;
  }
}

@media (max-width: 375px) {
  .item-title {
    font-size: 16px;
  }

  .item-value {
    font-size: 16px;
  }
}
</style>
