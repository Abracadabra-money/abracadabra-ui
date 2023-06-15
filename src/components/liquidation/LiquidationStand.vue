<template>
  <div class="stable-info">
    <div class="stable-data">
      <template v-if="!pool">
        <div class="empty-wrap">
          <img :src="emptyData.img" v-if="emptyData.img" alt="info" />
          <div class="empty-text">
            <p v-if="emptyData.text">
              {{ emptyData.text }}
            </p>
            <p class="empty-bottom" v-if="emptyData.bottom">
              {{ emptyData.bottom }}
              <a
                class="empty-link"
                :href="emptyData.link"
                v-if="emptyData.link"
                target="_blank"
                >here</a
              >
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="stable-preview">
          <div class="item">
            <p class="item-title">Collateral Deposit</p>
            <p class="item-value">
              {{ collateralDeposit }}
            </p>
          </div>

          <div class="item">
            <p class="item-title">Collateral Value</p>
            <p class="item-value">
              {{ collateralValue }}
            </p>
          </div>

          <div class="item">
            <p class="item-title">MIM Borrowed</p>
            <p class="item-value">
              {{ mimBorrowed }}
            </p>
          </div>
          <div class="item">
            <p class="item-title">Liquidation Price</p>
            <p class="item-value" :class="liquidationRiskClass">
              {{ calculateLiquidationPrice }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { mapGetters } from "vuex";
import { fetchTokenApy } from "@/helpers/collateralsApy";

export default {
  name: "BorrowPoolStand",
  props: {
    pool: {
      type: Object,
    },
    emptyData: {
      type: Object,
      require: true,
    },

    typeOperation: {
      type: String,
      default: "borrow",
    },

    collateralExpected: {
      type: [Number, String],
      default: 0,
    },

    mimExpected: {
      type: [Number, String],
    },

    liquidationPrice: {
      type: [String, Number],
    },

    itsMaxRepayMim: {
      type: Boolean,
      default: false,
    },

    poolId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isInfoPressed: false,
      collateralDecimals: 4,
      wOHMTosOHM: null,
      tokenApy: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    tokenInUsd() {
      if (this.account && this.collateralDepositExpected >= 0) {
        return (
          this.collateralDepositExpected / this.pool.borrowToken.exchangeRate
        );
      }
      return 0;
    },

    collateralInUsd() {
      if (this.pool.userInfo) {
        return (
          this.pool.userInfo?.userCollateralShare /
          this.pool.borrowToken.exchangeRate
        );
      }

      return 0;
    },

    borrowLeft() {
      const maxMimBorrow = (this.collateralInUsd / 100) * (this.pool.ltv - 1);
      const leftBorrow = maxMimBorrow - this.pool.userInfo?.userBorrowPart;

      if (+leftBorrow < 0) return "0";

      return leftBorrow;
    },

    collateralDeposit() {
      const collateralDeposited = this.account
        ? this.collateralDepositExpected
        : 0;

      return filters.formatTokenBalance(collateralDeposited) || "0.0";
    },

    collateralValue() {
      return filters.formatUSD(this.tokenInUsd);
    },

    mimBorrowed() {
      const mimBorrowed = this.account ? this.mimBorrowedExpected : 0;

      return filters.formatTokenBalance(mimBorrowed);
    },

    calculateLiquidationPrice() {
      const liquidationPrice = this.account ? this.liquidationPrice : 0;

      return filters.formatExactPrice(liquidationPrice);
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

    collateralDepositExpected() {
      let defaultValue = +this.pool.userInfo?.userCollateralShare;

      if (this.collateralExpected && this.typeOperation === "borrow") {
        return +this.collateralExpected + defaultValue;
      }

      if (this.collateralExpected && this.typeOperation === "repay") {
        if (defaultValue - +this.collateralExpected < 0) return defaultValue;
        return defaultValue - +this.collateralExpected;
      }

      return defaultValue;
    },

    mimBorrowedExpected() {
      if (this.itsMaxRepayMim) {
        return 0;
      }

      if (this.mimExpected && this.typeOperation === "borrow") {
        return +this.pool.userInfo?.userBorrowPart + +this.mimExpected;
      }

      if (this.mimExpected && this.typeOperation === "repay") {
        return +this.pool.userInfo?.userBorrowPart - +this.mimExpected;
      }

      return +this.pool.userInfo?.userBorrowPart;
    },

    liquidationRisk() {
      if (this.pool) {
        const riskPersent =
          this.priceDifferens *
          this.healthMultiplier *
          this.pool.borrowToken.exchangeRate *
          100;

        if (riskPersent > 100) {
          return 100;
        }

        if (riskPersent <= 0) {
          return 0;
        }

        return parseFloat(riskPersent).toFixed(2); // xx of 100%
      }

      return 0;
    },

    priceDifferens() {
      const priceDifferens =
        1 / this.pool.borrowToken.exchangeRate - this.liquidationPrice;

      return priceDifferens;
    },

    healthMultiplier() {
      return this.pool?.cauldronSettings.healthMultiplier;
    },
  },

  watch: {
    async pool() {
      this.tokenApy = await fetchTokenApy(this.pool);
    },

    poolId() {
      this.tokenApy = null;
    },
  },

  async created() {
    if (this.pool) this.tokenApy = await fetchTokenApy(this.pool);
  },
};
</script>

<style lang="scss" scoped>
.stable-info {
  background-color: rgba(35, 33, 45, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
}

.empty-wrap {
  background: #2b2b3c;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  padding: 23px 65px;
  min-height: 280px;

  img {
    max-width: 160px;
    width: 90%;
    height: auto;
  }
}

.empty-bottom {
  margin-top: 15px;
}

.empty-text {
  font-size: 18px;
  line-height: 27px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-link {
  color: #759ffa;
}

.info-wrap {
  display: flex;
  justify-content: space-between;
  padding: 9px 30px 7px 30px;
  min-height: 40px;
}

.strategy {
  display: flex;
  gap: 10px;
  align-items: center;
}

.strategy a {
  color: #fff;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, auto);
  align-items: center;
}

.deposit-wrap {
  display: flex;
}

.deposit {
  background: rgba(157, 244, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 3px 8px;
  color: #63caf8;
  display: flex;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;

  img {
    margin-right: 5px;
  }
}

.info-btn {
  background-color: transparent;
  cursor: pointer;
  border: none;
  /* margin: 9px 30px 7px 0;*/
  width: 24px;
  height: 24px;

  &:disabled {
    cursor: default;
  }
}

.info-icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.stable-data {
  position: relative;
  box-sizing: border-box;
  background: #2b2b3c;
  backdrop-filter: blur(100px);
  border-radius: 30px;
}

.stable-preview {
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

  &.safe {
    color: #75c9ee;
  }

  &.medium {
    color: #ffb800;
  }

  &.high {
    color: #fe1842;
  }
}

.info-list-wrap {
  padding: 20px 15px;
}

.info-list-bottom {
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  padding: 0 17px 10px 17px;
  margin-top: 10px;
}

.info-bottom {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 52px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-list-subitem {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
}

.info-list-value {
  font-weight: 700;
  color: white;
}

.info-list {
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  padding: 0 17px 10px 17px;
  overflow-y: auto;
  height: 210px;
}

.info-list-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-list-name {
  flex: 1 1 auto;
  text-align: left;
}

.info-list-icon {
  padding-right: 12px;
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 1200px) {
  .stable-preview {
    padding: 30px 5px;
  }

  .item-value {
    font-size: 24px;
  }
}

@media (max-width: 600px) {
  .empty-wrap {
    padding: 20px 10px;
  }

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
