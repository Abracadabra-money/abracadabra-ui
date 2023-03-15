<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div class="choose" :class="{ 'ape-bg': isMagicApe }" :style="bgApe">
        <h4>Choose Chain</h4>
        <div class="underline">
          <NetworksList />
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

          <div
            class="checkbox-wrap"
            v-if="acceptUseDefaultBalance"
            :class="{ active: useDefaultBalance }"
            @click="toggleUseDefaultBalance"
          >
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/active.svg"
              alt=""
              v-if="useDefaultBalance"
            />
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/default.svg"
              alt=""
              v-else
            />
            <p class="label-text">Use {{ networkValuteName }}</p>
          </div>

          <div
            class="checkbox-wrap"
            v-if="isCheckBox"
            :class="{ active: useCheckBox }"
            @click="toggleCheckBox"
          >
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/active.svg"
              alt=""
              v-if="useCheckBox"
            />
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/default.svg"
              alt=""
              v-else
            />
            <p class="label-text">Use {{ selectedPool.name }}</p>
          </div>
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
            :step="0.01"
            :risk="leverageRisk"
            :collateralValue="collateralValue"
            :disabled="!collateralValue"
            tooltipText="Allows users to leverage their position. Read more about this in the documents!"
          />
          <div class="leverage-percent">( {{ multiplier }}x)</div>

          <div class="info-item" v-if="isGlp">
            <span>
              <img
                src="@/assets/images/info.svg"
                alt="info"
                v-tooltip="
                  'Abracadabra leverage engine optmises the best route to join/leave GLP. These fees are not included in the slippgae tollerance'
                "
              />
              <a target="_blank" href="https://app.gmx.io/#/buy_glp"
                >Check current Mint Fees</a
              >
            </span>
          </div>

          <MimEstimatePrice v-if="selectedPool" :mim="selectedPool.borrowToken.address" :amount="multiplyMimExpected"/>
        </div>

        <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>
      <div
        class="info-block"
        :class="{ 'ape-bg': isMagicApe }"
        :style="bgApeInfo"
      >
        <h1 class="title">
          Leverage
          <img
            class="title-ape"
            src="@/assets/images/ape/ape.png"
            v-if="isMagicApe"
            alt=""
          />
          farm
        </h1>
        <BorrowPoolStand
          :pool="selectedPool"
          :collateralExpected="collateralExpected"
          :mimExpected="multiplyMimExpected"
          :liquidationPrice="liquidationPriceExpected"
          :emptyData="emptyData"
          :poolId="selectedPoolId"
        />

        <CollateralApyBlock
          v-if="selectedPool"
          :pool="selectedPool"
          :expectedLeverage="multiplier"
          :isApe="isMagicApe"
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

          <div class="info-row-wrap">
            <ExecutionPrice
              v-if="isExecutionPrice"
              :pool="selectedPool"
              :sellAmount="sellAmount"
              :slipage="slipage"
            />
          </div>

          <div class="info-wrap">
            <InfoBlock :pool="selectedPool" :price="tokenToMim" />
          </div>

          <LeftBorrow :borrowLeft="selectedPool.dynamicBorrowAmount" />
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
      />
    </LocalPopupWrap>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const Range = () => import("@/components/ui/Range");
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");
const InfoBlock = () => import("@/components/borrow/InfoBlock");
const LeftBorrow = () => import("@/components/borrow/LeftBorrow");
const ExecutionPrice = () => import("@/components/borrow/ExecutionPrice");
const LocalPopupWrap = () => import("@/components/popups/LocalPopupWrap");
const SettingsPopup = () => import("@/components/leverage/SettingsPopup");
const MarketsListPopup = () => import("@/components/popups/MarketsListPopup");
const CollateralApyBlock = () =>
  import("@/components/borrow/CollateralApyBlock");
const MimEstimatePrice = () => import("@/components/ui/MimEstimatePrice");

import Vue from "vue";

import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters } from "vuex";
import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";
import bg from "@/assets/images/ape/bg.png";
import bgInfo from "@/assets/images/ape/bg-info.png";

export default {
  mixins: [cauldronsMixin, cookMixin],

  data() {
    return {
      collateralValue: "",
      maxLeverage: 5, // default
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
        bottom: "Read more about it",
        link: "https://docs.abracadabra.money/intro/lending-markets",
      },
      useCheckBox: false,
      bg,
      bgInfo,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      pools: "getPools",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),

    isGlp() {
      return this.chainId === 42161 && this.selectedPool?.id === 3;
    },

    isMagicPool() {
      return (
        (this.chainId === 42161 && this.selectedPool?.id === 3) ||
        (this.chainId === 1 && this.selectedPool?.id === 39)
      );
    },

    filteredPool() {
      if (this.account && this.pools[0]?.userInfo) {
        return this.pools
          .filter(
            (pool) =>
              pool.isSwappersActive &&
              !pool.cauldronSettings.isDepreciated &&
              !!pool.levSwapperContract
          )
          .sort((a, b) =>
            a.userInfo.balanceUsd < b.userInfo.balanceUsd ? 1 : -1
          );
      }

      return this.pools.filter((pool) => !pool.cauldronSettings.isDepreciated);
    },

    selectedPool() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);

        if (
          !pool.isSwappersActive &&
          !pool.isDepreciated &&
          !!pool.levSwapperContract
        ) {
          return null;
        }

        if (pool) return pool;
        return null;
      }
      return null;
    },

    collateralError() {
      if (isNaN(this.collateralValue)) return "Please input valid value";

      if (
        parseFloat(this.collateralValue) > parseFloat(this.maxCollateralValue)
      )
        return `The value cannot be greater than ${this.maxCollateralValue}`;

      return "";
    },

    maxCollateralValue() {
      if (this.selectedPool?.userInfo && this.account) {
        if (this.useDefaultBalance) {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.networkBalance,
            this.selectedPool.collateralToken.decimals
          );
        }

        if (this.isLpLogic && !this.useCheckBox) {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.lpInfo.balance,
            this.selectedPool.lpLogic.lpDecimals
          );
        } else {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.userBalance,
            this.selectedPool.collateralToken.decimals
          );
        }
      }

      return 0;
    },

    maxBorrowValue() {
      if (this.selectedPool?.userInfo && this.account) {
        let valueInDolars;
        let maxPairValue;

        if (this.collateralValue) {
          valueInDolars =
            this.collateralValue / this.selectedPool.borrowToken.exchangeRate;
          maxPairValue = (valueInDolars / 100) * (this.selectedPool.ltv - 1);
        } else {
          valueInDolars =
            this.selectedPool.userInfo.userCollateralShare /
            this.selectedPool.borrowToken.exchangeRate;
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

      if (+this.collateralValue > 0 && this.multiplier > 1)
        return "Leverage Up";

      if (+this.collateralValue > 0) return "Add collateral";

      return "Nothing to do";
    },

    actionApproveTokenText() {
      if (!this.selectedPool.userInfo?.isApproveTokenCollateral)
        return "Approve Token";

      return "Approve";
    },

    isUserLocked() {
      return (
        this.selectedPool.userInfo?.userLockedTimestamp &&
        Number(this.selectedPool.userInfo?.userLockedTimestamp) !== 0
      );
    },

    liquidationMultiplier() {
      return this.selectedPool ? this.selectedPool.ltv / 100 : 0;
    },

    collateralExpected() {
      if (!this.collateralValue) return 0;

      const collateralAmount = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.collateralToken.decimals
      );

      const leverageMultiplyer = this.$ethers.BigNumber.from(
        parseFloat(this.multiplier * 1e10).toFixed(0)
      );

      const leverageSlippage = this.$ethers.BigNumber.from(
        parseFloat(this.slipage * 1e10).toFixed(0)
      );

      const expectedToSwapAmount = collateralAmount
        .mul(leverageMultiplyer)
        .div(1e10)
        .sub(collateralAmount);
      const slippageAmount = expectedToSwapAmount
        .div(100)
        .mul(leverageSlippage)
        .div(1e10);
      const minToSwapExpected = expectedToSwapAmount.sub(slippageAmount);

      return this.$ethers.utils.formatUnits(
        collateralAmount.add(minToSwapExpected),
        this.selectedPool.collateralToken.decimals
      );
    },

    multiplyMimExpected() {
      if (!this.collateralValue) return 0;
      if (!this.mimAmount) return 0;
      if (!this.percentValue) return 0;

      const collateralAmount = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.collateralToken.decimals
      );
      const oracleExchangeRate = this.selectedPool.oracleExchangeRate;

      const leverageMultiplyer = this.$ethers.BigNumber.from(
        parseFloat(this.multiplier * 1e10).toFixed(0)
      );

      const expectedAmount = collateralAmount
        .mul(leverageMultiplyer)
        .div(1e10)
        .sub(collateralAmount);
      const borrowPart = expectedAmount
        .mul(String(1e18))
        .div(oracleExchangeRate);

      if (+this.selectedPool.borrowFee === 0)
        return this.$ethers.utils.formatUnits(borrowPart);
      const borrowFee = this.$ethers.BigNumber.from(
        parseFloat(this.selectedPool.borrowFee * 1e10).toFixed(0)
      );

      const borrowFeePart = borrowPart.div(100).mul(borrowFee).div(1e10);

      return this.$ethers.utils.formatUnits(borrowPart.add(borrowFeePart));
    },

    liquidationPriceExpected() {
      if (this.selectedPool?.userInfo && this.account) {
        const defaultLiquidationPrice =
          this.selectedPool?.userInfo?.liquidationPrice || 0;
        let liquidationDecimals = 4;
        if (this.selectedPool.name === "SHIB") liquidationDecimals = 6;

        if (!this.collateralValue) return defaultLiquidationPrice;

        let expectedDeposit = this.collateralExpected;

        const borrowPart =
          +this.multiplyMimExpected +
          +this.selectedPool.userInfo.userBorrowPart;

        const expectedCollateralPart =
          +expectedDeposit + +this.selectedPool.userInfo.userCollateralShare;

        const liquidationPrice =
          +borrowPart / +expectedCollateralPart / this.liquidationMultiplier ||
          0;

        return liquidationPrice.toFixed(liquidationDecimals);
      }
      return 0;
    },

    percentMultiplier() {
      if (this.percentValue) return this.percentValue / 100;
      return false;
    },

    leverageLiquidationRisk() {
      if (this.selectedPool) {
        const priceDifferens =
          1 / this.selectedPool.borrowToken.exchangeRate -
          this.liquidationPriceExpected;

        const riskPersent =
          priceDifferens *
          this.healthMultiplier *
          this.selectedPool.borrowToken.exchangeRate *
          100;

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
      return this.selectedPool.cauldronSettings.healthMultiplier;
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
      if (this.selectedPool)
        return this.selectedPool.cauldronSettings.acceptUseDefaultBalance;

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

        if (!this.useCheckBox && this.isCheckBox)
          return this.selectedPool.lpLogic.icon;

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

        if (this.isLpLogic && !this.useCheckBox)
          return this.selectedPool.lpLogic.name;

        return this.selectedPool.collateralToken.name;
      }
      return "";
    },

    isTokenApprove() {
      if (this.selectedPool && this.selectedPool.userInfo && this.account) {
        if (this.isMagicPool) {
          if (this.useCheckBox)
            return this.selectedPool.userInfo.isApproveTokenCollateral;
          return this.selectedPool.userInfo.lpInfo.isApprove;
        } else return this.selectedPool.userInfo.isApproveTokenCollateral;
      }
      return true;
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },

    tokenToMim() {
      if (this.selectedPool) {
        const tokenToMim = 1 / this.selectedPool.borrowToken.exchangeRate;

        let decimals = 4;

        if (this.selectedPool.name === "SHIB") decimals = 6;

        return Vue.filter("formatToFixed")(tokenToMim, decimals);
      }
      return "0.0";
    },

    isExecutionPrice() {
      if (
        this.selectedPool?.executionPrice &&
        this.selectedPool &&
        this.collateralValue &&
        !this.collateralError
      )
        return true;

      return false;
    },

    sellAmount() {
      if (!this.collateralValue) return 0;

      const amount = Vue.filter("formatToFixed")(
        this.mimAmount,
        this.selectedPool.borrowToken.decimals
      );

      const percentValue = parseFloat(this.percentValue);

      const amountMultiplyer = percentValue / 100;

      let startAmount = amount * 0.995;

      let finalAmount = 0;

      for (let i = this.multiplier; i > 0; i--) {
        finalAmount += +startAmount;
        startAmount = startAmount * amountMultiplyer;
      }

      const mimAmount = this.$ethers.utils
        .parseUnits(
          Vue.filter("formatToFixed")(
            finalAmount,
            this.selectedPool.borrowToken.decimals
          ),
          this.selectedPool.borrowToken.decimals
        )
        .toString();

      return mimAmount;
    },

    isLpLogic() {
      return !!this.selectedPool?.lpLogic;
    },

    isCheckBox() {
      return (
        (this.chainId === 42161 && this.selectedPool?.id === 3) ||
        (this.chainId === 1 && this.selectedPool?.id === 39)
      );
    },

    isMagicApe() {
      return this.selectedPool?.id === 39;
    },

    bgApe() {
      return this.isMagicApe ? `background-image: url(${this.bg})` : "";
    },

    bgApeInfo() {
      return this.isMagicApe ? `background-image: url(${this.bgInfo})` : "";
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

        if (
          !pool ||
          (!pool.isSwappersActive &&
            !pool.isDepreciated &&
            !!pool.levSwapperContract)
        )
          this.$router.push(`/leverage`);
      }

      return false;
    },

    collateralValue(val, oldVal) {
      if (+val && val !== oldVal) {
        const result = this.getMaxLeverageMultiplier(this.selectedPool, +val);
        if (result < this.multiplier) this.multiplier = result;
        this.maxLeverage = result;
      }
    },
  },

  methods: {
    async alternativeLeverageHandler(multiplyer, slippage) {
      try {
        const collateralAmount = this.$ethers.utils.parseUnits(
          this.collateralValue.toString(),
          this.selectedPool.collateralToken.decimals
        );

        const oracleExchangeRate = this.selectedPool.oracleExchangeRate;

        const leverageMultiplyer = this.$ethers.BigNumber.from(
          parseFloat(multiplyer * 1e10).toFixed(0)
        );
        const leverageSlippage = this.$ethers.BigNumber.from(
          parseFloat(slippage * 1e10).toFixed(0)
        );

        const expectedAmount = collateralAmount
          .mul(leverageMultiplyer)
          .div(1e10)
          .sub(collateralAmount);
        const slippageAmount = expectedAmount
          .div(100)
          .mul(leverageSlippage)
          .div(1e10);
        const minExpected = expectedAmount.sub(slippageAmount);

        const shareToMin =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.collateralToken.address,
            minExpected,
            true
          );

        const borrowPart = expectedAmount
          .mul(String(1e18))
          .div(oracleExchangeRate);

        const leveragePayload = {
          collateralAmount: collateralAmount.toString(),
          borrowPart: borrowPart.toString(),
          shareToMin: shareToMin.toString(),
        };

        console.log("new leveragePayload:", leveragePayload);

        return leveragePayload;
      } catch (error) {
        console.log("alternativeLeverageHandler err:", error);
      }
    },
    updateCollateralValue(value) {
      this.collateralValue = value;

      if (!value) this.multiplier = 1;

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

      let approve = this.selectedPool.userInfo?.isApproveTokenCollateral;

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      if (!this.selectedPool.userInfo?.isApproveTokenCollateral) {
        approve = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      if (approve) {
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
      this.useDefaultBalance = false;

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
        if (!this.checkIsUserWhitelistedBorrow()) {
          return false;
        }

        if (!this.checkIsAcceptNewYvcrvSTETHBorrow()) {
          return false;
        }

        if (this.multiplier > 1) return await this.multiplierHandle(); // leverage
        return await this.collateralHandler(); // add collateral
      }

      return false;
    },
    async collateralHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const collateralDecimals =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpDecimals
          : this.selectedPool.collateralToken.decimals;

      const parsedCollateralValue = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        collateralDecimals
      );

      const payload = {
        amount: parsedCollateralValue,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.useDefaultBalance,
      };

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      let isTokenToCookApprove = await isTokenApprowed(
        collateralToken,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.amount)) {
        isTokenToCookApprove = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateral(
          payload,
          isApproved,
          this.selectedPool,
          notificationId,
          this.isLpLogic,
          !this.useCheckBox
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

    async multiplierHandle() {
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

      if (
        !this.checkIsPoolAllowBorrow(this.multiplyMimExpected, notificationId)
      ) {
        return false;
      }

      const { collateralAmount, borrowPart, shareToMin } =
        await this.alternativeLeverageHandler(this.multiplier, this.slipage);

      const payload = {
        collateralAmount,
        amount: borrowPart,
        minExpected: shareToMin,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.useDefaultBalance,
        slipage: this.slipage,
      };
      this.addMultiBorrowHandler(payload, notificationId);
    },

    async getTokenApprove(tokenContract, spenderAddress) {
      let isTokenApprove = await isTokenApprowed(
        tokenContract,
        spenderAddress,
        this.account
      );

      if (isTokenApprove.eq(0)) {
        isTokenApprove = await approveToken(tokenContract, spenderAddress);
      }

      return isTokenApprove;
    },

    async addMultiBorrowHandler(data, notificationId) {
      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      const isTokenToCookApprove = await this.getTokenApprove(
        collateralToken,
        this.selectedPool.masterContractInstance.address
      );

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (isTokenToCookApprove) {
        if (this.isLpLogic) {
          this.cookLeverage(
            data,
            isApproved,
            this.selectedPool,
            notificationId,
            !this.useCheckBox
          );
        } else {
          this.cookLeverage(
            data,
            isApproved,
            this.selectedPool,
            notificationId
          );
        }
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

    toggleCheckBox() {
      this.clearData();
      this.useCheckBox = !this.useCheckBox;
    },

    getMaxLeverageMultiplier(pool, collateralAmount = 10) {
      const instantLiquidationPrice = 1 / pool.tokenOraclePrice;
      const liquidationMultiplier = pool.ltv / 100;
      const testCollateralAmount = collateralAmount;

      const testSlippage = 1;
      let multiplier = 2;
      let isLiquidation = false;

      while (!isLiquidation) {
        const expectedAmount =
          testCollateralAmount * multiplier - testCollateralAmount;
        const slippageAmount = (expectedAmount / 100) * testSlippage;
        const minExpected = expectedAmount - slippageAmount;
        const leverageCollateralAmount = testCollateralAmount + minExpected;
        const leverageBorrowPart = expectedAmount / pool.tokenOraclePrice;

        const finalBorrowPart =
          leverageBorrowPart + +pool.userInfo.userBorrowPart;

        const finalCollateralAmount =
          +leverageCollateralAmount + +pool.userInfo.userCollateralShare;

        const liquidationPrice =
          finalBorrowPart / finalCollateralAmount / liquidationMultiplier || 0;

        if (+liquidationPrice >= instantLiquidationPrice) {
          isLiquidation = true;
          break;
        }

        multiplier += 0.1;
      }

      const result = Math.min(multiplier, 100);

      return +parseFloat(result).toFixed(2)
    },
  },

  async created() {
    if (this.$route.params.id === "magicAPE") {
      this.$router.push({ name: "magicAPE" });
      return false;
    }

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
    InfoBlock,
    LeftBorrow,
    ExecutionPrice,
    LocalPopupWrap,
    SettingsPopup,
    MarketsListPopup,
    CollateralApyBlock,
    MimEstimatePrice
  },
};
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  a {
    color: #fff;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    display: flex;
    align-items: center;
  }

  img {
    margin-right: 5px;
    cursor: pointer;
  }
}
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

.ape-bg {
  background-position: center;
  background-size: cover;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-ape {
  max-width: 27px;
  margin: 0 10px;
}

.info-row-wrap {
  margin-bottom: 20px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.choose-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.checkbox-wrap {
  background: #333141;
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  border: 2px solid transparent;
  cursor: pointer;

  &.active {
    border: 2px solid #8180ff;
  }

  .label-text {
    cursor: pointer;
  }

  .checkbox-img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
}

.info-wrap {
  margin-bottom: 20px;
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
