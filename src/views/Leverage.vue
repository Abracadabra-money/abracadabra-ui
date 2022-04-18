<template>
  <div class="leverage">
    <div class="choose">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>
      <div class="first-input underline">
        <div class="header-balance">
          <h4>Collateral assets</h4>
          <p v-if="selectedPool">
            {{ maxCollateralValue }}
          </p>
        </div>
        <ValueInput
          :icon="selectedPool ? selectedPool.icon : null"
          :name="selectedPool ? selectedPool.name : null"
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
        <Range v-model="multiplier" :min="1" :max="maxLeverage" />
        <p>Liquidation Price &#126; ${{ liquidationPriceExpected }}</p>
        <p>
          Expected MIM amount &#126;
          {{ parseFloat(multiplyMimExpected).toFixed(4) }}
        </p>
        <p>Expected leverage &#126; {{ expectedLeverage }}x</p>
      </div>
    </div>
    <div class="info-block">
      <h1 class="title">Leverage UP</h1>
      <StableInfo
        :pool="selectedPool"
        :isEmpty="selectedPool === null"
        :hasStrategy="selectedPool ? selectedPool.strategyLink : false"
        :tokenToMim="tokenToMim"
      />
      <template v-if="selectedPool">
        <div class="btn-wrap">
          <DefaultButton
            @click="approveTokenHandler"
            primary
            :disabled="isApproved"
            >Approve</DefaultButton
          >
          <DefaultButton @click="actionHandler" :disabled="!isApproved">{{
            actionBtnText
          }}</DefaultButton>
        </div>
        <div class="info-list">
          <div v-for="(item, i) in infoData" :key="i" class="info-item">
            <span>{{ item.name }}:</span>
            <span>{{ item.value }}%</span>
          </div>
        </div>
      </template>
    </div>
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
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const Range = () => import("@/components/UIComponents/Range");
const StableInfo = () => import("@/components/borrow/StableInfo");
const DefaultButton = () => import("@/components/main/DefaultButton");
const PopupWrap = () => import("@/components/ui/PopupWrap");
const SettingsPopup = () => import("@/components/leverage/SettingsPopup");
const SelectPoolPopup = () =>
  import("@/components/popups/selectPoolPopup/SelectPoolPopup");

import borrowPoolsMixin from "@/mixins/borrowPools.js";
import cookMixin from "@/mixins/cook.js";
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
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
    }),

    selectedPool() {
      if (this.poolId) {
        return this.$store.getters.getPoolById(+this.poolId);
      }
      return null;
    },

    maxCollateralValue() {
      if (this.selectedPool && this.account) {
        return this.$ethers.utils.formatUnits(
          this.selectedPool.userInfo.userBalance
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
      if (this.collateralError)
        return +this.selectedPool.userInfo.userCollateralShare;
      return (
        +this.collateralValue + +this.selectedPool.userInfo.userCollateralShare
      );
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
      let liquidationDecimals = 4;
      if (this.selectedPool.name === "SHIB") liquidationDecimals = 6;

      if (+this.multiplier === 1) {
        return this.depositExpectedLiquidationPrice.toFixed(
          liquidationDecimals
        );
      }

      let expectedDeposit =
        this.multiplyMimExpected * this.selectedPool.tokenOraclePrice;

      const borrowPart =
        this.multiplyMimExpected + +this.selectedPool.userInfo.userBorrowPart;

      const expectedCollateralPart =
        expectedDeposit +
        +this.selectedPool.userInfo.userCollateralShare +
        +this.collateralValue;

      const liquidationPrice =
        +borrowPart / +expectedCollateralPart / this.liquidationMultiplier || 0;

      const expectedLiquidationPrice =
        (liquidationPrice / 100) * this.slipage + liquidationPrice;

      return expectedLiquidationPrice.toFixed(liquidationDecimals);
    },

    percentMultiplier() {
      if (this.percentValue) return this.percentValue / 100;
      return false;
    },

    expectedLeverage() {
      if (!this.percentMultiplier) return "0";

      const expectedLevearage =
        (1 - Math.pow(+this.percentMultiplier, this.multiplier)) /
        (1 - +this.percentMultiplier);
      return parseFloat(expectedLevearage).toFixed(2);
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
      this.borrowValue = "";
      this.poolId = pool.id;
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

      // const notification = {
      //   msg: "This Lending Market has reached its MIM borrowable limit, please wait for the next MIM replenish to borrow more!",
      // };

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
          itsDefaultBalance: this.selectedPool.acceptUseDefaultBalance,
        };

        if (this.multiplier > 1) {
          payload.amount = toFixed(
            this.mimAmount,
            this.selectedPool.pairToken.decimals
          );

          this.multiplierHandle(payload);
          return false;
        }

        this.borrowHandler();

        return false;
      }

      return false;
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

        // this.$store.commit("addNotification", notification);
        console.log("notification", notification);

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
  },

  components: {
    NetworksList,
    ValueInput,
    Range,
    StableInfo,
    DefaultButton,
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
  padding: 100px 0;
}

.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
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

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}

@media (min-width: 1024px) {
  .leverage {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }
}
</style>
