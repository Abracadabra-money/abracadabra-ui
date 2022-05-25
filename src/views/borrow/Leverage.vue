<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div class="choose">
        <h4>Choose Chain</h4>
        <div class="underline">
          <NetworksList />
        </div>

        <div class="checkbox-wrap" v-if="acceptUseDefaultBalance">
          <div
            class="box-wrap"
            @click="toggleUseDefaultBalance"
            :class="{ active: useDefaultBalance }"
          >
            <div class="box"></div>
          </div>
          <p class="label-text" @click="toggleUseDefaultBalance">
            Use {{ networkValuteName }}
          </p>
        </div>

        <div class="first-input underline">
          <div class="header-balance">
            <h4>Collateral assets</h4>
            <p v-if="selectedPool">
              {{ maxCollateralValue | formatTokenBalance }}
            </p>
          </div>
          <BaseTokenInput
            :icon="mainValueTokenName"
            :name="mainTokenFinalText"
            v-model="collateralValue"
            :max="maxCollateralValue"
            :error="collateralError"
            :disabled="!selectedPool"
            @input="updateCollateralValue"
            @openTokensList="isOpenPollPopup = true"
            isChooseToken
          />
        </div>
        <div class="leverage-range" v-if="selectedPool">
          <div class="settings-wrap">
            <button @click="isSettingsOpened = true" class="settings-btn">
              <img src="@/assets/images/settings.png" alt="settings" />
            </button>
          </div>
          <Range
            v-model="multiplier"
            :max="maxLeverage"
            :min="1"
            :risk="leverageRisk"
            :collateralValue="collateralValue"
            :disabled="!collateralValue"
            tooltipText="Allows users to leverage their position. Read more about this in the documents!"
          />
          <div class="leverage-percent">( {{ expectedLeverage }}x)</div>
        </div>
        <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>
      <div class="info-block">
        <h1 class="title">Leverage farm</h1>
        <BorrowPoolStand
          :pool="selectedPool"
          :collateralExpected="collateralExpected"
          :mimExpected="multiplyMimExpected"
          :liquidationPrice="liquidationPriceExpected"
          :emptyData="emptyData"
          :poolId="selectedPoolId"
        />
        <template v-if="selectedPool">
          <div class="btn-wrap">
            <BaseButton
              @click="approveTokenHandler"
              primary
              :disabled="isTokenApprove"
              >{{ actionApproveTokenText }}</BaseButton
            >
            <BaseButton
              @click="actionHandler"
              :disabled="actionBtnText === 'Nothing to do'"
              >{{ actionBtnText }}</BaseButton
            >
          </div>
          <div class="info-list">
            <div v-for="(item, i) in infoData" :key="i" class="info-item">
              <span>{{ item.name }}:</span>
              <span
                >{{ item.value }}{{ item.name !== "Price" ? "%" : "" }}</span
              >
            </div>
          </div>
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap v-model="isSettingsOpened">
      <SettingsPopup :slipage="slipage" @saveSettings="changeSlippage"
    /></LocalPopupWrap>
    <LocalPopupWrap v-model="isOpenPollPopup">
      <MarketsListPopup
        @select="chosePool($event)"
        @close="isOpenPollPopup = false"
        :pools="filteredPool"
        popupType="cauldron"
    /></LocalPopupWrap>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const Range = () => import("@/components/ui/Range");
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");
const LocalPopupWrap = () => import("@/components/popups/LocalPopupWrap");
const SettingsPopup = () => import("@/components/leverage/SettingsPopup");
const MarketsListPopup = () => import("@/components/popups/MarketsListPopup");

import Vue from "vue";

import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import cookMixin from "@/mixins/borrow/cooks.js";
import { mapGetters } from "vuex";
import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";

export default {
  mixins: [borrowPoolsMixin, cookMixin],

  data() {
    return {
      collateralValue: "",
      poolId: null,
      isOpenPollPopup: false,
      isSettingsOpened: false,
      multiplier: 1,
      percentValue: "",
      mimAmount: 0,
      slipage: 1,
      useDefaultBalance: false,
      updateInterval: null,
      emptyData: {
        img: require(`@/assets/images/empty_leverage.png`),
        text: "Leverage up your selected asset using our built in function. Remember you will not receive any MIMs.",
      },
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      pools: "getPools",
      account: "getAccount",
    }),

    filteredPool() {
      if (this.account) {
        return this.pools
          .filter(
            (pool) =>
              pool.isSwappersActive &&
              !pool.isDepreciated &&
              !!pool.swapContract
          )
          .sort((a, b) =>
            a.userInfo.balanceUsd < b.userInfo.balanceUsd ? 1 : -1
          );
      }

      return this.pools.filter((pool) => !pool.isDepreciated);
    },

    selectedPool() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (pool) return pool;
        return null;
      }
      return null;
    },

    collateralError() {
      if (
        parseFloat(this.collateralValue) > parseFloat(this.maxCollateralValue)
      ) {
        return `The value cannot be greater than ${this.maxCollateralValue}`;
      }

      return "";
    },

    maxCollateralValue() {
      if (this.selectedPool?.userInfo && this.account) {
        if (this.useDefaultBalance) {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.networkBalance,
            this.selectedPool.token.decimals
          );
        }

        return this.$ethers.utils.formatUnits(
          this.selectedPool.userInfo.userBalance,
          this.selectedPool.token.decimals
        );
      }

      return 0;
    },

    maxBorrowValue() {
      if (this.selectedPool?.userInfo && this.account) {
        let valueInDolars;
        let maxPairValue;

        if (this.collateralValue) {
          valueInDolars = this.collateralValue / this.selectedPool.tokenPrice;
          maxPairValue = (valueInDolars / 100) * (this.selectedPool.ltv - 1);
        } else {
          valueInDolars =
            this.selectedPool.userInfo.userCollateralShare /
            this.selectedPool.tokenPrice;
          maxPairValue =
            (valueInDolars / 100) * (this.selectedPool.ltv - 1) -
            this.selectedPool.userInfo.userBorrowPart;
        }

        return maxPairValue;
      }

      return 0;
    },

    actionBtnText() {
      if (!this.isTokenApprove) return "Nothing to do";

      if (this.isUserLocked && +this.collateralValue > 0)
        return "Nothing to do";

      if (this.collateralError) return "Nothing to do";

      if (+this.collateralValue > 0 && !this.collateralError)
        return "Add Collateral and Borrow";

      return "Nothing to do";
    },

    actionApproveTokenText() {
      if (!this.selectedPool.token.isTokenApprove) return "Approve Token";

      if (!this.selectedPool.isTokenToSwapApprove) return "Approve Swap";

      return "Approve";
    },

    isUserLocked() {
      return (
        this.selectedPool.userInfo?.userLockedTimestamp &&
        Number(this.selectedPool.userInfo?.userLockedTimestamp) !== 0
      );
    },

    infoData() {
      return [
        {
          name: "Maximum collateral ratio",
          value: this.selectedPool.ltv,
        },
        { name: "Liquidation fee", value: this.selectedPool.stabilityFee },
        { name: "Borrow fee", value: this.selectedPool.borrowFee },
        { name: "Interest", value: this.selectedPool.interest },
        { name: "Price", value: Vue.filter("formatUSD")(this.tokenToMim) },
      ];
    },

    maxLeverage() {
      if (this.selectedPool?.leverageMax) return this.selectedPool.leverageMax;

      return 15;
    },

    depositExpectedBorrowed() {
      if (this.collateralError)
        return +this.selectedPool.userInfo.userBorrowPart;
      return +this.mimAmount + +this.selectedPool.userInfo.userBorrowPart;
    },

    depositExpectedCollateral() {
      if (this.selectedPool?.userInfo) {
        if (this.collateralError)
          return +this.selectedPool.userInfo.userCollateralShare;
        return (
          +this.collateralValue +
          +this.selectedPool.userInfo.userCollateralShare
        );
      }
      return 0;
    },

    liquidationMultiplier() {
      return this.selectedPool ? this.selectedPool.ltv / 100 : 0;
    },

    depositExpectedLiquidationPrice() {
      return (
        +this.depositExpectedBorrowed /
          +this.depositExpectedCollateral /
          this.liquidationMultiplier || 0
      );
    },

    collateralExpected() {
      if (!this.collateralValue) return 0;

      let amount = Vue.filter("formatToFixed")(
        this.mimAmount,
        this.selectedPool.token.decimals
      );

      const percentValue = parseFloat(this.percentValue);

      const slipageMutiplier = (100 - this.slipage) / 100;

      const amountMultiplyer = percentValue / 100;

      let startAmount = amount * 0.995;

      let finalAmount = 0;

      for (let i = this.multiplier; i > 0; i--) {
        finalAmount += +startAmount;
        startAmount = startAmount * amountMultiplyer;
      }

      const minValue =
        finalAmount * this.selectedPool.tokenOraclePrice * slipageMutiplier;

      return +minValue + +this.collateralValue;
    },

    multiplyMimExpected() {
      if (!this.collateralValue) return 0;
      if (!this.mimAmount) return 0;
      if (!this.percentValue) return 0;

      const percentValue = parseFloat(this.percentValue);

      const amountMultiplyer = percentValue / 100;

      let startAmount = this.mimAmount * 0.995;
      let finalAmount = 0;

      for (let i = this.multiplier; i > 0; i--) {
        finalAmount += +startAmount;
        startAmount = startAmount * amountMultiplyer;
      }

      return finalAmount;
    },

    liquidationPriceExpected() {
      if (this.selectedPool?.userInfo && this.account) {
        const defaultLiquidationPrice =
          this.selectedPool?.userInfo?.liquidationPrice || 0;
        let liquidationDecimals = 4;
        if (this.selectedPool.name === "SHIB") liquidationDecimals = 6;

        if (!this.collateralValue) return defaultLiquidationPrice;

        let expectedDeposit =
          this.multiplyMimExpected * this.selectedPool.tokenOraclePrice;

        const borrowPart =
          this.multiplyMimExpected + +this.selectedPool.userInfo.userBorrowPart;

        const expectedCollateralPart =
          expectedDeposit +
          +this.selectedPool.userInfo.userCollateralShare +
          +this.collateralValue;

        const liquidationPrice =
          +borrowPart / +expectedCollateralPart / this.liquidationMultiplier ||
          0;

        const expectedLiquidationPrice =
          (liquidationPrice / 100) * this.slipage + liquidationPrice;

        return expectedLiquidationPrice.toFixed(liquidationDecimals);
      }
      return 0;
    },

    percentMultiplier() {
      if (this.percentValue) return this.percentValue / 100;
      return false;
    },

    expectedLeverage() {
      if (!this.collateralValue) return "0.00";
      if (!this.percentMultiplier) return "0.00";

      const expectedLevearage =
        (1 - Math.pow(+this.percentMultiplier, +this.multiplier + 1)) /
        (1 - +this.percentMultiplier);
      return parseFloat(expectedLevearage).toFixed(2);
    },

    leverageLiquidationRisk() {
      if (this.selectedPool) {
        const tokenPrice = 1 / this.selectedPool.tokenOraclePrice;
        const priceDifferens = +tokenPrice - +this.liquidationPriceExpected;

        const riskPersent =
          ((priceDifferens * this.healthMultiplier) / tokenPrice) * 100;

        if (riskPersent > 100) {
          return 100;
        }

        if (riskPersent < 0) {
          return 0;
        }

        return parseFloat(riskPersent).toFixed(2);
      }
      return 0;
    },

    healthMultiplier() {
      return this.selectedPool?.healthMultiplier;
    },

    leverageRisk() {
      if (this.collateralValue) {
        if (
          this.leverageLiquidationRisk > 5 &&
          this.leverageLiquidationRisk <= 75
        ) {
          return "medium";
        }

        if (this.leverageLiquidationRisk <= 5) {
          return "high";
        }
      }
      return "safe";
    },

    followLink() {
      return !!(this.$route.params.id && !this.pools.length);
    },

    acceptUseDefaultBalance() {
      if (this.selectedPool) {
        return this.selectedPool.acceptUseDefaultBalance;
      }

      return false;
    },

    networkValuteName() {
      if (this.chainId === 1) return "ETH";
      if (this.chainId === 250) return "FTM";
      if (this.chainId === 137) return "MATIC";
      if (this.chainId === 43114) return "AVAX";
      if (this.chainId === 42161) return "ETH";
      if (this.chainId === 56) return "BNB";

      return false;
    },

    mainValueTokenName() {
      if (this.selectedPool) {
        if (this.networkValuteName === "FTM" && this.useDefaultBalance)
          return require(`@/assets/images/tokens/${this.networkValuteName}2.png`);

        if (this.networkValuteName && this.useDefaultBalance)
          return require(`@/assets/images/tokens/${this.networkValuteName}.png`);

        return this.selectedPool.icon;
      }
      return "";
    },

    mainTokenFinalText() {
      if (this.selectedPool) {
        if (this.poolId === 25 && this.chainId === 1)
          return `${this.selectedPool.name} (new)`;

        if (this.networkValuteName && this.useDefaultBalance)
          return this.networkValuteName;

        return this.selectedPool.name;
      }
      return "";
    },

    isTokenApprove() {
      if (this.selectedPool && this.account) {
        return (
          this.selectedPool.token.isTokenApprove &&
          this.selectedPool.isTokenToSwapApprove
        );
      }
      return true;
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },

    tokenToMim() {
      if (this.selectedPool) {
        const tokenToMim = 1 / this.selectedPool.tokenPrice;

        let decimals = 4;

        if (this.selectedPool.name === "SHIB") decimals = 6;

        // eslint-disable-next-line no-useless-escape
        let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (decimals || -1) + `})?`);
        return tokenToMim.toString().match(re)[0];
      }
      return "0.0";
    },
  },

  watch: {
    account() {
      this.createPools();
    },

    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);

        this.percentValue = pool.ltv;

        if (!pool) this.$router.push(`/leverage`);
      }

      return false;
    },
  },

  methods: {
    updateCollateralValue(value) {
      this.collateralValue = value;

      this.updatePercentValue();

      if (this.percentValue && value) {
        this.mimAmount =
          (this.maxBorrowValue * this.percentValue) / this.selectedPool.ltv;
      }
    },

    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      let approve = this.selectedPool.token.isTokenApprove;

      let approveSwap = this.selectedPool.isTokenToSwapApprove;

      if (!this.selectedPool.token.isTokenApprove) {
        approve = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      if (!this.selectedPool.isTokenToSwapApprove) {
        approveSwap = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.swapContract.address
        );
      }

      if (approve && approveSwap) {
        await this.$store.commit("notifications/delete", notificationId);
      } else {
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.approveError
        );
      }

      return false;
    },

    async chosePool(pool) {
      this.poolId = pool.id;

      this.clearData();

      let duplicate = this.$route.fullPath === `/leverage/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/leverage/${pool.id}`);
      }
    },

    changeSlippage(value) {
      if (!value) {
        this.slipage = 1;
      } else {
        this.slipage = value;
      }
      this.isSettingsOpened = false;
    },

    checkIsPoolAllowBorrow(amount, notificationId) {
      let dynamicBorrowAmount;
      let borrowlimit;

      if (+this.selectedPool.borrowlimit) {
        borrowlimit = +amount < +this.selectedPool.borrowlimit;
      } else {
        borrowlimit = true;
      }

      dynamicBorrowAmount = +amount < +this.selectedPool.dynamicBorrowAmount;

      if (dynamicBorrowAmount && borrowlimit) return true;

      if (notificationId) {
        this.$store.commit("notifications/delete", notificationId);
      }

      if (!dynamicBorrowAmount) {
        this.$store.dispatch("notifications/new", notification.allowBorrow);
      } else {
        this.$store.dispatch("notifications/new", notification.borrowLimit);
      }

      return false;
    },

    checkIsUserWhitelistedBorrow() {
      if (!this.selectedPool.userInfo?.whitelistedInfo) return true;

      if (!this.selectedPool.userInfo?.whitelistedInfo?.isUserWhitelisted) {
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
      if (this.selectedPool.id === 33 && this.chainId === 1) {
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

    async actionHandler() {
      if (this.collateralValue && +this.collateralValue > 0) {
        if (!this.checkIsPoolAllowBorrow(this.mimAmount)) {
          return false;
        }

        if (!this.checkIsUserWhitelistedBorrow()) {
          return false;
        }

        if (!this.checkIsAcceptNewYvcrvSTETHBorrow()) {
          return false;
        }

        const parsedCollateral = this.$ethers.utils.parseUnits(
          this.collateralValue.toString(),
          this.selectedPool.token.decimals
        );

        const parsedMim = this.$ethers.utils.parseUnits(
          Vue.filter("formatToFixed")(
            this.mimAmount,
            this.selectedPool.pairToken.decimals
          ),
          this.selectedPool.pairToken.decimals
        );

        const payload = {
          collateralAmount: parsedCollateral,
          amount: parsedMim,
          updatePrice: this.selectedPool.askUpdatePrice,
          itsDefaultBalance: this.useDefaultBalance,
        };

        payload.amount = Vue.filter("formatToFixed")(
          this.mimAmount,
          this.selectedPool.pairToken.decimals
        );

        this.multiplierHandle(payload);
        return false;
      }

      return false;
    },

    async multiplierHandle(data) {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const percentValue = parseFloat(this.percentValue);

      if (!percentValue) {
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.error);

        return false;
      }

      if (
        this.liquidationPriceExpected >
        1 / this.selectedPool.tokenOraclePrice
      ) {
        await this.$store.commit("notifications/delete", notificationId);

        await this.$store.dispatch(
          "notifications/new",
          notification.liquidation
        );

        return false;
      }

      const slipageMutiplier = (100 - this.slipage) / 100;

      const amountMultiplyer = percentValue / 100;

      let startAmount = data.amount * 0.995;

      let finalAmount = 0;

      for (let i = this.multiplier; i > 0; i--) {
        finalAmount += +startAmount;
        startAmount = startAmount * amountMultiplyer;
      }

      if (!this.checkIsPoolAllowBorrow(finalAmount, notificationId)) {
        return false;
      }

      if (!this.checkIsUserWhitelistedBorrow()) {
        return false;
      }

      if (!this.checkIsAcceptNewYvcrvSTETHBorrow()) {
        return false;
      }

      const mimAmount = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(
          finalAmount,
          this.selectedPool.pairToken.decimals
        ),
        this.selectedPool.pairToken.decimals
      );

      const minValue =
        finalAmount * this.selectedPool.tokenOraclePrice * slipageMutiplier;

      const minValueParsed = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(minValue, this.selectedPool.token.decimals),
        this.selectedPool.token.decimals
      );

      const finalRemoveCollateralAmountToShare =
        await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.token.address,
          minValueParsed,
          true
        );

      const payload = {
        ...data,
        amount: mimAmount,
        minExpected: finalRemoveCollateralAmountToShare,
      };
      this.addMultiBorrowHandler(payload, notificationId);
    },

    async addMultiBorrowHandler(data, notificationId) {
      console.log("ADD COLL OR/AND BORROW -MULTI- HANDLER", data);

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.token.contract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.eq(0)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isTokenToSwapApprove = await isTokenApprowed(
        this.selectedPool.token.contract,
        this.selectedPool.swapContract.address,
        this.account
      );

      if (isTokenToSwapApprove.eq(0)) {
        isTokenToSwapApprove = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.swapContract.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove && +isTokenToSwapApprove) {
        this.cookMultiBorrow(
          data,
          isApproved,
          this.selectedPool,
          notificationId
        );
        return false;
      }

      await this.$store.commit("notifications/delete", notificationId);
      await this.$store.dispatch(
        "notifications/new",
        notification.approveError
      );

      return false;
    },

    updatePercentValue() {
      if (this.collateralValue && this.selectedPool.ltv) {
        const newPairValue =
          (this.maxBorrowValue * this.selectedPool.ltv) / this.selectedPool.ltv;

        this.mimAmount =
          +newPairValue > +this.maxBorrowValue
            ? this.maxBorrowValue
            : newPairValue;
      }
    },

    toggleUseDefaultBalance() {
      this.clearData();

      this.useDefaultBalance = !this.useDefaultBalance;
    },

    clearData() {
      this.collateralValue = "";
      this.useDefaultBalance = false;
      this.multiplier = 1;
      this.changeSlipage(this.selectedPool.id, this.chainId);
      this.percentValue = this.selectedPool.ltv;
    },

    changeSlipage(poolId, chainId) {
      if (+poolId === 30 && +chainId === 1) {
        this.slipage = 0.1;
        return false;
      }

      if (+poolId === 31 && +chainId === 1) {
        this.slipage = 0.5;
        return false;
      }

      if (+poolId === 32 && +chainId === 1) {
        this.slipage = 0.5;
        return false;
      }

      this.slipage = 1;
      return false;
    },
  },

  async created() {
    this.poolId = this.$route.params.id;

    this.changeSlipage(this.poolId, this.chainId);

    this.updateInterval = setInterval(async () => {
      this.createPools();
    }, 15000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    BaseTokenInput,
    Range,
    BorrowPoolStand,
    BaseButton,
    BaseLoader,
    LocalPopupWrap,
    SettingsPopup,
    MarketsListPopup,
  },
};
</script>

<style lang="scss" scoped>
.borrow {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  max-width: calc(100% - 20px);
  width: 95%;
  padding: 100px 0;
}

.borrow-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.choose {
  padding: 30px 30px 50px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.first-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.leverage-range {
  margin: 33px 0 60px 0;
}

.leverage-percent {
  margin: 10px 0;
  text-align: right;
}

.settings-wrap {
  text-align: right;
  .settings-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

.deposit-info {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

.info-block {
  min-height: 520px;
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}

.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 92px;
}

.info-list {
  margin-top: 30px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.choose-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.checkbox-wrap {
  margin-top: 20px;
  display: flex;
  align-items: center;

  .label-text {
    cursor: pointer;
  }

  .info-icon {
    width: 16px;
    height: 16px;
    margin-left: 5px;
  }

  .box-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 8px;
    border: 1px solid #57507a;
    background: rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: all 0.1s ease;

    &:hover {
      border: 1px solid $clrBlue;
    }

    &.active {
      border: 1px solid $clrBlue;

      .box {
        opacity: 1;
      }
    }

    .box {
      background: $clrBlue;
      border-radius: 4px;
      width: 12px;
      height: 12px;
      opacity: 0;
      transition: all 0.1s ease;
    }
  }
}

@media (max-width: 1200px) {
  .borrow {
    grid-gap: 15px;
  }

  .info-block {
    padding: 30px 20px;
  }

  .choose {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .borrow {
    grid-gap: 20px;
  }

  .deposit-block {
    padding: 30px 15px;
  }

  .collateral-input {
    padding: 20px 0 15px;
  }

  .info-block {
    padding: 20px 10px;
    min-height: auto;
  }

  .title {
    margin-bottom: 20px;
  }

  .btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }

  .choose-link {
    bottom: 15px;
  }
}

@media (max-width: 375px) {
  .btn-wrap {
    grid-gap: 10px;

    .default-button {
      padding: 0 10px;
    }
  }
}

@media (min-width: 1024px) {
  .borrow {
    grid-template-columns: 550px 1fr;
    width: 1320px;
  }
}
</style>
