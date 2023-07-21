<template>
  <div class="info-list-wrap">
    <div class="info-list">
      <div v-for="(item, i) in additionalInfo" :key="i" class="info-list-item">
        <img
          class="item-icon"
          src="@/assets/images/info.svg"
          v-tooltip="item.additional"
          alt="info"
        />

        <span class="item-name">{{ item.title }}:</span>
        <span class="item-value">{{ item.value }}</span>
      </div>
    </div>
    <div class="rates-wrap">
      <div class="rates">
        <div class="rate">
          <span class="currency from">1 MIM </span>
          <span class="currency to">1 USD</span>
        </div>
        <div class="rate">
          <span class="currency from">1 {{ cauldron.config.name }}</span>
          <span class="currency to">{{ collateralToMim }} MIM</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { utils } from "ethers";
import filters from "@/filters/index.js";
import { getMaxWithdrawAmount } from "@/helpers/cauldron/getMaxWithdrawAmount.ts";
import { mapGetters } from "vuex";

export default {
  props: {
    cauldron: {
      type: Object,
    },
  },
  data() {
    return {
      maxWithdrawAmount: null,
      tokenApy: null,
    };
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    oracleExchangeRate() {
      return +utils.formatUnits(
        this.cauldron.mainParams.oracleExchangeRate,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    userCollateralAmount() {
      return +utils.formatUnits(
        this.cauldron.userPosition.collateralInfo.userCollateralAmount,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    userBorrowAmount() {
      return +utils.formatUnits(
        this.cauldron.userPosition?.borrowInfo.userBorrowAmount,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    collateralToMim() {
      const tokenToMim = 1 / this.oracleExchangeRate;
      const { name } = this.cauldron.config;
      const decimals = name === "SHIB" ? 6 : 4;
      return filters.formatToFixed(tokenToMim, decimals);
    },

    collateralInUsd() {
      if (!this.userCollateralAmount) return 0;
      return this.userCollateralAmount / this.oracleExchangeRate;
    },

    leftToBorrow() {
      const { mcr } = this.cauldron.config;
      const maxMimBorrow = (this.collateralInUsd / 100) * (+mcr - 1);
      const leftToBorrow = +maxMimBorrow - this.userBorrowAmount;
      return leftToBorrow < 0 ? "0" : leftToBorrow;
    },

    additionalInfo() {
      try {
        const whitelistedInfo = this.cauldron.additionalInfo?.whitelistedInfo;
        const { decimals, name } = this.cauldron.config.collateralInfo;
        const { userMaxBorrow, tvl } = this.cauldron.mainParams;
        const { liquidationPrice } = this.cauldron.userPosition;

        const maxUserBorrow = +utils.formatUnits(userMaxBorrow, decimals);

        const resultArray = [
          {
            title: "Collateral Deposited",
            value: filters.formatTokenBalance(this.userCollateralAmount),
            additional: "Amount of Tokens Deposited as Collaterals",
          },
          {
            title: "Collateral Value",
            value: filters.formatUSD(this.collateralInUsd),
            additional:
              "USD Value of the Collateral Deposited in your Position",
          },
          {
            title: "MIM Borrowed",
            value: filters.formatTokenBalance(this.userBorrowAmount),
            additional: "MIM Currently Borrowed in your Position",
          },
          {
            title: "TVL",
            value: `$ ${filters.formatLargeSum(+utils.formatUnits(tvl))}`,
            additional: "Total Value Locked",
          },
          {
            title: "Liquidation Price",
            value: filters.formatExactPrice(liquidationPrice),
            additional:
              "Collateral Price at which your Position will be Liquidated",
          },
          {
            title: "MIM Left To Borrow",
            value: filters.formatTokenBalance(this.leftToBorrow),
            additional: "MIM Borrowable Given the Collateral Deposited",
          },
        ];

        if (this.maxWithdrawAmount) {
          resultArray.push({
            title: "Withdrawable Amount",
            value: filters.formatTokenBalance(this.maxWithdrawAmount),
            additional: `Maximum Current Amount of ${name} Withdrawable from this market. More will be available as this value approaches 0.`,
          });
        }

        if (maxUserBorrow) {
          resultArray.push({
            title: "Maximum Borrowable MIM",
            value: filters.formatLargeSum(maxUserBorrow),
            additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
          });
        }

        if (whitelistedInfo) {
          const maxBorrow = whitelistedInfo?.isUserWhitelisted
            ? filters.formatLargeSum(
                utils.formatUnits(whitelistedInfo?.userBorrowPart, decimals)
              )
            : "0.0";

          resultArray.push({
            title: "Maximum Borrowable MIM",
            value: maxBorrow,
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

  async created() {
    const { decimals } = this.cauldron.config.collateralInfo;
    this.maxWithdrawAmount = utils.formatUnits(
      await getMaxWithdrawAmount(this.cauldron),
      decimals
    );
  },
};
</script>
<style lang="scss" scoped>
.info-list-wrap {
  padding: 20px 15px;
}

.rates-wrap {
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  padding: 0 17px 10px 17px;
  margin-top: 10px;
}

.rates {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 52px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rate {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
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

.item-name,
.currency.from {
  flex: 1 1 auto;
  text-align: left;
}

.item-value,
.currency.to {
  font-weight: 700;
  color: white;
}

.item-icon {
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
