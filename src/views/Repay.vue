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
const StableInfo = () => import("@/components/borrow/StableInfo");
const DefaultButton = () => import("@/components/main/DefaultButton");
const PopupWrap = () => import("@/components/ui/PopupWrap");
const SelectPoolPopup = () => import("@/components/popups/SelectPoolPopup");

import borrowPoolsMixin from "@/mixins/borrowPools.js";
import cookMixin from "@/mixins/cook.js";

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
      if (this.selectedPool) {
        return this.$ethers.utils.formatUnits(
          this.selectedPool.userInfo.userBalance
        );
      }

      return 0;
    },

    maxBorrowValue() {
      if (this.selectedPool) {
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
        this.selectedPool.userInfo.userLockedTimestamp &&
        Number(this.selectedPool.userInfo.userLockedTimestamp) !== 0
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
  },

  methods: {
    updateCollateralValue(value) {
      this.collateralValue = value;

      if (parseFloat(value) > parseFloat(this.maxCollateralValue)) {
        this.collateralError = `The value cannot be greater than ${this.maxCollateralValue}`;
        return false;
      }

      this.collateralError = "";

      if (this.borrowValue) {
        if (parseFloat(this.borrowValue) > parseFloat(this.maxBorrowValue)) {
          this.borrowError = `The value cannot be greater than ${this.maxBorrowValue}`;
        }
      }

      if (value === this.maxCollateralValue) {
        this.borrowValue = +this.maxBorrowValue ? this.maxBorrowValue : "";
        return false;
      }
    },

    updateBorrowValue(value) {
      if (parseFloat(value) > parseFloat(this.maxBorrowValue)) {
        this.borrowError = `The value cannot be greater than ${this.maxBorrowValue}`;
        return false;
      }

      if (!value) {
        this.borrowError = "";
        this.borrowValue = value;
      }

      if (value === this.maxBorrowValue) {
        this.borrowError = "";
        this.collateralValue = +this.maxCollateralValue
          ? this.maxCollateralValue
          : "";
        this.borrowValue = +this.maxBorrowValue ? this.maxBorrowValue : "";

        return false;
      }

      this.borrowError = "";
      this.borrowValue = value;
    },

    async isTokenApprowed(tokenContract, spenderAddress) {
      try {
        const addressApprowed = await tokenContract.allowance(
          this.account,
          spenderAddress,
          {
            gasLimit: 1000000,
          }
        );

        return addressApprowed;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },

    async approveToken(tokenContract, spenderAddress) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        console.log("APPROVE RESP:", receipt);

        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },

    async isApprowed() {
      try {
        const masterContract = await this.getMasterContract();
        const addressApprowed =
          await this.selectedPool.masterContractInstance.masterContractApproved(
            masterContract,
            this.account
          );
        return addressApprowed;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },

    async approveTokenHandler() {
      this.isApproved = await this.approveToken(
        this.selectedPool.pairTokenContract,
        this.selectedPool.masterContractInstance.address
      );
    },

    async chosePool(pool) {
      this.collateralValue = "";
      this.borrowValue = "";
      this.poolId = pool.id;

      this.isApproved = this.selectedPool?.pairToken?.isPairTokenApprove;
    },

    toFixed(num, fixed) {
      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (fixed || -1) + `})?`);
      return num.toString().match(re)[0];
    },

    async getMasterContract() {
      try {
        const masterContract =
          await this.selectedPool.contractInstance.masterContract();
        return masterContract;
      } catch (e) {
        console.log("getMasterContract err:", e);
      }
    },

    async actionHandler() {
      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.repayCollateralAndBorrowHandler();
        return false;
      }

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.repayCollateralHandler();
        return false;
      }

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError) {
        this.repayBorrowHandler();
        return false;
      }
    },

    async isCookApprove(pool, amount) {
      let isTokenToCookApprove = await this.isTokenApprowed(
        pool.pairTokenContract,
        pool.masterContractInstance.address
      );

      if (isTokenToCookApprove.lt(amount)) {
        isTokenToCookApprove = await this.approveToken(
          pool.pairTokenContract,
          pool.masterContractInstance.address
        );
      }

      return isTokenToCookApprove;
    },

    async repayCollateralAndBorrowHandler() {
      let isTokenToCookApprove;
      let parsedCollateral = this.$ethers.utils.parseUnits(
        this.toFixed(
          this.collateralValue,
          this.selectedPool.pairToken.decimals
        ),
        this.selectedPool.pairToken.decimals
      );
      let parsedBorrow = this.$ethers.utils.parseUnits(
        this.borrowValue.toString(),
        this.selectedPool.token.decimals
      );

      let payload = {
        collateralAmount: parsedCollateral,
        amount: parsedBorrow,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      const finalCollateral =
        await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.token.address,
          parsedBorrow,
          true
        );

      payload.amount = finalCollateral;
      if (
        this.collateralValue === this.selectedPool.userInfo.userBorrowPart &&
        this.borrowValue === this.selectedPool.userInfo.userCollateralShare
      ) {
        parsedCollateral = this.$ethers.utils.parseUnits(
          this.selectedPool.userInfo.userBorrowPart,
          this.selectedPool.pairToken.decimals
        );
        parsedBorrow = this.$ethers.utils.parseUnits(
          this.selectedPool.userInfo.userCollateralShare,
          this.selectedPool.token.decimals
        );

        payload = {
          collateralAmount: parsedCollateral,
          amount: parsedBorrow,
          updatePrice: this.selectedPool.askUpdatePrice,
        };

        const finalCollateral =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.token.address,
            parsedBorrow,
            true
          );

        payload.amount = finalCollateral;

        isTokenToCookApprove = await this.isCookApprove(
          this.selectedPool,
          payload.collateralAmount
        );

        const isApprowed = await this.isApprowed();

        if (+isTokenToCookApprove) {
          this.cookRemoveAndRepayMax(payload, isApprowed, this.selectedPool);
          return false;
        }

        return false;
      }

      isTokenToCookApprove = await this.isCookApprove(
        this.selectedPool,
        payload.collateralAmount
      );

      const isApprowed = await this.isApprowed();

      if (+isTokenToCookApprove) {
        this.cookRemoveAndRepay(payload, isApprowed, this.selectedPool);
        return false;
      }
    },

    async repayCollateralHandler() {
      const itsMax =
        this.collateralValue === this.selectedPool.userInfo.userBorrowPart;

      const parsedCollateral = this.$ethers.utils.parseUnits(
        this.toFixed(
          this.collateralValue,
          this.selectedPool.pairToken.decimals
        ),
        this.selectedPool.pairToken.decimals
      );

      const payload = {
        amount: parsedCollateral,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsMax,
      };

      console.log("repayCollateralHandler", payload);

      let isTokenToCookApprove = await this.isCookApprove(
        this.selectedPool,
        payload.amount
      );

      const isApprowed = await this.isApprowed();

      if (+isTokenToCookApprove) {
        this.cookRepayCollateral(payload, isApprowed, this.selectedPool);
        return false;
      }
    },

    async repayBorrowHandler() {
      const parsedBorrowValue = this.$ethers.utils.parseUnits(
        this.borrowValue.toString(),
        this.selectedPool.token.decimals
      );

      const collateralToShare =
        await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.token.address,
          parsedBorrowValue.toString(),
          true
        );

      const payload = {
        amount: collateralToShare,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      console.log("repayBorrowHandler", payload);

      const isApprowed = await this.isApprowed();

      this.cookRemoveCollateral(payload, isApprowed, this.selectedPool);
    },
  },

  components: {
    NetworksList,
    ValueInput,
    StableInfo,
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
  padding: 100px 0;
}

.deposit-block {
  padding: 20px 16px;
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
