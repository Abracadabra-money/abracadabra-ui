<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div class="deposit-block">
        <h4>Choose Chain</h4>
        <div class="underline">
          <NetworksList />
        </div>
        <div class="collateral-input underline">
          <div class="header-balance">
            <h4>Remove collateral</h4>
            <p v-if="selectedPool">
              {{ maxCollateralValue | formatTokenBalance }}
            </p>
          </div>
          <BaseTokenInput
            :icon="selectedPool ? selectedPool.icon : null"
            :name="selectedPool ? selectedPool.name : null"
            v-model="collateralValue"
            :max="maxCollateralValue"
            :error="collateralError"
            :disabled="!selectedPool"
            @input="updateCollateralValue"
            @openTokensList="isOpenPollPopup = true"
            isChooseToken
          />
        </div>
        <div class="borrow-input underline">
          <div class="header-balance">
            <h4>Repay MIM</h4>
          </div>
          <BaseTokenInput
            :name="borrowToken.name"
            :icon="borrowToken.icon"
            v-model="borrowValue"
            :max="maxBorrowValue"
            :error="borrowError"
            :disabled="!selectedPool"
            @input="updateBorrowValue"
          />
        </div>
        <div class="balance-wrap" v-if="selectedPool">
          <BalanceBlock :pool="selectedPool" />
        </div>
      </div>
      <div class="info-block">
        <h1 class="title">Repay MIM</h1>
        <BorrowPoolStand
          :pool="selectedPool"
          typeOperation="repay"
          :collateralExpected="collateralValue"
          :mimExpected="mimExpected"
          :liquidationPrice="+repayExpectedLiquidationPrice"
          :emptyData="emptyData"
          :poolId="selectedPoolId"
        />
        <template v-if="selectedPool">
          <div class="btn-wrap">
            <BaseButton
              @click="approveTokenHandler"
              primary
              :disabled="isTokenApprove"
              >Approve</BaseButton
            >
            <BaseButton
              @click="actionHandler"
              :disabled="actionBtnText === 'Nothing to do'"
              >{{ actionBtnText }}</BaseButton
            >
          </div>
          <InfoBlock :pool="selectedPool" />
        </template>
      </div>
    </template>

    <BaseLoader v-else />

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
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");
const InfoBlock = () => import("@/components/borrow/InfoBlock");
const LocalPopupWrap = () => import("@/components/popups/LocalPopupWrap");
const MarketsListPopup = () => import("@/components/popups/MarketsListPopup");
const BalanceBlock = () => import("@/components/borrow/BalanceBlock");

import Vue from "vue";

import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
import cookMixin from "@/mixins/borrow/cooks.js";

import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";

import { mapGetters } from "vuex";

export default {
  mixins: [cauldronsMixin, cookMixin],
  data() {
    return {
      collateralValue: "",
      borrowValue: "",
      poolId: null,
      isOpenPollPopup: false,
      updateInterval: null,
      emptyData: {
        img: require(`@/assets/images/empty_borrow.png`),
        text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Repay",
        bottom: "If you want to learn more read our docs",
        link: "https://docs.abracadabra.money/",
      },
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
    }),

    filteredPool() {
      if (this.account && this.pools[0]?.userInfo) {
        return [...this.pools].sort((a, b) =>
          a.userInfo.balanceUsd < b.userInfo.balanceUsd ? 1 : -1
        );
      }
      return this.pools;
    },

    selectedPool() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (pool) return pool;
        return null;
      }
      return null;
    },

    borrowToken() {
      if (this.selectedPool)
        return {
          name: this.selectedPool.borrowToken.name,
          icon: this.selectedPool.borrowToken.icon,
        };

      return {
        name: "MIM",
        icon: require("@/assets/images/tokens/MIM.png"),
      };
    },

    maxCollateralValue() {
      if (this.selectedPool && this.account) {
        if (
          +this.borrowValue === +this.selectedPool.userInfo.userBorrowPart ||
          !+this.selectedPool.userInfo.userBorrowPart
        ) {
          if (
            this.selectedPool.maxWithdrawAmount !== -1 &&
            +this.selectedPool.maxWithdrawAmount <
              +this.selectedPool.userInfo.userCollateralShare
          ) {
            const parsedMaxContractWithdrawAmount = parseFloat(
              this.selectedPool.maxWithdrawAmount
            ).toFixed(20);

            return Vue.filter("formatToFixed")(
              parsedMaxContractWithdrawAmount,
              this.selectedPool.collateralToken.decimals
            );
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
        +this.selectedPool.borrowToken.exchangeRate;

      const ltvMaxPercent = this.selectedPool.ltv - 1;

      const maxMimBorrow = (tokenInUsd / 100) * ltvMaxPercent;

      const maxBorrowLeft =
        +this.borrowValue && !this.borrowError
          ? +maxMimBorrow -
            +this.selectedPool.userInfo.userBorrowPart +
            +this.borrowValue
          : +maxMimBorrow - +this.selectedPool.userInfo.userBorrowPart;

      let borrowLeft = parseFloat(
        ((maxBorrowLeft * this.selectedPool.borrowToken.exchangeRate) /
          this.selectedPool.ltv) *
          100
      ).toFixed(20);

      if (+borrowLeft < 0) return "0";

      if (
        this.selectedPool.maxWithdrawAmount !== -1 &&
        +this.selectedPool.maxWithdrawAmount < +borrowLeft
      ) {
        const parsedMaxContractWithdrawAmount = parseFloat(
          this.selectedPool.maxWithdrawAmount
        ).toFixed(20);

        return Vue.filter("formatToFixed")(
          parsedMaxContractWithdrawAmount,
          this.selectedPool.collateralToken.decimals
        );
      }

      return Vue.filter("formatToFixed")(
        borrowLeft,
        this.selectedPool.collateralToken.decimals
      );
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
        this.selectedPool.borrowToken.decimals
      );
    },

    actionBtnText() {
      if (!this.isTokenApprove) return "Nothing to do";

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
        return "Repay";

      return "Nothing to do";
    },

    mimExpected() {
      if (!this.borrowError) return this.borrowValue;

      return 0;
    },

    repayExpectedLiquidationPrice() {
      if (this.selectedPool && this.account) {
        if (!this.repayExpectedBorrowed || !this.repayExpectedCollateral) {
          return 0;
        }

        return (
          +this.repayExpectedBorrowed /
            +this.repayExpectedCollateral /
            +this.liquidationMultiplier || 0
        );
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

    followLink() {
      return !!(this.$route.params.id && !this.pools.length);
    },

    isTokenApprove() {
      if (
        this.selectedPool &&
        this.selectedPool.userInfo &&
        this.account &&
        this.borrowValue
      ) {
        return this.selectedPool.userInfo.isApproveTokenBorrow;
      }

      return true;
    },

    collateralError() {
      if (isNaN(this.collateralValue)) return "Please input valid value";

      if (
        parseFloat(this.collateralValue) > parseFloat(this.maxCollateralValue)
      )
        return `The value cannot be greater than ${this.maxCollateralValue}`;

      return "";
    },

    borrowError() {
      if (isNaN(this.borrowValue)) return "Please input valid value";

      if (parseFloat(this.borrowValue) > parseFloat(this.maxBorrowValue)) {
        return `The value cannot be greater than ${this.maxBorrowValue}!`;
      }

      return "";
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },
  },

  watch: {
    account() {
      this.createPools();
    },

    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (!pool) this.$router.push(`/repay`);
      }

      return false;
    },
  },

  methods: {
    updateCollateralValue(value) {
      this.collateralValue = value;
      return false;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
      if (value === this.maxBorrowValue) {
        this.collateralValue = +this.maxCollateralValue
          ? this.maxCollateralValue
          : "";
        return false;
      }
      return false;
    },

    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      let approve = await approveToken(
        this.selectedPool.borrowToken.contract,
        this.selectedPool.masterContractInstance.address
      );

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
      this.collateralValue = "";
      this.borrowValue = "";
      this.poolId = pool.id;

      let duplicate = this.$route.fullPath === `/repay/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/repay/${pool.id}`);
      }
    },

    async actionHandler() {
      if(this.chainId === 43114) return false; //TEMP

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
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      let parsedAmount = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(
          this.borrowValue,
          this.selectedPool.borrowToken.decimals
        ),
        this.selectedPool.borrowToken.decimals
      );

      let parsedPair = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.collateralToken.decimals
      );

      let payload = {
        collateralAmount: parsedAmount,
        amount: parsedPair,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      payload.amount = await this.selectedPool.masterContractInstance.toShare(
        this.selectedPool.collateralToken.address,
        parsedPair,
        true
      );

      if (
        this.borrowValue === this.selectedPool.userInfo.userBorrowPart &&
        this.collateralValue === this.selectedPool.userInfo.userCollateralShare
      ) {
        parsedAmount = this.$ethers.utils.parseUnits(
          this.selectedPool.userInfo.userBorrowPart,
          this.selectedPool.borrowToken.decimals
        );

        parsedPair = this.$ethers.utils.parseUnits(
          this.selectedPool.userInfo.userCollateralShare,
          this.selectedPool.collateralToken.decimals
        );

        payload = {
          collateralAmount: parsedAmount,
          amount: parsedPair,
          updatePrice: this.selectedPool.askUpdatePrice,
        };

        payload.amount = await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.collateralToken.address,
          parsedPair,
          true
        );

        let isTokenToCookApprove = await isTokenApprowed(
          this.selectedPool.borrowToken.contract,
          this.selectedPool.masterContractInstance.address,
          this.account
        );

        if (isTokenToCookApprove.lt(payload.collateralAmount)) {
          isTokenToCookApprove = await approveToken(
            this.selectedPool.borrowToken.contract,
            this.selectedPool.masterContractInstance.address
          );
        }

        let isApproved = await isApprowed(this.selectedPool, this.account);

        if (+isTokenToCookApprove) {
          this.cookRemoveAndRepayMax(
            payload,
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
      }

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.borrowToken.contract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.collateralAmount)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.borrowToken.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookRemoveAndRepay(
          payload,
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

    async removeCollateralHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const parsedPair = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.collateralToken.decimals
      );

      const collateralToShare =
        await this.selectedPool.masterContractInstance.toShare(
          this.selectedPool.collateralToken.address,
          parsedPair.toString(),
          true
        );

      const payload = {
        amount: collateralToShare,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      let isApproved = await isApprowed(this.selectedPool, this.account);

      await this.cookRemoveCollateral(
        payload,
        isApproved,
        this.selectedPool,
        notificationId
      );

      return false;
    },

    async repayHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const itsMax =
        this.borrowValue === this.selectedPool.userInfo.userBorrowPart;

      const parsedAmount = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(
          this.borrowValue,
          this.selectedPool.borrowToken.decimals
        ),
        this.selectedPool.borrowToken.decimals
      );

      const payload = {
        amount: parsedAmount,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsMax,
      };

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.borrowToken.contract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.amount)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.borrowToken.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookRepayMim(
          payload,
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
  },

  created() {
    this.poolId = this.$route.params.id;

    this.updateInterval = setInterval(async () => {
      this.createPools();
    }, 15000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: {
    BalanceBlock,
    NetworksList,
    BaseTokenInput,
    BorrowPoolStand,
    BaseButton,
    BaseLoader,
    InfoBlock,
    LocalPopupWrap,
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

.deposit-block {
  padding: 30px 30px 50px;
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
  margin-bottom: 30px;
}

.balance-wrap {
  margin-top: 30px;
}

@media (max-width: 1200px) {
  .borrow {
    grid-gap: 15px;
  }

  .info-block {
    padding: 30px 20px;
  }

  .deposit-block {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .borrow {
    grid-gap: 20px;
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
