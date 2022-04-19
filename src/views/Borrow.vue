<template>
  <div class="borrow">
    <div class="deposit-block">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>

      <div class="collateral-input underline">
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
      <div class="borrow-input underline">
        <div class="header-balance">
          <h4>MIM to Borrow</h4>
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

      <div class="deposit-info underline" v-if="selectedPool">
        <span>LTV</span>
        <span>{{ calculateLtv }}%</span>
      </div>
    </div>

    <div class="info-block">
      <h1 class="title">Borrow MIM</h1>
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
const SelectPoolPopup = () =>
  import("@/components/popups/selectPoolPopup/SelectPoolPopup");

import borrowPoolsMixin from "@/mixins/borrowPools.js";
import cookMixin from "@/mixins/cook.js";
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

      if (this.collateralError || this.borrowError) return "Nothing to do";

      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Add collateral and borrow";

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Add collateral";

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError)
        return "Borrow";

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

    calculateLtv() {
      if (this.collateralValue && this.borrowValue) {
        const tokenToMim = this.collateralValue / this.selectedPool.tokenPrice;
        let ltv = Math.round((this.borrowValue / tokenToMim) * 100) + 1;

        if (ltv <= this.selectedPool.ltv) {
          return ltv;
        }
        return this.selectedPool.ltv;
      }

      if (this.borrowValue) {
        const tokenToMim =
          this.selectedPool.userInfo.userCollateralShare /
          this.selectedPool.tokenPrice;
        let ltv =
          Math.round(
            ((+this.borrowValue + +this.selectedPool.userInfo.userBorrowPart) /
              tokenToMim) *
              100
          ) + 1;

        if (ltv <= this.selectedPool.ltv) {
          return ltv;
        }
        return this.selectedPool.ltv;
      }

      return 0;
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
        console.log("gggggggggggggggg", this.maxBorrowValue);
        if (parseFloat(this.borrowValue) > parseFloat(this.maxBorrowValue)) {
          this.borrowError = `The value cannot be greater than ${this.maxBorrowValue}!!!!`;
        } else {
          this.borrowError = "";
        }
      }
    },

    updateBorrowValue(value) {
      if (parseFloat(value) > parseFloat(this.maxBorrowValue)) {
        this.borrowError = `The value cannot be greater than ${this.maxBorrowValue}`;
        return false;
      }

      this.borrowError = "";
      this.borrowValue = value;
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
      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.collateralAndBorrowHandler();
        return false;
      }

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.collateralHandler();
        return false;
      }

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError) {
        this.borrowHandler();
        return false;
      }
    },

    async collateralAndBorrowHandler() {
      const parsedCollateral = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.token.decimals
      );

      const parsedBorrow = this.$ethers.utils.parseUnits(
        toFixed(this.borrowValue, this.selectedPool.pairToken.decimals),
        this.selectedPool.pairToken.decimals
      );

      const payload = {
        collateralAmount: parsedCollateral,
        amount: parsedBorrow,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.selectedPool.acceptUseDefaultBalance,
      };

      console.log("Add collateral and borrow $emit", payload);

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.token.contract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.collateralAmount)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        this.cookCollateralAndBorrow(
          payload,
          this.isApproved,
          this.selectedPool
        );
        return false;
      }

      return false;
    },

    async collateralHandler() {
      const parsedCollateralValue = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.token.decimals
      );

      const payload = {
        amount: parsedCollateralValue,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.selectedPool.acceptUseDefaultBalance,
      };

      console.log("Add collateral $emit", payload);

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.token.contract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.amount)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      this.isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        this.cookAddCollateral(payload, this.isApproved, this.selectedPool);
        return false;
      }

      return false;
    },

    async borrowHandler() {
      if (!this.checkIsPoolAllowBorrow(this.borrowValue)) {
        return false;
      }

      const parsedBorrowValue = this.$ethers.utils.parseUnits(
        toFixed(this.borrowValue, this.selectedPool.pairToken.decimals),
        this.selectedPool.pairToken.decimals
      );

      const payload = {
        amount: parsedBorrowValue,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      console.log("Add borrow $emit", payload);

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
