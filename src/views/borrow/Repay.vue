<template>
  <div class="borrow">
    <div class="deposit-block">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>
      <div class="collateral-input underline">
        <div class="header-balance">
          <h4>Remove collateral</h4>
          <p v-if="selectedPool">
            {{ parseFloat(maxCollateralValue).toFixed(4) }}
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
      <div class="borrow-input underline">
        <div class="header-balance">
          <h4>Repay MIM</h4>
        </div>
        <ValueInput
          :icon="require('@/assets/images/tokens-icon/Token_MIM.svg')"
          name="MIM"
          v-model="borrowValue"
          :max="maxBorrowValue"
          :error="borrowError"
          :disabled="selectedPool ? false : true"
          @input="updateBorrowValue"
        />
      </div>
    </div>
    <div class="info-block">
      <h1 class="title">Repay MIM</h1>
      <BorrowPoolStand
        :pool="selectedPool"
        :isEmpty="selectedPool === null"
        :hasStrategy="selectedPool ? selectedPool.strategyLink : false"
        :tokenToMim="tokenToMim"
        typeOperation="repay"
        :collateralExpected="collateralValue"
        :mimExpected="mimExpected"
        :liquidationPrice="repayExpectedLiquidationPrice"
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
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const DefaultButton = () => import("@/components/main/DefaultButton");
const PopupWrap = () => import("@/components/ui/PopupWrap");
const SelectPoolPopup = () => import("@/components/popups/selectPoolPopup");

import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import cookMixin from "@/mixins/borrow/cooks.js";
import {
  isTokenApprowed,
  approveToken,
  isApprowed,
} from "@/utils/approveHelpers.js";
import { toFixed } from "@/utils/helpers.js";

import { mapGetters } from "vuex";
export default {
  mixins: [borrowPoolsMixin, cookMixin],
  data() {
    return {
      collateralValue: "",
      collateralError: "",
      borrowValue: "",
      borrowError: "",
      poolId: null,
      isApproved: false,
      isOpenPollPopup: false,
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
        if (
          +this.borrowValue === +this.selectedPool.userInfo.userBorrowPart ||
          !+this.selectedPool.userInfo.userBorrowPart
        ) {
          if (
            this.selectedPool.userInfo.maxWithdrawAmount !== -1 &&
            +this.selectedPool.userInfo.maxWithdrawAmount <
              +this.selectedPool.userInfo.userCollateralShare
          ) {
            const parsedMaxContractWithdrawAmount = parseFloat(
              this.selectedPool.userInfo.maxWithdrawAmount
            ).toFixed(20);

            let re = new RegExp(
              // eslint-disable-next-line no-useless-escape
              `^-?\\d+(?:\.\\d{0,` +
                (this.selectedPool.token.decimals || -1) +
                `})?`
            );

            return parsedMaxContractWithdrawAmount.toString().match(re)[0];
          }

          return this.selectedPool.userInfo.userCollateralShare;
        }

        return this.maxRemoveValue;
      }

      return 0;
    },

    maxRemoveValue() {
      const tokenInUsd =
        +this.selectedPool.userInfo.userCollateralShare /
        +this.selectedPool.tokenPrice;

      const ltvMaxPercent = this.selectedPool.ltv - 1;

      const maxMimBorrow = (tokenInUsd / 100) * ltvMaxPercent;

      const maxBorrowLeft =
        +this.borrowValue && !this.borrowError
          ? +maxMimBorrow -
            +this.selectedPool.userInfo.userBorrowPart +
            +this.borrowValue
          : +maxMimBorrow - +this.selectedPool.userInfo.userBorrowPart;

      let borrowLeft = parseFloat(
        ((maxBorrowLeft * this.selectedPool.tokenPrice) /
          this.selectedPool.ltv) *
          100
      ).toFixed(20);

      if (+borrowLeft < 0) return "0";

      if (
        this.selectedPool.userInfo.maxWithdrawAmount !== -1 &&
        +this.selectedPool.userInfo.maxWithdrawAmount < +borrowLeft
      ) {
        const parsedMaxContractWithdrawAmount = parseFloat(
          this.selectedPool.userInfo.maxWithdrawAmount
        ).toFixed(20);

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` +
            (this.selectedPool.token.decimals || -1) +
            `})?`
        );
        return parsedMaxContractWithdrawAmount.toString().match(re)[0];
      }

      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (this.selectedPool.token.decimals || -1) + `})?`
      );

      return borrowLeft.toString().match(re)[0];
    },

    maxBorrowValue() {
      if (this.selectedPool && this.account) {
        if (
          parseFloat(this.selectedPool.userInfo.userBorrowPart) >
          parseFloat(this.parsedPairBalance)
        )
          return this.parsedPairBalance;

        return this.selectedPool.userInfo.userBorrowPart;
      }

      return 0;
    },

    parsedPairBalance() {
      return this.$ethers.utils.formatUnits(
        this.selectedPool.userInfo.userPairBalance.toString(),
        this.selectedPool.pairToken.decimals
      );
    },

    actionBtnText() {
      if (!this.isApproved) return "Nothing to do";

      if (this.isUserLocked && +this.collateralValue > 0)
        return "Nothing to do";

      if (this.collateralError || this.borrowError) return "Nothing to do";

      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Remove and Repay";

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Remove collateral";

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError)
        return "Repay borrow";

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

    mimExpected() {
      if (!this.borrowError) return this.borrowValue;

      return 0;
    },

    repayExpectedLiquidationPrice() {
      if (this.selectedPool && this.account) {
        console.log("repayExpectedBorrowed", this.repayExpectedBorrowed);
        console.log("repayExpectedCollateral", this.repayExpectedCollateral);
        const liquidationPrice =
          +this.repayExpectedBorrowed /
            +this.repayExpectedCollateral /
            this.liquidationMultiplier || 0;

        return liquidationPrice;
      }
      return 0;
    },

    repayExpectedBorrowed() {
      if (this.collateralError || this.borrowError)
        return +this.selectedPool.userInfo.userBorrowPart;
      return +this.selectedPool.userInfo.userBorrowPart - +this.borrowValue;
    },

    repayExpectedCollateral() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo.userCollateralShare;
      return (
        +this.selectedPool.userInfo.userCollateralShare - +this.collateralValue
      );
    },

    liquidationMultiplier() {
      return this.selectedPool.ltv / 100;
    },
  },

  methods: {
    updateCollateralValue(value) {
      if (parseFloat(value) > parseFloat(this.maxCollateralValue)) {
        this.collateralError = `The value cannot be greater than ${this.maxCollateralValue}`;
        return false;
      }

      if (!value) {
        this.collateralError = "";
        this.collateralValue = value;
      }

      if (value === this.maxCollateralValue) {
        this.collateralError = "";

        this.borrowValue = +this.maxBorrowValue ? this.maxBorrowValue : "";
        this.collateralValue = +this.maxCollateralValue
          ? this.maxCollateralValue
          : "";

        return false;
      }

      this.collateralError = "";
      this.collateralValue = value;

      return false;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;

      if (parseFloat(value) > parseFloat(this.maxBorrowValue)) {
        this.borrowError = `The value cannot be greater than ${this.maxBorrowValue}`;
        return false;
      }

      this.borrowError = "";

      if (this.collateralValue) {
        if (
          parseFloat(this.collateralValue) > parseFloat(this.maxCollateralValue)
        ) {
          this.collateralError = `The value cannot be greater than ${this.maxCollateralValue}`;
        }
      }

      if (value === this.maxBorrowValue) {
        this.collateralValue = +this.maxCollateralValue
          ? this.maxCollateralValue
          : "";
        return false;
      }
      return false;
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

    async actionHandler() {
      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.removeAndRepayHandler();
        return false;
      }

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.removeCollateralHandler();
        return false;
      }

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError) {
        this.repayHandler();
        return false;
      }
    },

    async removeAndRepayHandler() {
      let parsedAmount = this.$ethers.utils.parseUnits(
        toFixed(this.borrowValue, this.selectedPool.pairToken.decimals),
        this.selectedPool.pairToken.decimals
      );

      let parsedPair = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.token.decimals
      );

      let payload = {
        collateralAmount: parsedAmount,
        amount: parsedPair,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      const finalCollateral =
        await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.token.address,
          parsedPair,
          true
        );

      payload.amount = finalCollateral;

      if (
        this.borrowValue === this.selectedPool.userInfo.userBorrowPart &&
        this.collateralValue === this.selectedPool.userInfo.userCollateralShare
      ) {
        parsedAmount = this.$ethers.utils.parseUnits(
          this.selectedPool.userInfo.userBorrowPart,
          this.selectedPool.pairToken.decimals
        );

        parsedPair = this.$ethers.utils.parseUnits(
          this.selectedPool.userInfo.userCollateralShare,
          this.selectedPool.token.decimals
        );

        payload = {
          collateralAmount: parsedAmount,
          amount: parsedPair,
          updatePrice: this.selectedPool.askUpdatePrice,
        };

        const finalCollateral =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.token.address,
            parsedPair,
            true
          );

        payload.amount = finalCollateral;

        let isTokenToCookApprove = await isTokenApprowed(
          this.selectedPool.pairTokenContract,
          this.selectedPool.masterContractInstance.address,
          this.account
        );

        if (isTokenToCookApprove.lt(payload.collateralAmount)) {
          isTokenToCookApprove = await approveToken(
            this.selectedPool.pairTokenContract,
            this.selectedPool.masterContractInstance.address
          );
        }

        this.isApproved = await isApprowed(this.selectedPool, this.account);

        if (isTokenToCookApprove) {
          this.cookRemoveAndRepayMax(
            payload,
            this.isApproved,
            this.selectedPool
          );
          return false;
        }

        return false;
      }

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.pairTokenContract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.collateralAmount)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.pairTokenContract,
          this.selectedPool.masterContractInstance.address
        );
      }

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (isTokenToCookApprove) {
        this.cookRemoveAndRepay(payload, this.isApproved, this.selectedPool);
        return false;
      }
    },

    async removeCollateralHandler() {
      const parsedPair = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.token.decimals
      );

      const collateralToShare =
        await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.token.address,
          parsedPair.toString(),
          true
        );

      const payload = {
        amount: collateralToShare,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      console.log("REMOVE COLLATERAL HANDLER", payload);
      console.log("collateral amount", payload.amount.toString());

      this.isApproved = await isApprowed(this.selectedPool, this.account);
      this.cookRemoveCollateral(payload, this.isApproved, this.selectedPool);
    },

    async repayHandler() {
      const itsMax =
        this.borrowValue === this.selectedPool.userInfo.userBorrowPart;

      console.log("itsMax", itsMax);

      const parsedAmount = this.$ethers.utils.parseUnits(
        toFixed(this.borrowValue, this.selectedPool.pairToken.decimals),
        this.selectedPool.pairToken.decimals
      );

      const payload = {
        amount: parsedAmount,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsMax,
      };

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.pairTokenContract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.amount)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.pairTokenContract,
          this.selectedPool.masterContractInstance.address
        );
      }

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (isTokenToCookApprove) {
        this.cookRepayMim(payload, this.isApproved, this.selectedPool);
        return false;
      }
    },
  },

  components: {
    NetworksList,
    ValueInput,
    BorrowPoolStand,
    DefaultButton,
    PopupWrap,
    SelectPoolPopup,
  },
};
</script>

<style lang="scss" scoped>
.borrow {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding: 100px 5px;
}

.deposit-block {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collateral-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.borrow-input {
  padding-top: 27px;
  padding-bottom: 14px;
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
  .borrow {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }

  .choose {
    padding: 30px;
  }
}
</style>
