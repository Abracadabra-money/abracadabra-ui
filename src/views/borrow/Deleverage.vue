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
        <Range
          v-model="flashRepayAmount"
          :min="0"
          :max="+maxFlashRepayAmount"
          :step="+borrowStepRange"
          title="Choose the amount of MIM you want to repay"
        />
        <p>Flash Repay Amount {{ flashRepayAmount }}</p>
        <p>
          Liquidation Price &#126; ${{
            parseFloat(flashReapyExpectedLiquidationPrice).toFixed(4)
          }}
        </p>
        <Range
          title="Choose the amount of collateral you want to remove"
          v-model="flashRepayRemoveAmount"
          :min="0"
          :max="maxFlashRepayRemoveAmount"
          :step="+collateralStepRange"
        />
        <p>{{ flashRepayRemoveAmount }} {{ selectedPool.token.name }}</p>
        <p>Amount of MIM to repay {{ flashRepayAmountFormat }}</p>
      </div>
    </div>
    <div class="info-block">
      <h1 class="title">Leverage Down</h1>
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
      slipage: 1,
      flashRepayAmount: 0,
      flashRepayRemoveAmount: 0,
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
      chainId: "getChainId",
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

      if (+this.flashRepayAmount && +this.flashRepayRemoveAmount)
        return "Flash repay & Remove collateral";
      if (+this.flashRepayAmount) return "Flash Repay";

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

    liquidationMultiplier() {
      return this.selectedPool ? this.selectedPool.ltv / 100 : 0;
    },

    borrowStepRange() {
      return "0.0001";
    },

    collateralStepRange() {
      const jlpPools = [4, 6, 7];

      if (
        jlpPools.indexOf(this.selectedPool.id) !== -1 &&
        this.chainId === 43114
      )
        return "0.00000001";
      if (this.selectedPool.token.decimals === 18) return "0.00001";

      return "0.0001";
    },

    maxFlashRepayAmount() {
      if (this.selectedPool) {
        return toFixed(this.selectedPool.userInfo.contractBorrowPartParsed, 4);
      }
      return 0;
    },

    maxFlashRepayRemoveAmount() {
      if (!+this.flashRepayAmount) return 0;

      const persent =
        this.flashRepayAmount / this.selectedPool.userInfo.userBorrowPart;

      const slipageMutiplier = (100 + this.slipage) / 100;

      const expectedToRepayCollateral =
        this.flashRepayAmount *
        this.selectedPool.tokenOraclePrice *
        slipageMutiplier;

      const expectedToRepayBorrow = this.flashRepayAmount;

      const expectedBorrowBalance =
        this.selectedPool.userInfo.userBorrowPart - expectedToRepayBorrow;
      const expectedCollateralBalance =
        this.selectedPool.userInfo.userCollateralShare -
        expectedToRepayCollateral;

      const borrowedInDolarts =
        expectedBorrowBalance / this.selectedPool.tokenPairPrice;

      const collateralInDolarts =
        expectedCollateralBalance / this.selectedPool.tokenOraclePrice;

      const userHasDolars = collateralInDolarts - borrowedInDolarts;
      const acceptedPercent = userHasDolars / collateralInDolarts;

      const maxFlashRepayRemoveAmount =
        expectedCollateralBalance * acceptedPercent * 0.995 * persent;

      if (
        this.selectedPool.userInfo.maxWithdrawAmount !== -1 &&
        +this.selectedPool.userInfo.maxWithdrawAmount <
          +maxFlashRepayRemoveAmount
      ) {
        const parsedMaxContractWithdrawAmount = parseFloat(
          this.selectedPool.userInfo.maxWithdrawAmount
        ).toFixed(20);

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` +
            (this.selectedPool.pairToken.decimals || -1) +
            `})?`
        );
        return parsedMaxContractWithdrawAmount.toString().match(re)[0];
      }

      return +maxFlashRepayRemoveAmount;
    },

    flashReapyExpectedLiquidationPrice() {
      if (!+this.flashRepayAmount) return 0;

      const slipageMutiplier = (100 + this.slipage) / 100;

      const accruedMultiplyer =
        this.maxFlashRepayAmount / +this.selectedPool.userInfo.userBorrowPart;

      const expectedToRepayBorrow = this.flashRepayAmount / accruedMultiplyer;

      const expectedToRepayCollateral =
        this.flashRepayAmount *
        this.selectedPool.tokenOraclePrice *
        slipageMutiplier;

      const expectedBorrowBalance =
        this.selectedPool.userInfo.userBorrowPart - +expectedToRepayBorrow;
      const expectedCollateralBalance =
        this.selectedPool.userInfo.userCollateralShare -
        +expectedToRepayCollateral -
        +this.flashRepayRemoveAmount;

      const liquidationPrice =
        +expectedBorrowBalance /
          +expectedCollateralBalance /
          this.liquidationMultiplier || 0;

      return liquidationPrice;
    },

    flashRepayAmountFormat() {
      const accruedMultiplyer =
        this.maxFlashRepayAmount / this.selectedPool.userInfo.userBorrowPart;

      const jlpPools = [4, 6, 7];

      if (
        jlpPools.indexOf(this.selectedPool.id) !== -1 &&
        this.chainId === 43114
      )
        return parseFloat(this.flashRepayAmount / accruedMultiplyer).toFixed(8);

      return parseFloat(this.flashRepayAmount / accruedMultiplyer).toFixed(4);
    },
  },

  methods: {
    updateCollateralValue(value) {
      this.collateralValue = value;

      if (parseFloat(value) > parseFloat(this.maxCollateralValue)) {
        this.collateralError = `The value cannot be greater than ${this.maxCollateralValue}`;
        return false;
      }

      this.collateralError = "";
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

    async actionHandler() {
      if (+this.flashRepayAmount) {
        if (!this.slipage) {
          return false;
        }

        let deleverageAmount = this.flashRepayAmount;
        let itsMax = this.flashRepayAmount === this.maxFlashRepayAmount;

        console.log("itsMax", itsMax);

        const slipageMutiplier = (100 + this.slipage) / 100;

        const borrowAmount = toFixed(
          parseFloat(deleverageAmount).toFixed(20),
          this.selectedPool.pairToken.decimals
        );

        const collateralAmount = toFixed(
          parseFloat(
            borrowAmount * this.selectedPool.tokenOraclePrice * slipageMutiplier
          ).toFixed(20),
          this.selectedPool.token.decimals
        );

        const finalBorrowAmount = this.$ethers.utils.parseUnits(
          borrowAmount,
          this.selectedPool.pairToken.decimals
        );

        const finalCollateralAmount = this.$ethers.utils.parseUnits(
          collateralAmount,
          this.selectedPool.token.decimals
        );

        const removeCollateralAmount = toFixed(
          parseFloat(this.flashRepayRemoveAmount).toFixed(20),
          this.selectedPool.token.decimals
        );

        const finalRemoveCollateralAmount = this.$ethers.utils.parseUnits(
          removeCollateralAmount,
          this.selectedPool.token.decimals
        );

        const payload = {
          borrowAmount: finalBorrowAmount,
          collateralAmount: finalCollateralAmount,
          removeCollateralAmount: finalRemoveCollateralAmount,
          updatePrice: this.selectedPool.askUpdatePrice,
          itsMax,
        };

        const finalCollateralToShare =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.token.address,
            finalCollateralAmount,
            true
          );

        const finalRemoveCollateralAmountToShare =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.token.address,
            finalRemoveCollateralAmount,
            true
          );

        payload.collateralAmount = finalCollateralToShare;
        payload.removeCollateralAmount = finalRemoveCollateralAmountToShare;

        this.flashRepayHandler(payload);
        return false;
      }

      return false;
    },

    async flashRepayHandler(data) {
      console.log("FLASH REPAY HANDLER", data);

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
        this.selectedPool.reverseSwapContract.address,
        this.account
      );

      if (isTokenToSwapApprove.lt(data.collateralAmount)) {
        isTokenToSwapApprove = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.reverseSwapContract.address
        );
      }

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (isTokenToCookApprove && isTokenToSwapApprove) {
        this.cookFlashRepay(
          data,
          this.isApproved,
          this.selectedPool,
          this.account
        );
        return false;
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
