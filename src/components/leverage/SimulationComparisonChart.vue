<template>
  <div class="stable-info">
    <div class="info-wrap">
      <div class="strategy">
        <a
          target="_blank"
          rel="noreferrer noopener"
          v-if="!!strategyLink"
          :href="strategyLink"
        >
          <img src="@/assets/images/degenbox.svg" alt="degenbox" />
          <span>Degenbox strategy</span>
          <img src="@/assets/images/arrow_right.svg" alt="degenbox"
        /></a>

        <LockedTimer :finalTime="isLockedTimer" v-if="isLockedTimer" />
        <MiniStatusTag :rounded="true" v-if="isMigrated"/>
      </div>
      <div class="deposit-wrap">
        <button
          class="deposit"
          v-if="showCollateralLogicBtn"
          @click="showCollateralPopup"
        >
          <img src="@/assets/images/deposit.svg" alt="Deposit" />
          {{ collateralTitle }}
        </button>

        <button
          class="deposit"
          v-if="showClaimCrvReward"
          @click="handleClaimCrvReward"
        >
          <img src="@/assets/images/deposit.svg" alt="Deposit" /> Claim
        </button>

        <a
          class="deposit"
          href="https://app.sushi.com/add/ETH/0x130966628846BFd36ff31a822705796e8cb8C18D"
          target="_blank"
          rel="noreferrer noopener"
          v-if="showAvaxSlpLink"
        >
          <img src="@/assets/images/deposit.svg" alt="Deposit" /> Get SLP
          Tokens</a
        >

        <a
          class="deposit"
          href="https://stargate.finance/pool/USDC-ETH/add"
          target="_blank"
          rel="noreferrer noopener"
          v-if="showStargateUSDC"
        >
          <img src="@/assets/images/deposit.svg" alt="Deposit" /> Get Stargate
          USDC</a
        >

        <a
          class="deposit"
          href="https://stargate.finance/pool/USDT-ETH/add"
          target="_blank"
          rel="noreferrer noopener"
          v-if="showStargateUSDT"
        >
          <img src="@/assets/images/deposit.svg" alt="Deposit" />Get Stargate
          USDT</a
        >

        <a
          class="deposit"
          href="https://yearn.finance/#/vault/0x5faF6a2D186448Dfa667c51CB3D695c7A6E52d8E"
          target="_blank"
          rel="noreferrer noopener"
          v-if="showyvcrvSTETHConcentrated"
        >
          <img src="@/assets/images/deposit.svg" alt="Deposit" />Get Yearn
          Tokens</a
        >

        <div
          v-if="!!pool"
          class="info-btn"
          @click="isInfoPressed = !isInfoPressed"
        >
          <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
        </div>
      </div>
    </div>
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
        <table v-if="!isInfoPressed" class="stable-preview-table">
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
                  @click="handleSimulate"
                >
                  <!-- <img src="@/assets/images/deposit.svg" alt="Deposit" /> -->
                  Simulate
                  <div v-if="isSimulationSuccess" class="success"></div>
                  <div
                    v-else-if="isSimulationLoading"
                    class="simulation-loading"
                  >
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
              <td>Collateral Desposit</td>
              <td>
                {{ collateralDeposit }}
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
                    simulatedTotalCollateralDeposited
                      ? expectedCollateralDeposit
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
                {{ mimBorrowed }}
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
                  {{ simulatedMIMBorrowed ? expectedMIMBorrowed : "-" }}
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
          </tfoot>
        </table>
        <div v-else class="info-list-wrap">
          <div class="info-list">
            <div
              v-for="(item, i) in additionalInfo"
              :key="i"
              class="info-list-item"
            >
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
                <span class="info-list-name">1 {{ pool.name }}</span>
                <span class="info-list-value">{{ tokenToMim }} MIM</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import LockedTimer from "@/components/stake/LockedTimer.vue";
import { mapGetters } from "vuex";
import { fetchTokenApy } from "@/helpers/borrow/collateralApy";
const MiniStatusTag = () => import("@/components/ui/MiniStatusTag");

export default {
  name: "SimulationComparisonChart",
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

    simulationState: {
      type: [String],
      default: undefined,
    },

    simulatedTotalCollateralDeposited: {
      type: [Number, String],
      default: 0,
    },

    simulatedMIMBorrowed: {
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
  data: () => ({
    isInfoPressed: false,
    collateralDecimals: 4,
    wOHMTosOHM: null,
    tokenApy: null,
  }),

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isSimulateBtnDisabled() {
      return +this.collateralExpected === 0;
    },

    isCollateralMoreThanExpected() {
      return +this.expectedCollateralDeposit > +this.collateralDeposit;
    },

    isLoanMoreThanExpected() {
      return +this.expectedMIMBorrowed > +this.mimBorrowed;
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

    isMigrated() {
      if (this.pool?.cauldronSettings)
        return this.pool.cauldronSettings.isMigrated;

      return this.pool?.isMigrated;
    },

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

    expectedCollateralDeposit() {
      return Vue.filter("formatTokenBalance")(+this.simulatedTotalCollateralDeposited) || "0.0";
    },

    collateralDeposit() {
      const collateralDeposited = this.account
        ? this.collateralDepositExpected
        : 0;


      return Vue.filter("formatTokenBalance")(collateralDeposited) || "0.0";
    },

    collateralValue() {
      return Vue.filter("formatUSD")(this.tokenInUsd);
    },

    mimBorrowed() {
      const mimBorrowed = this.account ? this.mimBorrowedExpected : 0;

      return Vue.filter("formatTokenBalance")(mimBorrowed);
    },

    expectedMIMBorrowed() {
      return Vue.filter("formatTokenBalance")(+this.simulatedMIMBorrowed) || "0.0";
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

    collateralDepositExpected() {
      let defaultValue = +this.pool.userInfo?.userCollateralShare;

      if (this.typeOperation === "borrow") {
        return +this.collateralExpected;
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

      if (this.typeOperation === "borrow") {
        return +this.mimExpected;
      }

      if (this.mimExpected && this.typeOperation === "repay") {
        return +this.pool.userInfo?.userBorrowPart - +this.mimExpected;
      }

      return +this.pool.userInfo?.userBorrowPart;
    },

    additionalInfo() {
      try {
        const borrowLeftParsed = this.borrowLeft;
        const resultArray = [
          {
            title: "Collateral Deposited",
            value: Vue.filter("formatTokenBalance")(
              this.pool.userInfo?.userCollateralShare || 0
            ),
            additional: "Amount of Tokens Deposited as Collaterals",
          },
          {
            title: "Collateral Value",
            value: Vue.filter("formatUSD")(this.collateralInUsd || 0),
            additional:
              "USD Value of the Collateral Deposited in your Position",
          },
          {
            title: "MIM Borrowed",
            value: Vue.filter("formatTokenBalance")(
              this.pool.userInfo?.userBorrowPart || 0
            ),
            additional: "MIM Currently Borrowed in your Position",
          },
          {
            title: "TVL",
            value: `$ ${this.formatNumber(
              Vue.filter("formatTokenBalance")(this.pool.tvl || 0)
            )}`,
            additional: "Total Value Locked",
          },
        ];

        if (this.pool.id === 10 && this.chainId === 1) {
          resultArray.push({
            title: "Liquidation Price",
            value: Vue.filter("formatExactPrice")(
              this.pool.userInfo?.liquidationPrice || 0
            ),
            additional:
              "This is the liquidation price of wsOHM, check the current price of wsOHM at the bottom right of the page!",
          });
        } else if (
          (this.pool.id === 2 || this.pool.id === 5) &&
          this.chainId === 43114
        ) {
          resultArray.push({
            title: "wMEMO Liquidation Price",
            value: Vue.filter("formatExactPrice")(
              this.pool.userInfo?.liquidationPrice || 0
            ),
            additional:
              "Collateral Price at which your Position will be Liquidated",
          });
        } else {
          resultArray.push({
            title: "Liquidation Price",
            value: Vue.filter("formatExactPrice")(
              this.pool.userInfo?.liquidationPrice || 0
            ),
            additional:
              "Collateral Price at which your Position will be Liquidated",
          });
        }

        if (this.pool.id === 10 && this.ohmPrice && this.chainId === 1) {
          const ohmLiquidationPrice =
            this.pool.userInfo?.liquidationPrice / this.wOHMTosOHM;

          resultArray.push({
            title: "OHM Liquidation Price",
            value: Vue.filter("formatExactPrice")(ohmLiquidationPrice || 0),
            additional:
              "This is ESTIMATED liquidation price of OHM, check the current price of OHM at the bottom right of the page!",
          });
        }

        if (
          (this.pool.id === 2 || this.pool.id === 5) &&
          this.timePrice &&
          this.chainId === 43114
        ) {
          const ohmLiquidationPrice =
            this.pool.userInfo?.liquidationPrice * this.MEMOTowMEMO;

          resultArray.push({
            title: "MEMO Liquidation Price",
            value: Vue.filter("formatExactPrice")(ohmLiquidationPrice || 0),
            additional:
              "This is ESTIMATED liquidation price of MEMO, check the current price of MEMO at the bottom right of the page!",
          });
        }

        resultArray.push({
          title: "MIM Left To Borrow",
          value: Vue.filter("formatTokenBalance")(borrowLeftParsed || 0),
          additional: "MIM Borrowable Given the Collateral Deposited",
        });

        if (
          this.pool.cauldronSettings.hasWithdrawableLimit &&
          this.pool.maxWithdrawAmount
        ) {
          resultArray.push({
            title: "Withdrawable Amount",
            value: Vue.filter("formatTokenBalance")(
              this.pool.maxWithdrawAmount || 0
            ),
            additional: `Maximum Current Amount of ${this.pool.collateralToken.name} Withdrawable from this market. More ${this.tokenName} will be available as this value approaches 0.`,
          });
        }

        if (this.tokenApy) {
          const title = this.pool.cauldronSettings.strategyLink
            ? "Your Position Approximate APY"
            : "Your Position Apy";

          const apyInfo = {
            title: title,
            value: Vue.filter("formatPercent")(this.tokenApy || 0),
            additional: "APY Delivered by the Open Position",
          };

          resultArray.splice(2, 0, apyInfo);
        }

        if (this.pool.borrowlimit !== null) {
          resultArray.push({
            title: "Maximum Borrowable MIM",
            value: this.pool.borrowlimit,
            additional: `The maximum amount of MIM that your address can borrow in this particular market.`,
          });
        }

        if (this.pool.userInfo?.whitelistedInfo) {
          resultArray.push({
            title: "Maximum Borrowable MIM",
            value: this.pool.userInfo?.whitelistedInfo?.isUserWhitelisted
              ? this.pool.userInfo?.whitelistedInfo?.userBorrowPart
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

    showClaimCrvReward() {
      return (
        this.pool?.cauldronSettings.claimCrvReward &&
        this.isUserHasClaimableReward
      );
    },

    showAvaxSlpLink() {
      if (this.pool) return this.pool.id === 8 && this.chainId === 43114;

      return false;
    },

    showStargateUSDC() {
      if (this.pool) return this.pool.id === 31 && this.chainId === 1;

      return false;
    },

    showStargateUSDT() {
      if (this.pool) return this.pool.id === 32 && this.chainId === 1;

      return false;
    },

    showyvcrvSTETHConcentrated() {
      if (this.pool) return this.pool.id === 33 && this.chainId === 1;

      return false;
    },

    isUserHasClaimableReward() {
      return +this.pool.userInfo?.claimableReward;
    },

    showCollateralLogicBtn() {
      return this.pool?.collateralToken?.additionalLogic && this.account;
    },

    collateralTitle() {
      if (this.pool?.collateralToken?.additionalLogic) {
        return this.pool.collateralToken.additionalLogic.title;
      }
      return "";
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

    isLockedTimer() {
      if (this.pool?.userInfo?.userLockedTimestamp) {
        return this.pool.userInfo.userLockedTimestamp;
      }

      return 0;
    },

    strategyLink() {
      return this.pool?.cauldronSettings.strategyLink;
    },

    tokenToMim() {
      if (this.pool) {
        const tokenToMim = 1 / this.pool.borrowToken.exchangeRate;

        let decimals = 4;

        if (this.pool.name === "SHIB") decimals = 6;

        return Vue.filter("formatToFixed")(tokenToMim, decimals);
      }
      return "0.0";
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

  methods: {
    async handleSimulate() {
      if (!this.isSimulateBtnDisabled) this.$emit("click");
    },
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
    async handleClaimCrvReward() {
      try {
        const estimateGas =
          await this.pool.collateralToken.contract.estimateGas.getReward(
            this.account
          );

        const gasLimit = 1000 + +estimateGas.toString();

        await await this.pool.collateralToken.contract.getReward(this.account, {
          gasLimit,
        });
      } catch (e) {
        console.log("handleClaimCrvReward err:", e);
      }
    },

    showCollateralPopup() {
      if (this.pool.collateralToken.additionalLogic) {
        this.$store.commit("setPopupState", {
          type: this.pool.collateralToken.additionalLogic.type,
          isShow: true,
          data: this.pool.collateralToken.additionalLogic.data,
        });
      }

      return false;
    },
  },

  async created() {
    if (this.pool) this.tokenApy = await fetchTokenApy(this.pool);
  },

  components: {
    LockedTimer,
    MiniStatusTag
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
