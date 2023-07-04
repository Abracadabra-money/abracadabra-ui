<template>
  <div class="stand-preview">
    <div class="item">
      <p class="item-title">Collateral Deposit</p>
      <p class="item-value">0</p>
    </div>

    <div class="item">
      <p class="item-title">Collateral Value</p>
      <p class="item-value">0</p>
    </div>

    <div class="item">
      <p class="item-title">MIM Borrowed</p>
      <p class="item-value">0</p>
    </div>
    <div class="item">
      <p class="item-title">Liquidation Price</p>
      <p class="item-value" :class="liquidationRiskClass">
        {{ cauldron.userPosition.liquidationPrice }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cauldron: { type: Object },
  },
  computed: {
    liquidationRisk() {
      if (this.cauldron) {
        const priceDifferens =
          1 / this.cauldron.mainParams.oracleExchangeRate -
          this.cauldron.userPosition.liquidationPrice;

        const riskPersent =
          this.priceDifferens *
          this.cauldron.config.cauldronSettings.healthMultiplier *
          this.cauldron.mainParams.oracleExchangeRate *
          100;

        if (riskPersent > 100) {
          return 100;
        }

        if (riskPersent <= 0) {
          return 0;
        }

        return parseFloat(riskPersent).toFixed(2); // xx of 100%
      }

      return this.cauldron.config.cauldronSettings.healthMultiplier;
    },
    liquidationRiskClass() {
      if (this.liquidationPrice === 0) {
        return "";
      }

      if (this.liquidationRisk >= 0 && this.liquidationRisk <= 5) {
        return "high";
      }

      if (this.liquidationRisk > 5 && this.liquidationRisk <= 75) {
        return "medium";
      }

      if (this.liquidationRisk > 75) {
        return "safe";
      }

      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
.stand-preview {
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

  &:nth-child(odd) {
    border-right: 1px rgba(255, 255, 255, 0.1) solid;
  }

  &:nth-last-child(-n + 2) {
    border-bottom: none;
    padding-bottom: 0;
  }
  &:nth-child(-n + 2) {
    padding-top: 0;
  }
}

.item-title {
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
}

.item-value {
  font-size: 30px;
  font-weight: 700;
}
.item-value.safe {
  color: #75c9ee;
}
.item-value.medium {
  color: #ffb800;
}

.item-value.high {
  color: #fe1842;
}

@media (max-width: 1200px) {
  .stand-preview {
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
