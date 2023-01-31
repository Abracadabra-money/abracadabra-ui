<template>
  <div class="stable-info">
    <template>
      <table class="stable-preview-table">
        <thead>
          <tr>
            <td></td>
            <td>Expected</td>
            <td>
              <button
                v-tooltip="this.getToolTipMessage"
                class="simulate-btn"
                :class="{
                  error: this.isSimulationError,
                  disabled: this.isSimulateBtnDisabled,
                }"
                @click="simulateBtnClickHandler"
              >
                Simulate
                <div v-if="isSimulationSuccess" class="success"></div>
                <div v-else-if="isSimulationLoading" class="simulation-loading">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Collateral Deposit</td>
            <td>
              {{ readableEstTotalCollateralTokensToDeposit }}
            </td>
            <td>
              <div v-if="isSimulationLoading" class="simulation-loading">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span class="error" v-else-if="isSimulationError">!</span>
              <span v-else>
                {{
                  simulatedCollateralDeposited
                    ? readableSimulatedCollateralDeposit
                    : "-"
                }}
                <i
                  v-if="this.isSimulationSuccess"
                  class="arrow"
                  :class="{ up: this.isCollateralMoreThanExpected }"
                ></i>
              </span>
            </td>
          </tr>
          <tr>
            <td>MIM Borrowed</td>
            <td>
              {{ readableEstTotalMIMToBorrow }}
            </td>
            <td>
              <div v-if="isSimulationLoading" class="simulation-loading">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span class="error" v-else-if="isSimulationError">!</span>
              <span v-else>
                {{ simulatedMIMBorrowed ? readableSimulatedMIMBorrowed : "-" }}
                <i
                  v-if="this.isSimulationSuccess"
                  class="arrow"
                  :class="{ up: this.isLoanMoreThanExpected }"
                ></i>
              </span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Liquidation Price</td>
            <td colspan="2" :class="liquidationRiskClass">
              {{ calculateLiquidationPrice }}
            </td>
          </tr>
          <tr>
            <td>Collateral Value</td>
            <td colspan="2">
              {{ collateralValuedInUsdToReadableValue }}
            </td>
          </tr>
        </tfoot>
      </table>
    </template>
    <p class="warning">
      * To reduce unnecessary failed transactions, you are encouraged to run a simulation for better results.
      <span v-if="this.transactionLink">
        <a class="simulation-link" :href="transactionLink" target="_blank">
          Verify transaction here.
        </a>
      </span>
    </p>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import {
  prepareFork,
  deleteFork,
  tenderlySimCookMultiBorrow,
  prepareContractsAndApprove,
  TENDERLY_BASE_URL,
} from "@/utils/tenderly";
import notification from "@/helpers/notification/notification.js";

export default {
  name: "SimulationComparisonChart",
  props: {
    itsDefaultBalance: {
      type: Boolean,
    },

    baseCollateralToDeposit: {
      type: [Number, String],
      default: "",
    },

    poolId: {
      type: [Number, String],
      default: 0,
    },

    pool: {
      type: Object,
    },

    slippage: {
      type: [String, Number],
    },

    numOfTimesToLeverageBaseCollateral: {
      type: [Number, String],
      default: 1,
    },
  },
  data: () => ({
    simulatedCollateralDeposited: 0,
    simulatedMIMBorrowed: 0,
    simulationState: undefined,
    forkId: undefined,
    transactionLink: undefined,
  }),

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    estTotalMIMToBorrowOnLeverage() {
      const baseCollateralToDeposit = this.baseCollateralToDeposit;

      if (this.pool && baseCollateralToDeposit) {
        const ROUNDING_BUFFER = 0.01;
        const ltvFactor = this.pool.ltv / 100;
        const mimCollateralTokenExchangeRate =
          this.pool.borrowToken.exchangeRate;
        const valueOfBaseCollateralInMIM =
          baseCollateralToDeposit / mimCollateralTokenExchangeRate;
        const borrowFeeFactor = 1 - this.pool.borrowFee / 100;
        const numOfTimesToLeverageBaseCollateral =
          +this.numOfTimesToLeverageBaseCollateral;

        let totalMimToBorrow = 0;
        //NOTE: Check what the value 1 is for and remove and replace with ltvRatio if it's a bug. Should the rounding buffer be applied on every single loop instead on just the base collateral
        let mimToBorrowBeforeSlippage =
          valueOfBaseCollateralInMIM *
          borrowFeeFactor *
          (ltvFactor - ROUNDING_BUFFER);

        for (let i = numOfTimesToLeverageBaseCollateral; i > 0; i--) {
          totalMimToBorrow += +mimToBorrowBeforeSlippage;
          mimToBorrowBeforeSlippage = mimToBorrowBeforeSlippage * ltvFactor;
        }

        return totalMimToBorrow;
      }
      return 0;
    },

    estTotalCollateralTokensToDeposit() {
      const estTotalMIMToBorrowOnLeverage = this.estTotalMIMToBorrowOnLeverage;
      if (this.pool && estTotalMIMToBorrowOnLeverage) {
        const slippageFactor = 1 - this.slippage / 100;
        const estimatedTotalCollateralReceivedBasedOnBaseCollateral =
          estTotalMIMToBorrowOnLeverage *
          this.pool.tokenOraclePrice *
          slippageFactor;
        return (
          +estimatedTotalCollateralReceivedBasedOnBaseCollateral +
          +this.baseCollateralToDeposit
        );
      }
      return 0;
    },

    isSimulateBtnDisabled() {
      return +this.estTotalCollateralTokensToDeposit === 0;
    },

    isCollateralMoreThanExpected() {
      return (
        +this.simulatedCollateralDepositedWholeBN.toString() >
        +this.estTotalCollateralTokensToDeposit
      );
    },

    isLoanMoreThanExpected() {
      return (
        +this.simulatedMIMBorrowedWholeBN.toString() >
        +this.estTotalMIMToBorrowOnLeverage
      );
    },

    getToolTipMessage() {
      let toolTipMsg = "";
      switch (this.simulationState) {
        case "loading":
          toolTipMsg = "Running simulation. This might take awhile.";
          break;
        case "success":
          toolTipMsg = "Simulation successful.";
          break;
        case "error":
          toolTipMsg =
            "Your transaction will likely fail. Please try again with lower slippage or leverage settings";
          break;
        default:
          toolTipMsg = "Set collateral and leverage to simulate a transaction";
      }
      return toolTipMsg;
    },

    isSimulationLoading() {
      return this.simulationState === "loading";
    },
    isSimulationSuccess() {
      return this.simulationState === "success";
    },
    isSimulationError() {
      return this.simulationState === "error";
    },

    readableEstTotalCollateralTokensToDeposit() {
      return (
        Vue.filter("formatTokenBalance")(
          this.estTotalCollateralTokensToDeposit
        ) || "0.0"
      );
    },

    readableEstTotalMIMToBorrow() {
      return Vue.filter("formatTokenBalance")(
        this.estTotalMIMToBorrowOnLeverage
      );
    },

    simulatedCollateralDepositedWholeBN() {
      return this.$ethers.utils.formatUnits(
        this.simulatedCollateralDeposited?.toString(),
        this.pool.collateralToken.decimals
      );
    },

    simulatedMIMBorrowedWholeBN() {
      return this.$ethers.utils.formatUnits(
        this.simulatedMIMBorrowed?.toString(),
        this.pool.collateralToken.decimals
      );
    },

    readableSimulatedCollateralDeposit() {
      return (
        Vue.filter("formatTokenBalance")(
          this.simulatedCollateralDepositedWholeBN
        ) || "0.0"
      );
    },

    readableSimulatedMIMBorrowed() {
      return (
        Vue.filter("formatTokenBalance")(this.simulatedMIMBorrowedWholeBN) || "0.0"
      );
    },

    collateralValuedInUsdToReadableValue() {
      if (this.pool) {
        const collateralValuedInUsd =
          this.account && this.estTotalCollateralTokensToDeposit >= 0
            ? this.estTotalCollateralTokensToDeposit /
              this.pool.borrowToken.exchangeRate
            : 0;
        return Vue.filter("formatUSD")(collateralValuedInUsd);
      }
      return 0;
    },

    liquidationPrice() {
      if (this.pool?.userInfo && this.account) {
        const defaultLiquidationPrice =
          this.pool?.userInfo?.liquidationPrice || 0;
        const liquidationDecimals = this.pool.name === "SHIB" ? 6 : 4;

        if (!this.baseCollateralToDeposit) return defaultLiquidationPrice;

        const totalMIMBorrowedFromBento =
          this.estTotalMIMToBorrowOnLeverage +
          +this.pool.userInfo.userBorrowPart;

        const totalCollateralDepositedInBento =
          this.estTotalCollateralTokensToDeposit +
          +this.pool.userInfo.userCollateralShare;
        const liquidationMultiplier = this.pool.ltv / 100;
        const liquidationPrice =
          +totalMIMBorrowedFromBento /
            +totalCollateralDepositedInBento /
            liquidationMultiplier || 0;
        //NOTE: Figure this out
        const expectedLiquidationPrice =
          (liquidationPrice / 100) * this.slippage + liquidationPrice;

        return expectedLiquidationPrice.toFixed(liquidationDecimals);
      }
      return 0;
    },

    calculateLiquidationPrice() {
      const liquidationPrice = this.account ? this.liquidationPrice : 0;

      return Vue.filter("formatExactPrice")(liquidationPrice);
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

    liquidationRisk() {
      if (this.pool) {
        const percentagePriceDifference =
          this.priceDifference *
          this.healthMultiplier *
          this.pool.borrowToken.exchangeRate *
          100;

        if (percentagePriceDifference > 100) {
          return 100;
        }

        if (percentagePriceDifference <= 0) {
          return 0;
        }

        return parseFloat(percentagePriceDifference).toFixed(2); // xx of 100%
      }

      return 0;
    },

    priceDifference() {
      const priceDifference =
        1 / this.pool.borrowToken.exchangeRate - this.liquidationPrice;

      return priceDifference;
    },

    healthMultiplier() {
      return this.pool?.cauldronSettings.healthMultiplier;
    },
  },

  watch: {
    async poolId() {
      if (this.pool) {
        await prepareContractsAndApprove(this.pool);
      }
    },
  },

  methods: {
    checkIsPoolAllowBorrow(amount) {
      let dynamicBorrowAmount;
      let borrowlimit;

      if (+this.pool.borrowlimit) {
        borrowlimit = +amount < +this.pool.borrowlimit;
      } else {
        borrowlimit = true;
      }

      dynamicBorrowAmount = +amount < +this.pool.dynamicBorrowAmount;

      if (dynamicBorrowAmount && borrowlimit) return true;

      if (!dynamicBorrowAmount) {
        this.$store.dispatch("notifications/new", notification.allowBorrow);
      } else {
        this.$store.dispatch("notifications/new", notification.borrowLimit);
      }

      return false;
    },

    checkIsUserWhitelistedBorrow() {
      if (!this.pool.userInfo?.whitelistedInfo) return true;

      if (!this.pool.userInfo?.whitelistedInfo?.isUserWhitelisted) {
        const notification = {
          msg: "Your wallet is not currently whitelisted. Please try again once the whitelist is removed.",
          type: "error",
        };

        this.$store.dispatch("notifications/new", notification);

        return false;
      }

      return true;
    },

    checkIsAcceptNewYvcrvSTETHBorrow() {
      if (this.pool.id === 33 && this.chainId === 1) {
        const oldYvCrvSTETH = this.$store.getters.getPoolById(12);
        const hasOpenedBorrowPosition = +oldYvCrvSTETH.userBorrowPart > 50;

        if (hasOpenedBorrowPosition) {
          const notification = {
            msg: "Please close down your old yvcrvSTETH position before opening a new one.",
            type: "error",
          };

          this.$store.dispatch("notifications/new", notification);

          return false;
        }

        return true;
      }

      return true;
    },

    checkIsLiquidationPriceHit() {
      if (this.liquidationPrice > 1 / this.pool.tokenOraclePrice) {
        this.$store.dispatch("notifications/new", notification.liquidation);

        return false;
      }
      return true;
    },

    runChecks() {
      const passedAllChecks =
        this.checkIsPoolAllowBorrow(this.estTotalMIMToBorrowOnLeverage) &&
        this.checkIsUserWhitelistedBorrow() &&
        this.checkIsAcceptNewYvcrvSTETHBorrow() &&
        this.checkIsLiquidationPriceHit();
      return passedAllChecks;
    },
    async simulateTransaction() {
      this.simulationState = "loading";
      setTimeout(async () => {
        const collateralAmount = this.baseCollateralToDeposit;
        const parsedCollateral = this.$ethers.utils.parseUnits(
          collateralAmount.toString(),
          this.pool.collateralToken.decimals
        );
        const mimToBorrow = this.estTotalMIMToBorrowOnLeverage;
        const mimToBorrowParsed = this.$ethers.utils.parseUnits(
          Vue.filter("formatToFixed")(
            mimToBorrow,
            this.pool.borrowToken.decimals
          ),
          this.pool.borrowToken.decimals
        );
        const minValue =
          +this.estTotalCollateralTokensToDeposit - +collateralAmount;
        const minValueParsed = this.$ethers.utils.parseUnits(
          Vue.filter("formatToFixed")(
            minValue,
            this.pool.collateralToken.decimals
          ),
          this.pool.collateralToken.decimals
        );
        const minExpected = await this.pool.masterContractInstance.toShare(
          this.pool.collateralToken.address,
          minValueParsed,
          true
        );
        const payload = {
          collateralAmount: parsedCollateral,
          amount: mimToBorrowParsed,
          minExpected: minExpected,
          updatePrice: this.pool.askUpdatePrice,
          itsDefaultBalance: this.itsDefaultBalance,
          slipage: this.slippage,
        };
        const simulationRes = await tenderlySimCookMultiBorrow(
          payload,
          this.pool,
          this.chainId,
          this.forkId
        );

        if (
          simulationRes?.userCollateralShare &&
          simulationRes?.userBorrowPart
        ) {
          this.simulationState = "success";
          this.simulatedCollateralDeposited =
            simulationRes?.userCollateralShare?.toString();
          this.simulatedMIMBorrowed = simulationRes?.userBorrowPart?.toString();
        } else {
          this.simulationState = "error";
          this.simulatedTotalCollateralDeposited = 0;
          this.simulatedMIMBorrowed = 0;
        }

        if (simulationRes?.lastTxnId) {
          this.transactionLink = `${TENDERLY_BASE_URL}/fork/${this.forkId}/simulation/${simulationRes?.lastTxnId}`;
        }
      }, 5000);
    },
    async simulateBtnClickHandler() {
      const hasPassedChecks = this.runChecks();
      if (hasPassedChecks === true) {
        this.simulateTransaction();
      }
    },

    deleteTenderlyFork(forkId) {
      return async (e) => {
        e?.preventDefault();
        if (forkId) {
          await deleteFork(forkId);
        }
      };
    },
  },

  async created() {
    if (this.forkId) {
      window.removeEventListener(
        "beforeunload",
        this.deleteTenderlyFork(this.forkId)
      );
    }

    const { forkId } = await prepareFork(this.chainId);
    this.forkId = forkId;
    window.addEventListener(
      "beforeunload",
      this.deleteTenderlyFork(this.forkId)
    );

    if (this.pool) {
      await prepareContractsAndApprove(this.pool);
    }
  },

  async beforeDestroy() {
    await this.deleteTenderlyFork(this.forkId)();
  },

  components: {},
};
</script>

<style lang="scss" scoped>

.warning {
  text-align: left;
  padding: 15px;
  font-size: 15px;
}

.simulation-link {
  color: #648fcc;
  text-decoration: underline;
}

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

.arrow {
  display: inline-block;
  padding: 3px;
  border: solid #cc123f;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-5px);

  &.up {
    transform: rotate(-135deg);
    border: solid #63f88b;
    border-width: 0 2px 2px 0;
  }
}

.stable-preview-table {
  border-collapse: collapse;
  width: 100%;
  display: table;
  background: #2b2b3c;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(100px);
  border-radius: 30px;

  thead > tr > td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    .simulate-btn {
      margin: auto;
      background: rgba(182, 255, 157, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      padding: 3px 8px;
      color: #63f88b;
      display: flex;
      align-items: center;
      cursor: pointer;

      &.error {
        color: #cc123f;
        background: rgba(255, 182, 157, 0.2);
      }

      &.disabled {
        color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.04);
        cursor: not-allowed;
      }

      .success {
        margin: 0 2px 5px 10px;
        display: inline-block;
        transform: rotate(45deg);
        height: 16px;
        width: 8px;
        border-bottom: 3px solid #63f88b;
        border-right: 3px solid #63f88b;
      }
    }
  }

  tbody > tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  * > tr > td {
    padding: 20px;
    font-size: 18px;
    span > .error {
      color: #cc123f;
    }
    .simulation-loading {
      margin-left: 5px;
      display: inline-block;
      position: relative;
      width: 20px;
      height: 20px;
      transform: scale(0.25);
      transform-origin: 0 0;
      div {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
        animation: lds-default 1.2s linear infinite;
        &:nth-child(1) {
          animation-delay: 0s;
          top: 37px;
          left: 66px;
        }
        &:nth-child(2) {
          animation-delay: -0.1s;
          top: 22px;
          left: 62px;
        }
        &:nth-child(3) {
          animation-delay: -0.2s;
          top: 11px;
          left: 52px;
        }
        &:nth-child(4) {
          animation-delay: -0.3s;
          top: 7px;
          left: 37px;
        }
        &:nth-child(5) {
          animation-delay: -0.4s;
          top: 11px;
          left: 22px;
        }
        &:nth-child(6) {
          animation-delay: -0.5s;
          top: 22px;
          left: 11px;
        }
        &:nth-child(7) {
          animation-delay: -0.6s;
          top: 37px;
          left: 7px;
        }
        &:nth-child(8) {
          animation-delay: -0.7s;
          top: 52px;
          left: 11px;
        }
        &:nth-child(9) {
          animation-delay: -0.8s;
          top: 62px;
          left: 22px;
        }
        &:nth-child(10) {
          animation-delay: -0.9s;
          top: 66px;
          left: 37px;
        }
        &:nth-child(11) {
          animation-delay: -1s;
          top: 62px;
          left: 52px;
        }
        &:nth-child(12) {
          animation-delay: -1.1s;
          top: 52px;
          left: 62px;
        }
      }
      @keyframes lds-default {
        0%,
        20%,
        80%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.5);
        }
      }
    }
  }

  tfoot > tr > td,
  tbody > tr > td {
    &:first-child {
      text-align: left;
      width: 40%;
    }
  }

  tfoot > tr > td {
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
  .stable-preview-table {
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

  .stable-preview-table > * > tr > td {
    font-size: 3.5vw;
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
