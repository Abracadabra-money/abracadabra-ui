<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div class="choose" :class="{ 'ape-bg': isMagicApe }" :style="bgApe">
        <h4>Choose Chain</h4>
        <div class="underline">
          <NetworksList />
        </div>
        <div class="first-input underline">
          <div class="header-balance">
            <h4>Collateral assets</h4>
            <p v-if="selectedPool">
              {{ formatTokenBalance(maxCollateralValue) }}
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

          <div class="repay-token">
            {{ formatTokenBalance(repayBorrow) }}
            {{ selectedPool.borrowToken.name }}
          </div>

          <div class="info-item" v-if="isGlp">
            <span>
              <img
                src="@/assets/images/info.svg"
                alt="info"
                v-tooltip="
                  'Abracadabra leverage engine optmises the best route to join/leave GLP. These fees are not included in the slippgae tollerance'
                "
              />
              <a target="_blank" href="https://app.gmx.io/#/buy_glp#redeem"
                >Check current Burn Fees</a
              ></span
            >
          </div>

          <MimEstimatePrice
            v-if="selectedPool"
            :itsClose="true"
            :mim="selectedPool.borrowToken.address"
            :amount="flashRepayAmount"
          />

          <div :class="{ glp: isGlp }" class="range-underline underline"></div>

          <Range
            title="Choose the amount of collateral you want to remove"
            v-model="flashRepayRemoveAmount"
            :max="maxFlashRepayRemoveAmount"
            :step="+collateralStepRange"
            :parallelRange="flashRepayAmount"
          />
          <div class="repay-token">
            {{ formatTokenBalance(repayToken) }}
            {{ selectedPool.collateralToken.name }}
          </div>
        </div>
        <BaseButton
          v-if="selectedPool"
          @click="closePosition"
          primary
          :disabled="isDisabledClosePosition"
          >Close Position</BaseButton
        >
        <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>
      <div
        class="info-block"
        :class="{ 'ape-bg': isMagicApe }"
        :style="bgApeInfo"
      >
        <h1 class="title">
          Deleverage
          <img
            class="title-ape"
            src="@/assets/images/ape/ape.png"
            v-if="isMagicApe"
            alt=""
          />
        </h1>
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

        <CollateralApyBlock
          v-if="selectedPool"
          :pool="selectedPool"
          :isApe="isMagicApe"
        />

        <template v-if="selectedPool">
          <div class="btn-wrap">
            <BaseButton
              @click="approveTokenHandler"
              primary
              :disabled="isTokenApprove"
              >{{ actionApproveTokenText }}</BaseButton
            >

            <BaseButton
              @click="alternativeActionHandler"
              :disabled="actionBtnText === 'Nothing to do'"
              >{{ actionBtnText }}</BaseButton
            >
          </div>
          <InfoBlock :pool="selectedPool" />
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap :isOpened="isSettingsOpened" @closePopup="isSettingsOpened = false">
      <SettingsPopup :slipage="slipage" @saveSettings="changeSlippage"
    /></LocalPopupWrap>
    <LocalPopupWrap :isOpened="isOpenPollPopup" @closePopup="isOpenPollPopup = false">
      <MarketsListPopup
        @select="chosePool($event)"
        @close="isOpenPollPopup = false"
        :pools="filteredPool"
        popupType="cauldron"
    /></LocalPopupWrap>
  </div>
</template>

<script>
import NetworksList from "@/components/ui/NetworksList.vue";
import Range from "@/components/ui/Range.vue";
import BorrowPoolStand from "@/components/borrow/BorrowPoolStand.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import InfoBlock from "@/components/borrow/InfoBlock.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import SettingsPopup from "@/components/leverage/SettingsPopup.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import CollateralApyBlock from "@/components/borrow/CollateralApyBlock.vue";
import MimEstimatePrice from "@/components/ui/MimEstimatePrice.vue";

import filters from "@/filters/index.js";

import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters } from "vuex";
import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";
import bg from "@/assets/images/ape/bg.png";
import bgInfo from "@/assets/images/ape/bg-info.png";

export default {
  mixins: [cauldronsMixin, cookMixin],

  data() {
    return {
      poolId: null,
      isOpenPollPopup: false,
      isSettingsOpened: false,
      slipage: 1,
      flashRepayAmount: 0,
      flashRepayRemoveAmount: 0,
      updateInterval: null,
      borrowStepRange: "0.0001",
      emptyData: {
        img: this.$image(`assets/images/empty_leverage.png`),
        text: "Deleverage your position using our built-in Flash repay function.",
        bottom: "Read more about it",
        link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
      },
      bg,
      bgInfo,
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
      chainId: "getChainId",
    }),

    isGlp() {
      return this.chainId === 42161 && this.selectedPool?.id === 3;
    },

    filteredPool() {
      if (this.account && this.pools[0]?.userInfo) {
        return this.pools
          .filter((pool) => pool.isSwappersActive && !!pool.liqSwapperContract)
          .sort((a, b) =>
            a.userInfo.balanceUsd < b.userInfo.balanceUsd ? 1 : -1
          );
      }

      return this.pools.filter((pool) => !pool.cauldronSettings.isDepreciated);
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
          this.selectedPool.collateralToken.decimals
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
      if (!this.selectedPool.userInfo?.isApproveTokenCollateral)
        return "Approve Token";

      return "Approve";
    },

    liquidationMultiplier() {
      return this.selectedPool ? this.selectedPool.ltv / 100 : 0;
    },

    collateralStepRange() {
      const jlpPools = [4, 6, 7];

      if (
        jlpPools.indexOf(this.selectedPool.id) !== -1 &&
        this.chainId === 43114
      )
        return "0.00000001";

      if (this.chainId === 10 && this.selectedPool.id === 1)
        return "0.000000000000000001";

      if (this.selectedPool.collateralToken.decimals === 18) return "0.00001";

      return "0.0001";
    },

    maxFlashRepayAmount() {
      if (this.selectedPool && this.account) {
        return filters.formatToFixed(
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

      const slipageMutiplier = (100 + +this.slipage) / 100;

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
        expectedBorrowBalance / this.selectedPool.borrowToken.price;

      const collateralInDolarts =
        expectedCollateralBalance / this.selectedPool.tokenOraclePrice;

      const userHasDolars = collateralInDolarts - borrowedInDolarts;
      const acceptedPercent = userHasDolars / collateralInDolarts;

      const maxFlashRepayRemoveAmount =
        expectedCollateralBalance * acceptedPercent * 0.995 * persent;

      if (
        this.selectedPool.maxWithdrawAmount !== -1 &&
        +this.selectedPool.maxWithdrawAmount < +maxFlashRepayRemoveAmount
      ) {
        const parsedMaxContractWithdrawAmount = parseFloat(
          this.selectedPool.maxWithdrawAmount
        ).toFixed(20);

        return filters.formatToFixed(
          parsedMaxContractWithdrawAmount,
          this.selectedPool.borrowToken.decimals
        );
      }

      return +maxFlashRepayRemoveAmount;
    },

    flashReapyExpectedLiquidationPrice() {
      const defaultLiquidationPrice =
        this.selectedPool?.userInfo?.liquidationPrice || 0;

      if (!+this.flashRepayAmount) return defaultLiquidationPrice;

      const slipageMutiplier = (100 + +this.slipage) / 100;

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
      const slipageMutiplier = (100 + +this.slipage) / 100;

      const collateralAmount = filters.formatToFixed(
        this.borrowAmount *
          this.selectedPool.tokenOraclePrice *
          slipageMutiplier,
        this.selectedPool.collateralToken.decimals
      );

      return this.$ethers.utils.parseUnits(
        collateralAmount,
        this.selectedPool.collateralToken.decimals
      );
    },

    finalRemoveCollateralAmount() {
      const exponential = this.isExponential(this.flashRepayRemoveAmount);

      const flashRepayRemoveAmount = exponential
        ? this.noExponents(this.flashRepayRemoveAmount)
        : this.flashRepayRemoveAmount;

      const removeCollateralAmount = filters.formatToFixed(
        flashRepayRemoveAmount,
        this.selectedPool.collateralToken.decimals
      );

      return this.$ethers.utils.parseUnits(
        removeCollateralAmount,
        this.selectedPool.collateralToken.decimals
      );
    },

    borrowAmount() {
      return filters.formatToFixed(
        this.flashRepayAmount,
        this.selectedPool.borrowToken.decimals
      );
    },

    collateralExpected() {
      if (this.selectedPool) {
        return (
          +this.$ethers.utils.formatUnits(
            this.finalCollateralAmount,
            this.selectedPool.collateralToken.decimals
          ) +
          +this.$ethers.utils.formatUnits(
            this.finalRemoveCollateralAmount,
            this.selectedPool.collateralToken.decimals
          )
        );
      }
      return 0;
    },

    selectIcon() {
      if (this.selectedPool) return this.selectedPool.icon;

      return this.$image(`assets/images/select.svg`);
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
      if (this.selectedPool && this.selectedPool.userInfo && this.account) {
        return this.selectedPool.userInfo.isApproveTokenCollateral;
      }

      return true;
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },

    repayBorrow() {
      if (this.itsMaxRepayMim) {
        return +this.selectedPool.userInfo.userBorrowPart;
      }

      return this.flashRepayAmount;
    },

    repayToken() {
      if (+this.repayBorrow === 0) {
        this.clearRepayToken();
        return 0;
      }

      if (this.flashRepayRemoveAmount > this.maxFlashRepayRemoveAmount)
        return this.maxFlashRepayRemoveAmount;

      const exponential = this.isExponential(this.flashRepayRemoveAmount);

      return exponential
        ? this.noExponents(this.flashRepayRemoveAmount)
        : this.flashRepayRemoveAmount;
    },

    isLpLogic() {
      return !!this.selectedPool?.lpLogic;
    },

    isMagicApe() {
      return this.selectedPool?.id === 39;
    },

    bgApe() {
      return this.isMagicApe ? `background-image: url(${this.bg})` : "";
    },

    bgApeInfo() {
      return this.isMagicApe ? `background-image: url(${this.bgInfo})` : "";
    },
  },

  watch: {
    account() {
      this.createPools();
    },

    maxFlashRepayAmount() {
      this.resetRange();
    },

    flashRepayAmount() {
      if (+this.flashRepayAmount === 0) {
        this.resetRange();
      }
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
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      let approve = this.selectedPool.userInfo?.isApproveTokenCollateral;

      if (!this.selectedPool.userInfo?.isApproveTokenCollateral) {
        approve = await approveToken(
          this.selectedPool.collateralToken.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

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

        const finalBorrowAmount = this.$ethers.utils.parseUnits(
          this.borrowAmount,
          this.selectedPool.borrowToken.decimals
        );

        const payload = {
          borrowAmount: finalBorrowAmount,
          collateralAmount: this.finalCollateralAmount,
          removeCollateralAmount: this.finalRemoveCollateralAmount,
          updatePrice: this.selectedPool.askUpdatePrice,
          itsMax,
          slipage: this.slipage,
        };

        const finalCollateralToShare =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.collateralToken.address,
            this.finalCollateralAmount,
            true
          );

        const finalRemoveCollateralAmountToShare =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.collateralToken.address,
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
    async alternativeActionHandler() {
      if (+this.flashRepayAmount) {
        if (!this.slipage) {
          return false;
        }

        let itsMax = this.itsMaxRepayMim;

        const repayAmount = this.$ethers.utils.parseUnits(this.borrowAmount);

        let amountFrom = filters.formatToFixed(
          this.borrowAmount * this.selectedPool.tokenOraclePrice,
          this.selectedPool.collateralToken.decimals
        );

        amountFrom = this.$ethers.utils.parseUnits(
          amountFrom,
          this.selectedPool.collateralToken.decimals
        );

        const slipage = this.$ethers.BigNumber.from(
          parseFloat(this.slipage * 1e10).toFixed(0)
        );
        const testSlippageValue = amountFrom.div(100).mul(slipage).div(1e10);

        const shareFrom =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.collateralToken.address,
            amountFrom.add(testSlippageValue),
            false
          );

        const payload = {
          borrowAmount: itsMax
            ? this.selectedPool.userInfo.contractBorrowPart
            : repayAmount,
          collateralAmount: shareFrom,
          removeCollateralAmount: this.finalRemoveCollateralAmount,
          updatePrice: this.selectedPool.askUpdatePrice,
          itsMax,
          slipage: this.slipage,
        };

        const finalRemoveCollateralAmountToShare =
          await this.selectedPool.masterContractInstance.toShare(
            this.selectedPool.collateralToken.address,
            this.finalRemoveCollateralAmount,
            true
          );

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

      let isTokenToCookApprove = await isTokenApprowed(
        this.selectedPool.collateralToken.contract,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.eq(0)) {
        isTokenToCookApprove = await approveToken(
          this.selectedPool.collateralToken.contract,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        if (this.isLpLogic) {
          this.cookDeleverage(
            data,
            isApproved,
            this.selectedPool,
            this.account,
            notificationId
          );

          return false;
        } else {
          this.cookDeleverage(
            data,
            isApproved,
            this.selectedPool,
            this.account,
            notificationId
          );

          return false;
        }
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

      setTimeout(this.alternativeActionHandler(), 100);
    },

    clearRepayToken() {
      this.flashRepayRemoveAmount = 0;
    },

    resetRange() {
      this.flashRepayRemoveAmount = 0;
      this.flashRepayAmount = 0;
    },

    isExponential(value) {
      return String(value).includes("e") || String(value).includes("E");
    },

    noExponents(value) {
      let data = String(value).split(/[eE]/);
      if (data.length == 1) return data[0];

      let result = "",
        sign = value < 0 ? "-" : "",
        str = data[0].replace(".", ""),
        mag = Number(data[1]) + 1;

      if (mag < 0) {
        result = sign + "0.";
        while (mag++) result += "0";
        /*eslint-disable */
        return result + str.replace(/^\-/, "");
      }
      mag -= str.length;
      while (mag--) result += "0";
      return str + result;
    },
  },

  created() {
    this.poolId = this.$route.params.id;

    this.updateInterval = setInterval(async () => {
      this.createPools();
    }, 15000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    BaseTokenIcon,
    Range,
    BorrowPoolStand,
    BaseButton,
    BaseLoader,
    InfoBlock,
    LocalPopupWrap,
    SettingsPopup,
    MarketsListPopup,
    CollateralApyBlock,
    MimEstimatePrice,
  },
};
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 12px 0;

  a {
    color: #fff;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    display: flex;
    align-items: center;
  }

  img {
    margin-right: 5px;
    cursor: pointer;
  }
}
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

.ape-bg {
  background-position: center;
  background-size: cover;
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

  &.glp {
    margin-top: 0;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-ape {
  max-width: 27px;
  margin: 0 10px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.choose-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.repay-token {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
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
