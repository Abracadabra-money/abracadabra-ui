<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div class="choose">
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
          <button @click="isOpenPollPopup = true" class="select-btn">
            <div class="select-icon">
              <BaseTokenIcon
                :icon="selectIcon"
                type="select"
                :name="selectName"
              />
              <span class="token-name">
                {{ selectTitle }}
              </span>
            </div>
            <img
              class="token-arrow"
              src="@/assets/images/arrow.svg"
              alt="arrow"
            />
          </button>
        </div>
        <div class="leverage-range" v-if="selectedPool">
          <div class="settings-wrap">
            <button @click="isSettingsOpened = true" class="settings-btn">
              <img src="@/assets/images/settings.png" alt="settings" />
            </button>
          </div>

          <Range
            v-model="flashRepayAmount"
            :max="+maxFlashRepayAmount"
            :step="+borrowStepRange"
            title="Choose the amount of MIM you want to repay"
          />

          <div class="range-underline underline"></div>

          <Range
            title="Choose the amount of collateral you want to remove"
            v-model="flashRepayRemoveAmount"
            :max="maxFlashRepayRemoveAmount"
            :step="+collateralStepRange"
            :parallelRange="flashRepayAmount"
          />
        </div>
        <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>
      <div class="info-block">
        <h1 class="title">Deleverage</h1>
        <BorrowPoolStand
          :pool="selectedPool"
          typeOperation="repay"
          :collateralExpected="collateralExpected"
          :mimExpected="flashRepayAmount"
          :liquidationPrice="flashReapyExpectedLiquidationPrice"
          :itsMaxRepayMim="itsMaxRepayMim"
          :emptyData="emptyData"
          :poolId="selectedPoolId"
        />
        <template v-if="selectedPool">
          <div class="btn-wrap">
            <BaseButton
              @click="approveTokenHandler"
              primary
              :disabled="isTokenApprove"
              v-if="!isTokenApprove"
              >{{ actionApproveTokenText }}</BaseButton
            >

            <BaseButton
              v-else
              @click="closePosition"
              primary
              :disabled="isDisabledClosePosition"
              >Close Position</BaseButton
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
              <span>{{ item.value }}%</span>
            </div>
          </div>
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap v-model="isSettingsOpened">
      <SettingsPopup @saveSettings="changeSlippage"
    /></LocalPopupWrap>
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
const Range = () => import("@/components/ui/Range");
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const BaseButton = () => import("@/components/base/BaseButton");
const BaseLoader = () => import("@/components/base/BaseLoader");
const LocalPopupWrap = () => import("@/components/popups/LocalPopupWrap");
const SettingsPopup = () => import("@/components/leverage/SettingsPopup");
const MarketsListPopup = () => import("@/components/popups/MarketsListPopup");
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");

import Vue from "vue";

import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import cookMixin from "@/mixins/borrow/cooks.js";
import { mapGetters } from "vuex";
import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";

export default {
  mixins: [borrowPoolsMixin, cookMixin],

  data() {
    return {
      poolId: null,
      isOpenPollPopup: false,
      isSettingsOpened: false,
      slipage: 1,
      flashRepayAmount: 0,
      flashRepayRemoveAmount: 0,
      updateInterval: null,
      emptyData: {
        img: require(`@/assets/images/empty_leverage.png`),
        text: "Leverage up your selected asset using our built in function. Remember you will not receive any MIMs.",
      },
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
      chainId: "getChainId",
    }),

    filteredPool() {
      if (this.account && this.pools[0]?.userInfo) {
        return this.pools
          .filter((pool) => pool.isSwappersActive && !!pool.reverseSwapContract)
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

    maxCollateralValue() {
      if (this.selectedPool?.userInfo && this.account) {
        return this.$ethers.utils.formatUnits(
          this.selectedPool.userInfo.userBalance,
          this.selectedPool.token.decimals
        );
      }

      return 0;
    },

    actionBtnText() {
      if (!this.isTokenApprove) return "Nothing to do";

      if (+this.flashRepayAmount && +this.flashRepayRemoveAmount)
        return "Flash repay & Remove collateral";
      if (+this.flashRepayAmount) return "Flash Repay";

      return "Nothing to do";
    },

    actionApproveTokenText() {
      if (!this.selectedPool.token.isTokenApprove) return "Approve Token";

      if (!this.selectedPool.isTokenToReverseSwapApprove)
        return "Approve Flash Repay";

      return "Approve";
    },

    infoData() {
      return [
        {
          name: "Maximum collateral ratio",
          value: this.selectedPool.ltv,
        },
        { name: "Liquidation fee", value: this.selectedPool.stabilityFee },
        { name: "Borrow fee", value: this.selectedPool.borrowFee },
        { name: "Interest", value: this.selectedPool.interest },
      ];
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
      if (this.selectedPool && this.account) {
        return Vue.filter("formatToFixed")(
          this.selectedPool.userInfo.contractBorrowPartParsed,
          4
        );
      }
      return 0;
    },

    isDisabledClosePosition() {
      if (this.selectedPool && this.account) {
        return this.selectedPool?.userInfo?.contractBorrowPartParsed > 0
          ? false
          : true;
      }
      return false;
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

        return Vue.filter("formatToFixed")(
          parsedMaxContractWithdrawAmount,
          this.selectedPool.pairToken.decimals
        );
      }

      return +maxFlashRepayRemoveAmount;
    },

    flashReapyExpectedLiquidationPrice() {
      const defaultLiquidationPrice =
        this.selectedPool?.userInfo?.liquidationPrice || 0;

      if (!+this.flashRepayAmount) return defaultLiquidationPrice;

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

      return (
        +expectedBorrowBalance /
          +expectedCollateralBalance /
          this.liquidationMultiplier || 0
      );
    },

    itsMaxRepayMim() {
      return +this.flashRepayAmount === +this.maxFlashRepayAmount;
    },

    finalCollateralAmount() {
      const slipageMutiplier = (100 + this.slipage) / 100;

      const collateralAmount = Vue.filter("formatToFixed")(
        this.borrowAmount *
          this.selectedPool.tokenOraclePrice *
          slipageMutiplier,
        this.selectedPool.token.decimals
      );

      return this.$ethers.utils.parseUnits(
        collateralAmount,
        this.selectedPool.token.decimals
      );
    },

    finalRemoveCollateralAmount() {
      const removeCollateralAmount = Vue.filter("formatToFixed")(
        this.flashRepayRemoveAmount,
        this.selectedPool.token.decimals
      );

      return this.$ethers.utils.parseUnits(
        removeCollateralAmount,
        this.selectedPool.token.decimals
      );
    },

    borrowAmount() {
      return Vue.filter("formatToFixed")(
        this.flashRepayAmount,
        this.selectedPool.pairToken.decimals
      );
    },

    collateralExpected() {
      if (this.selectedPool) {
        return (
          +this.$ethers.utils.formatEther(
            this.finalCollateralAmount.toString()
          ) +
          +this.$ethers.utils.formatEther(
            this.finalRemoveCollateralAmount.toString()
          )
        );
      }
      return 0;
    },

    selectIcon() {
      if (this.selectedPool) return this.selectedPool.icon;

      return require(`@/assets/images/select.svg`);
    },

    selectName() {
      if (this.selectedPool) return this.selectedPool.name;

      return "Token";
    },

    selectTitle() {
      if (this.selectedPool) return this.selectedPool.name;

      return "Select to";
    },

    followLink() {
      return !!(this.$route.params.id && !this.pools.length);
    },

    isTokenApprove() {
      if (this.selectedPool && this.account) {
        return (
          this.selectedPool.token.isTokenApprove &&
          this.selectedPool.isTokenToReverseSwapApprove
        );
      }
      return true;
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },

    // flashRepayAmountFormat() {
    //   const accruedMultiplyer =
    //     this.maxFlashRepayAmount / this.selectedPool.userInfo.userBorrowPart;

    //   const jlpPools = [4, 6, 7];

    //   if (
    //     jlpPools.indexOf(this.selectedPool.id) !== -1 &&
    //     this.chainId === 43114
    //   )
    //     return parseFloat(this.flashRepayAmount / accruedMultiplyer).toFixed(8);

    //   return parseFloat(this.flashRepayAmount / accruedMultiplyer).toFixed(4);
    // },
  },

  watch: {
    account() {
      this.createPools();
    },

    maxFlashRepayAmount() {
      this.flashRepayRemoveAmount = 0;
      this.flashRepayAmount = 0;
    },

    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (!pool) this.$router.push(`/deleverage`);
      }

      return false;
    },
  },

  methods: {
    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      let approve = this.selectedPool.token.isTokenApprove;
      let approveSwap = this.selectedPool.isTokenToReverseSwapApprove;

      if (!this.selectedPool.token.isTokenApprove) {
        approve = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      if (!this.selectedPool.isTokenToReverseSwapApprove) {
        approveSwap = await approveToken(
          this.selectedPool.token.contract,
          this.selectedPool.reverseSwapContract.address
        );
      }

      if (approve && approveSwap) {
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

      let duplicate = this.$route.fullPath === `/deleverage/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/deleverage/${pool.id}`);
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

    async actionHandler() {
      if (+this.flashRepayAmount) {
        if (!this.slipage) {
          return false;
        }

        let itsMax = this.itsMaxRepayMim;

        console.log("itsMax", itsMax);

        const finalBorrowAmount = this.$ethers.utils.parseUnits(
          this.borrowAmount,
          this.selectedPool.pairToken.decimals
        );

        const payload = {
          borrowAmount: finalBorrowAmount,
          collateralAmount: this.finalCollateralAmount,
          removeCollateralAmount: this.finalRemoveCollateralAmount,
          updatePrice: this.selectedPool.askUpdatePrice,
          itsMax,
        };

        const finalCollateralToShare =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.token.address,
            this.finalCollateralAmount,
            true
          );

        const finalRemoveCollateralAmountToShare =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.token.address,
            this.finalRemoveCollateralAmount,
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
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

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

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove && +isTokenToSwapApprove) {
        this.cookFlashRepay(
          data,
          isApproved,
          this.selectedPool,
          this.account,
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

    closePosition() {
      this.flashRepayAmount = this.maxFlashRepayAmount;

      this.flashRepayRemoveAmount = this.maxFlashRepayRemoveAmount;

      setTimeout(this.actionHandler(), 100);
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
    BaseTokenIcon,
    Range,
    BorrowPoolStand,
    BaseButton,
    BaseLoader,
    LocalPopupWrap,
    SettingsPopup,
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

.choose {
  padding: 30px 30px 50px;
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

.select-btn {
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  box-sizing: border-box;
  border-radius: 20px;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 10px;
}

.select-icon {
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.leverage-range {
  margin: 33px 0 60px 0;
}

.range-underline {
  margin: 30px 0;
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

  .first-input {
    padding-bottom: 45px;
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
