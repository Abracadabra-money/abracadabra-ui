<template>
  <div class="stable-info">
    <div class="info-wrap">
      <div class="strategy">
        <MiniStatusTag :rounded="true" v-if="isGlp" text="Leverage" />
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
        <MiniStatusTag :rounded="true" v-if="isMigrated" />
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
        <div v-if="!isInfoPressed" class="stable-preview">
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
        </div></template
      >
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

    isMigrated() {
      if (this.pool?.cauldronSettings)
        return this.pool.cauldronSettings.isMigrated;

      return this.pool?.isMigrated;
    },

    isGlp() {
      return this.chainId === 42161 && this.pool?.id === 3;
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
    MiniStatusTag,
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
