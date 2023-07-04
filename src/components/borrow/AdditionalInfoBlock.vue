<template>
  <div class="info-list-wrap">
    <div class="info-list">
      <div v-for="(item, i) in additionalInfo" :key="i" class="info-list-item">
        <img
          class="info-list-icon"
          src="@/assets/images/info.svg"
          v-tooltip="item.additional"
          alt="info"
        />

        <span class="info-list-name">{{ item.title }}:</span>
        <span class="info-list-value">{{ item.value }}</span>
      </div>
    </div>
    <div class="info-list-bottom">
      <div class="info-bottom">
        <div class="info-list-subitem">
          <span class="info-list-name">1 MIM</span>
          <span class="info-list-value">1 USD</span>
        </div>
        <div class="info-list-subitem">
          <span class="info-list-name">1 {{ cauldron.name }}</span>
          <span class="info-list-value">{{ tokenToMim }} MIM</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import filters from "@/filters/index.js";
import { mapGetters } from "vuex";

export default {
  props: {
    cauldron: {
      type: Object,
    },
  },
  data() {
    return { tokenApy: null };
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    collateralInUsd() {
      if (this.cauldron.userPosition) {
        return (
          this.cauldron.userPosition?.userCollateralShare /
          this.cauldron.mainParams.oracleExchangeRate
        );
      }

      return 0;
    },

    borrowLeft() {
      const maxMimBorrow =
        (this.collateralInUsd / 100) * (this.cauldron.mainParams.tvl - 1);
      const leftBorrow =
        maxMimBorrow - this.cauldron.userPosition?.borrowInfo.userBorrowPart;

      if (+leftBorrow < 0) return "0";

      return leftBorrow;
    },

    additionalInfo() {
      try {
        const borrowLeftParsed = this.borrowLeft;
        const resultArray = [
          {
            title: "Collateral Deposited",
            value: filters.formatTokenBalance(
              this.cauldron.userPosition?.collateralInfo.userCollateralShare ||
                0
            ),
            additional: "Amount of Tokens Deposited as Collaterals",
          },
          {
            title: "Collateral Value",
            value: filters.formatUSD(this.collateralInUsd || 0),
            additional:
              "USD Value of the Collateral Deposited in your Position",
          },
          {
            title: "MIM Borrowed",
            value: filters.formatTokenBalance(
              this.cauldron.userPosition?.borrowInfo.userBorrowPart || 0
            ),
            additional: "MIM Currently Borrowed in your Position",
          },
          {
            title: "TVL",
            value: `$ ${this.formatNumber(this.cauldron.mainParams.tvl || 0)}`,
            additional: "Total Value Locked",
          },
        ];

        if (this.cauldron.config.id === 10 && this.chainId === 1) {
          resultArray.push({
            title: "Liquidation Price",
            value: filters.formatExactPrice(
              this.cauldron.userPosition?.liquidationPrice || 0
            ),
            additional:
              "This is the liquidation price of wsOHM, check the current price of wsOHM at the bottom right of the page!",
          });
        } else if (
          (this.cauldron.config.id === 2 || this.cauldron.config.id === 5) &&
          this.chainId === 43114
        ) {
          resultArray.push({
            title: "wMEMO Liquidation Price",
            value: filters.formatExactPrice(
              this.cauldron.userPosition?.liquidationPrice || 0
            ),
            additional:
              "Collateral Price at which your Position will be Liquidated",
          });
        } else {
          resultArray.push({
            title: "Liquidation Price",
            value: filters.formatExactPrice(
              this.cauldron.userPosition?.liquidationPrice || 0
            ),
            additional:
              "Collateral Price at which your Position will be Liquidated",
          });
        }

        if (this.cauldron.id === 10 && this.ohmPrice && this.chainId === 1) {
          const ohmLiquidationPrice =
            this.cauldron.userPosition?.liquidationPrice / this.wOHMTosOHM;

          resultArray.push({
            title: "OHM Liquidation Price",
            value: filters.formatExactPrice(ohmLiquidationPrice || 0),
            additional:
              "This is ESTIMATED liquidation price of OHM, check the current price of OHM at the bottom right of the page!",
          });
        }

        if (
          (this.cauldron.config.id === 2 || this.cauldron.config.id === 5) &&
          this.timePrice &&
          this.chainId === 43114
        ) {
          const ohmLiquidationPrice =
            this.cauldron.userPosition?.liquidationPrice * this.MEMOTowMEMO;

          resultArray.push({
            title: "MEMO Liquidation Price",
            value: filters.formatExactPrice(ohmLiquidationPrice || 0),
            additional:
              "This is ESTIMATED liquidation price of MEMO, check the current price of MEMO at the bottom right of the page!",
          });
        }

        resultArray.push({
          title: "MIM Left To Borrow",
          value: filters.formatTokenBalance(borrowLeftParsed || 0),
          additional: "MIM Borrowable Given the Collateral Deposited",
        });

        if (
          this.cauldron.config.cauldronSettings.hasWithdrawableLimit &&
          this.cauldron.config.maxWithdrawAmount
        ) {
          resultArray.push({
            title: "Withdrawable Amount",
            value: filters.formatTokenBalance(
              this.cauldron.config.maxWithdrawAmount || 0
            ),
            additional: `Maximum Current Amount of ${this.cauldron.config.collateralToken.name} Withdrawable from this market. More ${this.tokenName} will be available as this value approaches 0.`,
          });
        }

        if (this.tokenApy) {
          const title = this.cauldron.config.cauldronSettings.strategyLink
            ? "Your Position Approximate APY"
            : "Your Position Apy";

          const apyInfo = {
            title: title,
            value: filters.formatPercent(this.tokenApy || 0),
            additional: "APY Delivered by the Open Position",
          };

          resultArray.splice(2, 0, apyInfo);
        }

        if (this.cauldron.mainParams.userMaxBorrow !== null) {
          resultArray.push({
            title: "Maximum Borrowable MIM",
            value: this.cauldron.mainParams.userMaxBorrow,
            additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
          });
        }

        if (this.cauldron.userPosition?.whitelistedInfo) {
          resultArray.push({
            title: "Maximum Borrowable MIM",
            value: this.cauldron.userPosition?.whitelistedInfo
              ?.isUserWhitelisted
              ? this.cauldron.userPosition?.whitelistedInfo?.userBorrowPart
              : "0.0",
            additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
          });
        }

        return resultArray;
      } catch (e) {
        console.log("createCollateralInfo err: ", e);
        return [];
      }
    },
  },
  methods: {
    formatNumber(value) {
      if (isNaN(Number(value)) || Number(value) < 1) return 0;

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(2).replace(rx, "$1") +
        item.symbol
      );
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
