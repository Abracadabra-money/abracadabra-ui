<template>
  <div class="borrow" :class="{ 'borrow-loading': isLoadedCauldron }">
    <template v-if="!isLoadedCauldron">
      <!-- :class="{ 'ape-bg': isMagicApe }" -->
      <!-- :style="bgApe" -->
      <div class="cauldron-deposit">
        <h4>Choose Chain</h4>

        <div class="underline">
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel :amount="formatTokenBalance(activeToken.balance.value)" />

          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="activeToken.balance.value"
            :error="errorCallateralValue"
            :disabled="!cauldron"
            @updateValue="updateCollateralValue"
            @openTokensList="isOpenMarketListPopup = true"
            isChooseToken
          />

          <UseCheckbox :config="cauldron.config" @toggle="changeToken" />
        </div>

        <div class="borrow-assets underline">
          <div class="header-balance">
            <h4>MIM to Borrow</h4>
          </div>

          <BaseTokenInput
            :name="cauldron.config.mimInfo.name"
            :icon="cauldron.config.mimInfo.icon"
            :value="borrowValue"
            :max="maxBorrowValue"
            :error="errorBorrowValue"
            :disabled="!cauldron"
            @updateValue="updateBorrowValue"
          />
        </div>

        <div class="info-row underline">
          <span class="info-item">
            <Tooltip :tooltip="ltvTooltip" />
            <span> LTV</span>
          </span>
          <span class="info-item">{{ calculateLtv }}%</span>
        </div>

        <div class="percent-wrap">
          <PercentageButtons
            :maxValue="cauldron.config.mcr"
            :collateralValue="collateralValue"
            :liquidationPrice="expectedLiquidationPrice"
            @onchange="updatePercentValue"
          />

          <BalanceBlock :pool="cauldron" />

          <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
            >Go to Positions</router-link
          >
        </div>
      </div>

      <!-- :class="{ 'ape-bg': isMagicApe }" -->
      <!-- :style="bgApeInfo" -->
      <div class="cauldron-stand">
        <h1 class="title">
          Borrow
          <!-- <img
            class="ape-icon"
            src="@/assets/images/ape/ape.png"
            v-if="isMagicApe"
            alt="Ape icon"
          /> -->
          MIM
        </h1>

        <div class="stand-info">
          <div class="stand-tags">
            <div
              class="info-btn"
              v-if="!!cauldron"
              @click="showAdditionalInfo = !showAdditionalInfo"
            >
              <img
                class="info-icon"
                src="@/assets/images/info.svg"
                alt="info"
              />
            </div>
          </div>
          <div class="stand-data">
            <template v-if="cauldron">
              <PositionInfoBlock
                v-if="showAdditionalInfo"
                :cauldron="cauldron"
                :expectedCollateralAmount="expectedCollateralAmount"
                :expectedBorrowedAmount="expectedBorrowedAmount"
                :expectedLiquidationPrice="expectedLiquidationPrice"
              />

              <AdditionalInfoBlock v-else :cauldron="cauldron" />
            </template>
            <EmptyState v-else />
          </div>
        </div>

        <CollateralApyBlockNew v-if="cauldron" :cauldron="cauldron" />

        <template v-if="cauldron">
          <div class="btn-wrap">
            <BaseButton
              primary
              :disabled="isTokenApprove"
              @click="approveTokenHandler"
              >Approve</BaseButton
            >
            <BaseButton
              @click="actionHandler"
              :disabled="actionBtnText === 'Nothing to do'"
              >{{ actionBtnText }}</BaseButton
            >
          </div>
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap
      :isOpened="isOpenMarketListPopup"
      @closePopup="isOpenMarketListPopup = false"
    >
      <MarketsListPopup
        popupType="borrow"
        @changeActiveMarket="changeActiveMarket($event)"
    /></LocalPopupWrap>
  </div>
</template>

<script>
import cookMixin from "@/mixins/borrow/cooksV2.js";
import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";
import bg from "@/assets/images/ape/bg.png";
import bgInfo from "@/assets/images/ape/bg-info.png";
// -----
import NetworksList from "@/components/ui/NetworksList.vue";
import InputLabel from "@/components/ui/inputs/InputLabel.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import UseCheckbox from "@/components/ui/checkboxes/UseCheckbox.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import PercentageButtons from "@/components/borrow/PercentageButtons.vue";
import BalanceBlock from "@/components/borrow/BalanceBlockNew.vue";
import PositionInfoBlock from "@/components/borrow/PositionInfoBlock.vue";
import AdditionalInfoBlock from "@/components/borrow/AdditionalInfoBlock.vue";
import EmptyState from "@/components/borrow/EmptyState.vue";
import CollateralApyBlockNew from "@/components/borrow/CollateralApyBlockNew.vue";
import BaseButton from "@/components/base/BaseButton.vue";
// -----
import BaseLoader from "@/components/base/BaseLoader.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import MarketsListPopup from "@/components/popups/MarketsListPopup.vue";
// -----
import { utils } from "ethers";
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";

const MAX_ALLOWANCE_VALUE =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export default {
  mixins: [cookMixin],
  data() {
    return {
      cauldron: null,
      useOtherToken: false,
      collateralValue: "",
      isOpenMarketListPopup: false,
      borrowValue: "",
      showAdditionalInfo: true,
      // -----
      poolId: null,
      // useDefaultBalance: false,
      updateInterval: null,
      emptyData: {
        img: this.$image(`assets/images/empty_borrow.png`),
        text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Borrow",
        bottom: "If you want to learn more read our docs",
        link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
      },
      ltvTooltip:
        "Loan to Value: percentage of debt compared to the collateral. The higher it is, the riskier the position",
      glpPoolsId: [2, 3],
      // useCheckBox: false,
      bg,
      bgInfo,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),

    isLoadedCauldron() {
      return !!(this.$route.params.id && !this.cauldron);
    },

    // todo refactoring collateralToken unwrappedToken
    nativeToken() {
      const { symbol, icon } = getChainInfo(this.chainId);
      return {
        name: symbol,
        icon,
        balance: {
          hex: this.cauldron.userTokensInfo.nativeTokenBalance,
          value: utils.formatUnits(
            this.cauldron.userTokensInfo.nativeTokenBalance
          ),
        },
        decimals: 18,
        allowance: this.$ethers.BigNumber.from(MAX_ALLOWANCE_VALUE),
      };
    },

    collateralToken() {
      return {
        name: this.cauldron.config.name,
        icon: this.cauldron.config.icon,
        balance: {
          hex: this.cauldron.userTokensInfo.collateralBalance,
          value: utils.formatUnits(
            this.cauldron.userTokensInfo.collateralBalance,
            this.cauldron.config.collateralInfo.decimals
          ),
        },
        decimals: this.cauldron.config.collateralInfo.decimals,
        allowance: this.cauldron.userTokensInfo.collateralAllowance,
        contract: this.cauldron.contracts.collateral,
      };
    },

    unwrappedToken() {
      const { name, icon } = this.cauldron.config.wrapInfo.unwrappedToken;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { unwrappedTokenBalance, unwrappedTokenAllowance } =
        this.cauldron.userTokensInfo;
      const value = utils.formatUnits(unwrappedTokenBalance, decimals);

      return {
        name,
        icon,
        balance: {
          hex: unwrappedTokenBalance,
          value,
        },
        decimals,
        allowance: unwrappedTokenAllowance,
        contract: this.cauldron.contracts.unwrappedToken,
      };
    },

    activeToken() {
      const { acceptUseDefaultBalance } = this.cauldron.config.cauldronSettings;
      if (acceptUseDefaultBalance && this.useOtherToken)
        return this.nativeToken;

      if (this.useOtherToken) return this.unwrappedToken;

      return this.collateralToken;
    },

    errorCallateralValue() {
      if (isNaN(this.collateralValue)) return "Please input valid value";
      if (+this.collateralValue > +this.activeToken.balance.value)
        return `The value cannot be greater than ${this.activeToken.balance.value}`;
      return "";
    },

    collateralInUsd() {
      const oracleExchangeRate = +utils.formatUnits(
        this.cauldron.mainParams.oracleExchangeRate,
        this.cauldron.config.collateralInfo.decimals
      );

      return this.expectedCollateralAmount / oracleExchangeRate;
    },

    maxBorrowValue() {
      const userBorrowAmount = +utils.formatUnits(
        this.cauldron.userPosition.borrowInfo.userBorrowAmount
      );

      const maxBorrow =
        (this.collateralInUsd / 100) * (this.cauldron.config.mcr - 1) -
        userBorrowAmount;

      return maxBorrow < 0 ? 0 : maxBorrow;
    },

    calculateLtv() {
      const maxBorrow =
        (this.collateralInUsd / 100) * (this.cauldron.config.mcr - 1);

      const percent =
        (+this.maxBorrowValue / +maxBorrow - +this.borrowValue) * 100;

      const ltv = this.cauldron.config.mcr - percent;

      if (ltv > this.cauldron.config.mcr) return this.cauldron.config.mcr;
      if (ltv < 0) return 0;
      return parseFloat(ltv).toFixed(0);
    },

    errorBorrowValue() {
      if (isNaN(this.borrowValue)) return "Please input valid value";
      if (+this.borrowValue > +this.maxBorrowValue)
        return `The value cannot be greater than ${this.maxBorrowValue}`;

      return "";
    },

    // todo expected Collateral Value: tokens rate
    expectedCollateralAmount() {
      const userCollateralAmount = +utils.formatUnits(
        this.cauldron.userPosition.collateralInfo.userCollateralAmount,
        this.cauldron.config.collateralInfo.decimals
      );

      return userCollateralAmount + +this.collateralValue;
    },

    // todo  expected Borrow fee:
    expectedBorrowedAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      return +this.borrowValue + +utils.formatUnits(userBorrowAmount);
    },

    expectedLiquidationPrice() {
      return (
        +this.expectedBorrowedAmount /
        +this.expectedCollateralAmount /
        (+this.cauldron.config.mcr / 100)
      );
    },

    isTokenApprove() {
      if (!this.account) return true;

      if (this.useOtherToken) {
        const { symbol } = getChainInfo(this.chainId);
        if (this.activeToken.name === symbol) return true;

        const allowance = +utils.formatUnits(
          this.cauldron.userTokensInfo.unwrappedTokenAllowance,
          this.cauldron.config.collateralInfo.decimals
        );
        return allowance > 0;
      }

      const allowance = +utils.formatUnits(
        this.cauldron.userTokensInfo.collateralAllowance
      );

      return allowance > 0;
    },

    // selectedPool() {
    //   if (this.poolId) {
    //     return this.cauldron;
    //     // let pool = this.$store.getters.getPoolById(+this.poolId);
    //     // if (pool) return pool;
    //     // return null;
    //   }
    //   return null;
    // },

    // isLpLogic() {
    //   return !!this.selectedPool.lpLogic;
    // },

    // actionBtnText() {
    //   if (!this.isTokenApprove) return "Nothing to do";

    //   if (this.isUserLocked && +this.collateralValue > 0)
    //     return "Nothing to do";

    //   if (this.errorCallateralValue || this.errorBorrowValue) return "Nothing to do";

    //   if (
    //     +this.borrowValue > 0 &&
    //     +this.collateralValue > 0 &&
    //     !this.errorCallateralValue &&
    //     !this.errorBorrowValue
    //   )
    //     return "Add collateral and borrow";

    //   if (
    //     +this.collateralValue > 0 &&
    //     !this.errorCallateralValue &&
    //     !this.errorBorrowValue
    //   )
    //     return "Add collateral";

    //   if (+this.borrowValue > 0 && !this.errorCallateralValue && !this.errorBorrowValue)
    //     return "Borrow";

    //   return "Nothing to do";
    // },

    // isUserLocked() {
    //   return (
    //     this.selectedPool.userInfo?.userLockedTimestamp &&
    //     Number(this.selectedPool.userInfo?.userLockedTimestamp) !== 0
    //   );
    // },

    // mimExpected() {
    //   if (!this.errorBorrowValue) return this.borrowValue;

    //   return 0;
    // },

    // ltv() {
    //   if (this.selectedPool) {
    //     return this.selectedPool.ltv;
    //   }
    //   return 0;
    // },

    // selectedPoolId() {
    //   if (this.selectedPool) return this.selectedPool.id;

    //   return null;
    // },

    // tokenToMim() {
    //   if (this.selectedPool) {
    //     const tokenToMim = 1 / this.selectedPool.borrowToken.exchangeRate;

    //     let decimals = 4;

    //     if (this.selectedPool.name === "SHIB") decimals = 6;

    //     return filters.formatToFixed(tokenToMim, decimals);
    //   }
    //   return "0.0";
    // },

    // isMagicApe() {
    //   return this.selectedPool?.id === 39;
    // },

    // bgApe() {
    //   return this.isMagicApe ? `background-image: url(${this.bg})` : "";
    // },

    // bgApeInfo() {
    //   return this.isMagicApe ? `background-image: url(${this.bgInfo})` : "";
    // },
  },

  // watch: {
  // account() {
  //   this.createPools();
  // },

  // pools() {
  //   if (this.poolId) {
  //     let pool = this.$store.getters.getPoolById(+this.poolId);
  //     if (!pool) this.$router.push(`/borrow`);
  //   }

  //   return false;
  // },
  // },

  methods: {
    clearData() {
      this.collateralValue = "";
      this.borrowValue = "";
    },

    changeToken(value) {
      this.clearData();
      this.useOtherToken = value;
    },

    updateCollateralValue(value) {
      console.log("updateCollateralValue");
      this.collateralValue = value;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    updatePercentValue(value) {
      const newBorrowValue =
        (+this.maxBorrowValue * +value) / +this.cauldron.config.mcr;

      if (newBorrowValue > +this.maxBorrowValue) return false;
      this.borrowValue = newBorrowValue;
    },

    async approveTokenHandler() {
      // todo isTokenApproved   ???
      if (this.isTokenApprove) return false;

      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );

      // todo approveToken new helper
      const approve = await approveToken(
        this.activeToken.contract,
        this.cauldron.contracts.bentoBox.address
      );
      await this.$store.commit("notifications/delete", notificationId);

      // todo store.commit
      if (!approve)
        await this.$store.dispatch(
          "notifications/new",
          notification.approveError
        );

      return false;
    },

    // ------

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    async changeActiveMarket(marketId) {
      this.useDefaultBalance = false;
      this.poolId = marketId;

      this.clearData();

      const duplicate = this.$route.fullPath === `/borrow/${marketId}`;

      if (!duplicate) this.$router.push(`/borrow/${marketId}`);

      this.isOpenMarketListPopup = false;
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
        !this.errorCallateralValue &&
        !this.errorBorrowValue
      ) {
        this.collateralAndBorrowHandler();
        return false;
      }

      if (
        +this.collateralValue > 0 &&
        !this.errorCallateralValue &&
        !this.errorBorrowValue
      ) {
        this.collateralHandler();
        return false;
      }

      if (
        +this.borrowValue > 0 &&
        !this.errorCallateralValue &&
        !this.errorBorrowValue
      ) {
        this.borrowHandler();
        return false;
      }
    },

    async collateralAndBorrowHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const collateralDecimals =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpDecimals
          : this.selectedPool.collateralToken.decimals;

      const parsedCollateral = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        collateralDecimals
      );

      if (!this.checkIsPoolAllowBorrow(+this.borrowValue, notificationId)) {
        return false;
      }

      const parsedBorrow = this.$ethers.utils.parseUnits(
        filters.formatToFixed(
          this.borrowValue,
          this.selectedPool.borrowToken.decimals
        ),
        this.selectedPool.borrowToken.decimals
      );

      const payload = {
        collateralAmount: parsedCollateral,
        amount: parsedBorrow,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.useDefaultBalance,
      };

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      let isTokenToCookApprove = await isTokenApprowed(
        collateralToken,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.collateralAmount)) {
        isTokenToCookApprove = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateralAndBorrow(
          payload,
          isApproved,
          this.selectedPool,
          notificationId,
          this.isLpLogic,
          !this.useCheckBox
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

      const collateralDecimals =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpDecimals
          : this.selectedPool.collateralToken.decimals;

      const parsedCollateralValue = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        collateralDecimals
      );

      const payload = {
        amount: parsedCollateralValue,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.useDefaultBalance,
      };

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      let isTokenToCookApprove = await isTokenApprowed(
        collateralToken,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.amount)) {
        isTokenToCookApprove = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateral(
          payload,
          isApproved,
          this.selectedPool,
          notificationId,
          this.isLpLogic,
          !this.useCheckBox
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
        filters.formatToFixed(
          this.borrowValue,
          this.selectedPool.borrowToken.decimals
        ),
        this.selectedPool.borrowToken.decimals
      );

      const payload = {
        amount: parsedBorrowValue,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      let isTokenToCookApprove = await isTokenApprowed(
        collateralToken,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.eq(0)) {
        isTokenToCookApprove = await approveToken(
          collateralToken,
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
  },

  async created() {
    this.poolId = this.$route.params.id;

    this.cauldron = await getCauldronInfo(
      this.poolId,
      this.chainId,
      this.provider,
      this.signer
    );

    console.log("this.cauldron", this.cauldron);

    this.updateInterval = await setInterval(async () => {
      this.cauldron = await getCauldronInfo(
        this.poolId,
        this.chainId,
        this.provider,
        this.signer
      );
    }, 15000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    InputLabel,
    BaseTokenInput,
    UseCheckbox,
    Tooltip,
    PercentageButtons,
    BalanceBlock,
    PositionInfoBlock,
    AdditionalInfoBlock,
    EmptyState,
    CollateralApyBlockNew,
    BaseButton,
    // -----
    BaseLoader,
    LocalPopupWrap,
    MarketsListPopup,
  },
};
</script>

<style lang="scss" scoped>
.cauldron-deposit {
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

.collateral-assets {
  padding-top: 27px;
  padding-bottom: 24px;
}

.borrow-assets {
  padding-top: 27px;
  padding-bottom: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 15px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 24px;
}

@media (max-width: 1200px) {
  .cauldron-deposit {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .collateral-assets {
    padding: 20px 0 15px;
  }
}

//------
.borrow {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  max-width: calc(100% - 20px);
  width: 95%;
  padding: 100px 0;
}

.primary-api {
  margin: 16px 0;
}

.borrow-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.ape-bg {
  background-position: center;
  background-size: cover;
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

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.info-wrap {
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .borrow {
    grid-gap: 15px;
  }
}

@media (max-width: 600px) {
  .borrow {
    grid-gap: 20px;
  }

  .choose-link {
    bottom: 15px;
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

// todo cauldronStand
.cauldron-stand {
  min-height: 520px;
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}

.ape-icon {
  max-width: 27px;
  margin: 0 10px;
}

@media (max-width: 1200px) {
  .cauldron-stand {
    padding: 30px 20px;
  }
}

@media (max-width: 600px) {
  .cauldron-stand {
    padding: 20px 10px;
    min-height: auto;
  }
}
</style>
