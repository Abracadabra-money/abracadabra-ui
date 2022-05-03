<template>
  <div class="leverage" :class="{ 'leverage-loading': followLink }">
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
              {{ parseFloat(maxCollateralValue).toFixed(4) }}
            </p>
          </div>
          <BaseTokenInput
            :icon="mainValueTokenName"
            :name="mainTokenFinalText"
            v-model="collateralValue"
            :max="maxCollateralValue"
            :error="collateralError"
            :disabled="selectedPool ? false : true"
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
            :inputValue="collateralValue"
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
          :isEmpty="selectedPool === null"
          :hasStrategy="selectedPool ? selectedPool.strategyLink : false"
          :tokenToMim="tokenToMim"
          typeOperation="borrow"
          :collateralExpected="finalRemoveCollateralAmountToShare"
          :mimExpected="multiplyMimExpected"
          :liquidationPrice="liquidationPriceExpected"
          :emptyData="emptyData"
        />
        <template v-if="selectedPool">
          <div class="btn-wrap">
            <BaseButton
              @click="approveTokenHandler"
              primary
              :disabled="isApproved"
              >Approve</BaseButton
            >
            <BaseButton @click="actionHandler" :disabled="!isApproved">{{
              actionBtnText
            }}</BaseButton>
          </div>
          <div class="info-list">
            <div v-for="(item, i) in infoData" :key="i" class="info-item">
              <span>{{ item.name }}:</span>
              <span>{{ item.value }}%</span>
            </div>
          </div>
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <PopupWrap v-model="isSettingsOpened">
      <SettingsPopup @saveSettings="changeSlippage"
    /></PopupWrap>
    <PopupWrap v-model="isOpenPollPopup" maxWidth="400px" height="600px">
      <SelectPoolPopup
        @select="chosePool($event)"
        @close="isOpenPollPopup = false"
        :pools="pools"
    /></PopupWrap>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const Range = () => import("@/components/ui/Range");
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");
const PopupWrap = () => import("@/components/popups/PopupWrap");
const SettingsPopup = () => import("@/components/leverage/SettingsPopup");
const SelectPoolPopup = () => import("@/components/popups/selectPoolPopup");

import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import cookMixin from "@/mixins/borrow/cooks.js";
import { mapGetters } from "vuex";
import {
  isTokenApprowed,
  approveToken,
  isApprowed,
} from "@/utils/approveHelpers.js";
import { toFixed } from "@/utils/helpers.js";

export default {
  mixins: [borrowPoolsMixin, cookMixin],

  data() {
    return {
      collateralValue: "",
      collateralError: "",
      poolId: null,
      isApproved: false,
      isOpenPollPopup: false,
      isSettingsOpened: false,
      multiplier: 1,
      percentValue: "",
      mimAmount: 0,
      slipage: 1,
      finalRemoveCollateralAmountToShare: 0,
      useDefaultBalance: false,
      emptyData: {
        img: require(`@/assets/images/empty_leverage.svg`),
        text: "Leverage up your selected asset using our built in function. Remember you will not receive any MIMs.",
      },
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
    }),

    selectedPool() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (pool) return pool;
        return null;
      }
      return null;
    },

    maxCollateralValue() {
      if (this.selectedPool && this.account) {
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
      if (this.selectedPool && this.account) {
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
      if (!this.isApproved) return "Nothing to do";

      if (this.isUserLocked && +this.collateralValue > 0)
        return "Nothing to do";

      if (this.collateralError) return "Nothing to do";

      if (+this.collateralValue > 0 && !this.collateralError)
        return "Add Collateral and Borrow";

      return "Nothing to do";
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
        { name: "Borrow Fee", value: this.selectedPool.borrowFee },
        { name: "Interest", value: this.selectedPool.interest },
      ];
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

    maxLeverage() {
      if (this.selectedPool) {
        if (this.selectedPool.ltv === 90 && this.selectedPool.id !== 17) {
          return 30;
        }
      }

      return 15;
    },

    depositExpectedBorrowed() {
      if (this.collateralError)
        return +this.selectedPool.userInfo.userBorrowPart;
      return +this.mimAmount + +this.selectedPool.userInfo.userBorrowPart;
    },

    depositExpectedCollateral() {
      if (this.selectedPool.userInfo) {
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
      const liquidationPrice =
        +this.depositExpectedBorrowed /
          +this.depositExpectedCollateral /
          this.liquidationMultiplier || 0;

      return liquidationPrice;
    },

    multiplyMimExpected() {
      if (!this.collateralValue) return 0;
      if (!this.mimAmount) return 0;
      if (this.multiplier === 1) return this.mimAmount;
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
      if (this.selectedPool && this.account) {
        let liquidationDecimals = 4;
        if (this.selectedPool.name === "SHIB") liquidationDecimals = 6;

        if (+this.multiplier === 1) {
          return this.depositExpectedLiquidationPrice.toFixed(
            liquidationDecimals
          );
        }

        if (!this.collateralValue) return 0;

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
        (1 - Math.pow(+this.percentMultiplier, this.multiplier)) /
        (1 - +this.percentMultiplier);
      return parseFloat(expectedLevearage).toFixed(2);
    },

    leverageLiquidationRisk() {
      if (this.selectedPool) {
        const tokenPrice = 1 / this.selectedPool.tokenOraclePrice;
        const priceDifferens = +tokenPrice - +this.liquidationPriceExpected;

        const riskPersent =
          ((priceDifferens * this.stableCoinMultiplyer) / tokenPrice) * 100;

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

    stableCoinMultiplyer() {
      // id 17 AGLD
      const exceptionPools = [15, 16, 27];

      const itsExcepton = exceptionPools.indexOf(this.selectedPool.id) !== -1;

      if (this.selectedPool.ltv === 90 && !itsExcepton) {
        return 10;
      }

      return 1;
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
      return "default";
    },

    followLink() {
      if (this.$route.params.id && !this.pools.length) return true;
      return false;
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
          return `${this.mainValueTokenName} (new)`;

        if (this.networkValuteName && this.useDefaultBalance)
          return this.networkValuteName;

        return this.selectedPool.name;
      }
      return "";
    },
  },

  watch: {
    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (!pool) this.$router.push(`/leverage`);
      }

      return false;
    },

    collateralValue() {
      this.finalCollateralAmountToShare();
    },

    multiplier() {
      this.finalCollateralAmountToShare();
    },
  },
  methods: {
    updateCollateralValue(value) {
      this.collateralValue = value;

      this.updatePercentValue();

      if (parseFloat(value) > parseFloat(this.maxCollateralValue)) {
        this.collateralError = `The value cannot be greater than ${this.maxCollateralValue}`;
        return false;
      }

      this.collateralError = "";

      if (this.percentValue && value) {
        this.mimAmount =
          (this.maxBorrowValue * this.percentValue) / this.selectedPool.ltv;
      }
    },

    async approveTokenHandler() {
      this.isApproved = await approveToken(
        this.selectedPool.token.contract,
        this.selectedPool.masterContractInstance.address
      );
    },

    async chosePool(pool) {
      this.collateralValue = "";
      this.poolId = pool.id;

      this.useDefaultBalance = false;

      let duplicate = this.$route.fullPath === `/leverage/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/leverage/${pool.id}`);
      }

      this.multiplier = 2;

      this.percentValue = this.selectedPool.ltv;
      this.isApproved = this.selectedPool?.token?.isTokenApprove;
    },

    changeSlippage(value) {
      if (!value) {
        this.slipage = 1;
      } else {
        this.slipage = value;
      }
      this.isSettingsOpened = false;
    },

    checkIsPoolAllowBorrow(amount) {
      if (+amount < +this.selectedPool.dynamicBorrowAmount) {
        return true;
      }

      const notification = {
        msg: "This Lending Market has reached its MIM borrowable limit, please wait for the next MIM replenish to borrow more!",
      };
      console.log("notification", notification);
      // this.$store.commit("addNotification", notification);

      return false;
    },

    async actionHandler() {
      if (this.collateralValue && +this.collateralValue > 0) {
        if (!this.checkIsPoolAllowBorrow(this.mimAmount)) {
          return false;
        }

        const parsedCollateral = this.$ethers.utils.parseUnits(
          this.collateralValue.toString(),
          this.selectedPool.token.decimals
        );

        const parsedMim = this.$ethers.utils.parseUnits(
          toFixed(this.mimAmount, this.selectedPool.pairToken.decimals),
          this.selectedPool.pairToken.decimals
        );

        const payload = {
          collateralAmount: parsedCollateral,
          amount: parsedMim,
          updatePrice: this.selectedPool.askUpdatePrice,
          itsDefaultBalance: this.useDefaultBalance,
        };

        if (this.multiplier > 1) {
          payload.amount = toFixed(
            this.mimAmount,
            this.selectedPool.pairToken.decimals
          );

          this.multiplierHandle(payload);
          return false;
        }

        this.addAndBorrowHandler(payload);

        return false;
      }

      return false;
    },

    async addAndBorrowHandler(data) {
      console.log("ADD COLL & BORROW HANDLER", data);

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.token.contract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(data.collateralAmount)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (isTokenToCookApprove) {
        this.cookAddAndBorrow(data, this.isApproved, this.selectedPool);
        return false;
      }
    },

    async borrowHandler() {
      if (!this.checkIsPoolAllowBorrow(this.mimAmount)) {
        return false;
      }

      const parsedBorrowValue = this.$ethers.utils.parseUnits(
        toFixed(this.mimAmount, this.selectedPool.pairToken.decimals),
        this.selectedPool.pairToken.decimals
      );

      const payload = {
        amount: parsedBorrowValue,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      console.log("borrowHandler payload", payload);

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

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        this.cookBorrow(payload, this.isApproved, this.selectedPool);
        return false;
      }

      return false;
    },

    async multiplierHandle(data) {
      const percentValue = parseFloat(this.percentValue);

      if (!percentValue) return false;

      if (
        this.liquidationPriceExpected >
        1 / this.selectedPool.tokenOraclePrice
      ) {
        const notification = {
          msg: "Opening such position will put you at an instant liquidation flag.",
        };

        console.log("notification", notification);
        // this.$store.commit("addNotification", notification);

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

      if (!this.checkIsPoolAllowBorrow(finalAmount)) {
        return false;
      }

      const mimAmount = this.$ethers.utils.parseUnits(
        toFixed(finalAmount, this.selectedPool.pairToken.decimals),
        this.selectedPool.pairToken.decimals
      );

      const minValue =
        finalAmount * this.selectedPool.tokenOraclePrice * slipageMutiplier;

      const minValueParsed = this.$ethers.utils.parseUnits(
        toFixed(minValue, this.selectedPool.token.decimals),
        this.selectedPool.token.decimals
      );

      const finalRemoveCollateralAmountToShare =
        await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.token.address,
          minValueParsed,
          true
        );

      this.finalRemoveCollateralAmountToShare = this.$ethers.utils.formatEther(
        finalRemoveCollateralAmountToShare.toString()
      );

      const payload = {
        ...data,
        amount: mimAmount,
        minExpected: finalRemoveCollateralAmountToShare,
      };
      this.addMultiBorrowHandler(payload);
    },

    async addMultiBorrowHandler(data) {
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

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove && +isTokenToSwapApprove) {
        this.cookMultiBorrow(data, this.isApproved, this.selectedPool);
        return false;
      }
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

    async finalCollateralAmountToShare() {
      if (this.collateralValue) {
        let amount = this.$ethers.utils.parseUnits(
          toFixed(this.mimAmount, this.selectedPool.pairToken.decimals),
          this.selectedPool.pairToken.decimals
        );
        if (this.multiplier > 1) {
          amount = toFixed(
            this.mimAmount,
            this.selectedPool.pairToken.decimals
          );
        } else {
          amount = this.$ethers.utils.formatEther(amount.toString());
        }

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

        const minValueParsed = this.$ethers.utils.parseUnits(
          toFixed(minValue, this.selectedPool.token.decimals),
          this.selectedPool.token.decimals
        );

        this.finalRemoveCollateralAmountToShare =
          this.$ethers.utils.formatEther(minValueParsed.toString());
      } else {
        this.finalRemoveCollateralAmountToShare = 0;
      }
    },

    toggleUseDefaultBalance() {
      this.clearData();

      this.useDefaultBalance = !this.useDefaultBalance;
    },

    clearData() {
      this.collateralValue = "";
      this.collateralError = "";
      this.multiplier = 1;
      this.slipage = 1;
    },
  },

  created() {
    this.poolId = this.$route.params.id;
  },

  components: {
    NetworksList,
    BaseTokenInput,
    Range,
    BorrowPoolStand,
    BaseButton,
    BaseLoader,
    PopupWrap,
    SettingsPopup,
    SelectPoolPopup,
  },
};
</script>

<style lang="scss" scoped>
.leverage {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding: 100px 5px;
}

.leverage-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.choose {
  padding: 20px 16px;
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
  min-height: 500px;
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

@media (min-width: 1024px) {
  .leverage {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }

  .choose {
    padding: 30px;
  }
}
</style>
