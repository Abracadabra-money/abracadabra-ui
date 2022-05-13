<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div class="deposit-block">
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

        <div class="collateral-input underline">
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

          <BaseTokenInput
            name="MIM"
            :icon="mimIcon"
            v-model="borrowValue"
            :max="maxBorrowValue"
            :error="borrowError"
            :disabled="selectedPool ? false : true"
            @input="updateBorrowValue"
          />
        </div>
        <template v-if="selectedPool">
          <div class="deposit-info underline">
            <span>LTV</span>
            <span>{{ calculateLtv }}%</span>
          </div>

          <div class="percent-wrap">
            <PercentageButtons
              :liquidationPrice="depositExpectedLiquidationPrice"
              @onchange="updatePercentValue"
              :maxValue="ltv"
            />
          </div>

          <BalanceBlock :pool="selectedPool" />
        </template>
      </div>

      <div class="info-block">
        <h1 class="title">Borrow MIM</h1>
        <BorrowPoolStand
          :pool="selectedPool"
          :isEmpty="selectedPool === null"
          :hasStrategy="selectedPool ? selectedPool.strategyLink : false"
          :tokenToMim="tokenToMim"
          typeOperation="borrow"
          :collateralExpected="collateralValue"
          :mimExpected="mimExpected"
          :liquidationPrice="depositExpectedLiquidationPrice"
          :emptyData="emptyData"
        />
        <template v-if="selectedPool">
          <div class="btn-wrap">
            <BaseButton
              @click="approveTokenHandler"
              primary
              :disabled="isTokenApprove"
              >Approve</BaseButton
            >
            <BaseButton @click="actionHandler" :disabled="!isTokenApprove">{{
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
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const PercentageButtons = () => import("@/components/borrow/PercentageButtons");
const BalanceBlock = () => import("@/components/borrow/BalanceBlock");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");
const PopupWrap = () => import("@/components/popups/PopupWrap");
const SelectPoolPopup = () => import("@/components/popups/selectPoolPopup");

import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import cookMixin from "@/mixins/borrow/cooks.js";
import mimIcon from "@/assets/images/tokens/MIM.png";
import {
  isTokenApprowed,
  approveToken,
  isApprowed,
} from "@/utils/approveHelpers.js";
import { toFixed } from "@/utils/helpers.js";
import notification from "@/utils/notification/index.js";

import { mapGetters } from "vuex";
export default {
  mixins: [borrowPoolsMixin, cookMixin],
  data() {
    return {
      mimIcon,
      collateralValue: "",
      collateralError: "",
      borrowValue: "",
      borrowError: "",
      poolId: null,
      isOpenPollPopup: false,
      useDefaultBalance: false,
      updateInterval: null,
      emptyData: {
        img: require(`@/assets/images/empty_borrow.png`),
        text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Borrow",
        bottom: "If you want to learn more read our docs",
        link: "https://abracadabra.money/",
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

        if (maxPairValue < 0) {
          return 0;
        }

        return maxPairValue;
      }

      return 0;
    },

    actionBtnText() {
      if (!this.isTokenApprove) return "Nothing to do";

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
      if (
        this.collateralValue &&
        this.borrowValue &&
        !this.borrowError &&
        !this.collateralError
      ) {
        const tokenToMim = this.collateralValue / this.selectedPool.tokenPrice;
        let ltv = Math.round((this.borrowValue / tokenToMim) * 100) + 1;

        if (ltv <= this.selectedPool.ltv) {
          return ltv;
        }
        return this.selectedPool.ltv;
      }

      if (this.borrowValue && !this.borrowError) {
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

    mimExpected() {
      if (!this.borrowError) return this.borrowValue;

      return 0;
    },

    depositExpectedLiquidationPrice() {
      if (this.selectedPool && this.account) {
        const liquidationPrice =
          +this.depositExpectedBorrowed /
            +this.depositExpectedCollateral /
            this.liquidationMultiplier || 0;

        return liquidationPrice;
      }
      return 0;
    },

    depositExpectedBorrowed() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo.userBorrowPart;
      return +this.borrowValue + +this.selectedPool.userInfo.userBorrowPart;
    },

    depositExpectedCollateral() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo.userCollateralShare;
      return (
        +this.collateralValue + +this.selectedPool.userInfo.userCollateralShare
      );
    },

    liquidationMultiplier() {
      return this.selectedPool.ltv / 100;
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
          return `${this.selectedPool.name} (new)`;

        if (this.networkValuteName && this.useDefaultBalance)
          return this.networkValuteName;

        return this.selectedPool.token.name;
      }
      return "";
    },

    isTokenApprove() {
      if (this.selectedPool && this.account) {
        return this.selectedPool.token.isTokenApprove;
      }

      return true;
    },

    ltv() {
      if (this.selectedPool) {
        return this.selectedPool.ltv;
      }
      return 0;
    },
  },

  watch: {
    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (!pool) this.$router.push(`/borrow`);
      }

      return false;
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
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approve.pending
      );

      let approve = await approveToken(
        this.selectedPool.token.contract,
        this.selectedPool.masterContractInstance.address
      );

      if (approve) {
        await this.$store.commit("notifications/delete", notificationId);
      } else {
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.approve.error
        );
      }

      return false;
    },

    async chosePool(pool) {
      this.collateralValue = "";
      this.borrowValue = "";

      this.useDefaultBalance = false;

      this.poolId = pool.id;

      let duplicate = this.$route.fullPath === `/borrow/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/borrow/${pool.id}`);
      }
    },

    async checkIsPoolAllowBorrow(amount, notificationId) {
      if (+amount < +this.selectedPool.dynamicBorrowAmount) {
        return true;
      }

      await this.$store.commit("notifications/delete", notificationId);

      await this.$store.dispatch("notifications/new", notification.allowBorrow);

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
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );

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
        itsDefaultBalance: this.useDefaultBalance,
      };

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

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookCollateralAndBorrow(
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
        notification.approve.error
      );

      return false;
    },

    async collateralHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );

      const parsedCollateralValue = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.token.decimals
      );

      const payload = {
        amount: parsedCollateralValue,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.useDefaultBalance,
      };

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

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateral(
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
        notification.approve.error
      );

      return false;
    },

    async borrowHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );

      if (!this.checkIsPoolAllowBorrow(this.borrowValue, notificationId)) {
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

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookBorrow(
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
        notification.approve.error
      );

      return false;
    },

    toggleUseDefaultBalance() {
      this.clearData();

      this.useDefaultBalance = !this.useDefaultBalance;
    },

    clearData() {
      this.collateralValue = "";
      this.collateralError = "";
      this.borrowValue = "";
      this.borrowError = "";
    },

    updatePercentValue(value) {
      if (this.collateralValue && value) {
        const newBorrowValue =
          (this.maxBorrowValue * value) / this.selectedPool.ltv;
        this.borrowValue =
          +newBorrowValue > +this.maxBorrowValue
            ? this.maxBorrowValue
            : newBorrowValue;
      } else {
        this.borrowValue = "";
      }
    },
  },

  created() {
    this.poolId = this.$route.params.id;

    // this.updateInterval = setInterval(async () => {
    //   console.log("createPools");
    //   this.tokensInfo = this.createPools();
    // }, 15000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    BaseTokenInput,
    BorrowPoolStand,
    PercentageButtons,
    BalanceBlock,
    BaseButton,
    BaseLoader,
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
  max-width: 100%;
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

.deposit-info {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

.percent-wrap {
  padding: 30px 0;
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
  .info-block {
    padding: 30px 20px;
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
    max-width: 100%;
  }

  .choose {
    padding: 30px;
  }
}
</style>
