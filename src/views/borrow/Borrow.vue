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
            :disabled="!selectedPool"
            @input="updateBorrowValue"
          />
        </div>
        <template v-if="selectedPool">
          <div class="deposit-info underline">
            <span>
              <img
                class="tooltip-icon"
                src="@/assets/images/info.svg"
                v-tooltip="ltvTooltip"
                alt="info"
              />
              LTV</span
            >
            <span>{{ calculateLtv }}%</span>
          </div>

          <div class="percent-wrap">
            <PercentageButtons
              :liquidationPrice="depositExpectedLiquidationPrice"
              :collateralValue="collateralValue"
              @onchange="updatePercentValue"
              :maxValue="ltv"
            />
          </div>

          <BalanceBlock :pool="selectedPool" />
        </template>

        <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>

      <div class="info-block">
        <h1 class="title">Borrow MIM</h1>
        <BorrowPoolStand
          :pool="selectedPool"
          :collateralExpected="collateralValue"
          :mimExpected="mimExpected"
          :liquidationPrice="depositExpectedLiquidationPrice"
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
const PercentageButtons = () => import("@/components/borrow/PercentageButtons");
const BalanceBlock = () => import("@/components/borrow/BalanceBlock");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");
const LocalPopupWrap = () => import("@/components/popups/LocalPopupWrap");
const MarketsListPopup = () => import("@/components/popups/MarketsListPopup");

import Vue from "vue";

import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import cookMixin from "@/mixins/borrow/cooks.js";
import mimIcon from "@/assets/images/tokens/MIM.png";
import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";

import { mapGetters } from "vuex";

export default {
  mixins: [borrowPoolsMixin, cookMixin],
  data() {
    return {
      mimIcon,
      collateralValue: "",
      borrowValue: "",
      poolId: null,
      isOpenPollPopup: false,
      useDefaultBalance: false,
      updateInterval: null,
      emptyData: {
        img: require(`@/assets/images/empty_borrow.png`),
        text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Borrow",
        bottom: "If you want to learn more read our docs",
        link: "https://docs.abracadabra.money/",
      },
      ltvTooltip:
        "Loan to Value: percentage of debt compared to the collateral. The higher it is, the riskier the position",
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
    }),

    filteredPool() {
      if (this.account && this.pools[0]?.userInfo) {
        return this.pools
          .filter((pool) => !pool.isDepreciated)
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
      if (isNaN(this.collateralValue)) return "Please input valid value";

      if (
        parseFloat(this.collateralValue) > parseFloat(this.maxCollateralValue)
      )
        return `The value cannot be greater than ${this.maxCollateralValue}`;

      return "";
    },

    borrowError() {
      if (isNaN(this.borrowValue)) return "Please input valid value";

      if (parseFloat(this.borrowValue) > parseFloat(this.maxBorrowValue))
        return `The value cannot be greater than ${this.maxBorrowValue}`;

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
            this.selectedPool.userInfo?.userBorrowPart;
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
        {
          name: "Liquidation fee",
          value: this.selectedPool.stabilityFee,
        },
        {
          name: "Borrow fee",
          value: this.selectedPool.borrowFee,
        },
        { name: "Interest", value: this.selectedPool.interest },
        { name: "Price", value: Vue.filter("formatUSD")(this.tokenToMim) },
      ];
    },

    calculateLtv() {
      if (this.collateralValue && !this.collateralError && !this.borrowError) {
        const percent = this.maxBorrowValue / this.selectedPool.ltv;

        let ltv = this.borrowValue / percent;

        if (ltv > this.selectedPool.ltv) return this.selectedPool.ltv;

        return parseFloat(ltv).toFixed(0);
      }

      if (this.borrowValue && !this.borrowError && !this.collateralError) {
        const tokenToMim =
          this.selectedPool.userInfo?.userCollateralShare /
          this.selectedPool.tokenPrice;
        let ltv =
          Math.round(
            ((+this.borrowValue + +this.selectedPool.userInfo?.userBorrowPart) /
              tokenToMim) *
              100
          ) + 1;

        if (ltv <= this.selectedPool.ltv) {
          return parseFloat(ltv).toFixed(0);
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
        return (
          +this.depositExpectedBorrowed /
            +this.depositExpectedCollateral /
            this.liquidationMultiplier || 0
        );
      }
      return 0;
    },

    depositExpectedBorrowed() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo?.userBorrowPart;
      return +this.borrowValue + +this.selectedPool.userInfo?.userBorrowPart;
    },

    depositExpectedCollateral() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo?.userCollateralShare;
      return (
        +this.collateralValue + +this.selectedPool.userInfo?.userCollateralShare
      );
    },

    liquidationMultiplier() {
      return this.selectedPool.ltv / 100;
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

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },

    tokenToMim() {
      if (this.selectedPool) {
        const tokenToMim = 1 / this.selectedPool.tokenPrice;

        let decimals = 4;

        if (this.selectedPool.name === "SHIB") decimals = 6;

        return Vue.filter("formatToFixed")(tokenToMim, decimals);
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
        if (!pool) this.$router.push(`/borrow`);
      }

      return false;
    },
  },

  methods: {
    updateCollateralValue(value) {
      this.collateralValue = value;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
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
          notification.approveError
        );
      }

      return false;
    },

    async chosePool(pool) {
      this.clearData();

      this.useDefaultBalance = false;

      this.poolId = pool.id;

      let duplicate = this.$route.fullPath === `/borrow/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/borrow/${pool.id}`);
      }
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
        notification.pending
      );

      const parsedCollateral = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        this.selectedPool.token.decimals
      );

      if (!this.checkIsPoolAllowBorrow(+this.borrowValue, notificationId)) {
        return false;
      }

      const parsedBorrow = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(
          this.borrowValue,
          this.selectedPool.pairToken.decimals
        ),
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
        notification.approveError
      );

      return false;
    },

    async collateralHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
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
        notification.approveError
      );

      return false;
    },

    async borrowHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      if (!this.checkIsPoolAllowBorrow(+this.borrowValue, notificationId)) {
        return false;
      }

      if (!this.checkIsUserWhitelistedBorrow()) {
        return false;
      }

      if (!this.checkIsAcceptNewYvcrvSTETHBorrow()) {
        return false;
      }

      const parsedBorrowValue = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(
          this.borrowValue,
          this.selectedPool.pairToken.decimals
        ),
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
        notification.approveError
      );

      return false;
    },

    toggleUseDefaultBalance() {
      this.clearData();

      this.useDefaultBalance = !this.useDefaultBalance;
    },

    clearData() {
      this.collateralValue = "";
      this.borrowValue = "";
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
    BorrowPoolStand,
    PercentageButtons,
    BalanceBlock,
    BaseButton,
    BaseLoader,
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
  position: relative;
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
  align-items: center;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

.deposit-info span {
  display: flex;
  align-items: center;
  line-height: 24px;
}

.tooltip-icon {
  margin-right: 5px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.percent-wrap {
  padding: 30px 0;
}

.choose-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
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

.checkbox-wrap {
  background: rgba(129, 126, 166, 0.1);
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

  .choose-link {
    bottom: 15px;
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

  .choose {
    padding: 30px;
  }
}
</style>
