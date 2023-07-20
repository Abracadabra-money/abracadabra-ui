<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>Choose Chain</h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel :amount="formatTokenBalance(activeToken.balance.value)" />

          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="activeToken.balance.value"
            :error="errorCollateralValue"
            :disabled="!cauldron"
            @updateValue="updateCollateralValue"
            @openTokensList="isOpenMarketListPopup = true"
            isChooseToken
          />

          <UseCheckbox
            v-if="cauldron"
            :config="cauldron.config"
            @toggle="changeToken"
          />
        </div>

        <div class="range-wrap underline" v-if="cauldron">
          <div class="setting-button-wrap">
            <SettingsButton @click="isSettingsOpen = true" />
          </div>

          <Range
            :value="multiplier"
            :max="maxLeverageMultiplier"
            :min="minRangeValue"
            :step="rangeStep"
            :risk="liquidationRisk"
            :collateralValue="collateralValue"
            :disabled="!collateralValue"
            tooltipText="Allows users to leverage their position. Read more about this in the documents!"
            @updateValue="updateMultiplier"
          />
          <div class="multiplier-value">( {{ multiplier }}x)</div>

          <DynamicallyEstimatedPrice
            :amount="expectedBorrowAmount"
            :mimAddress="cauldron.config.mimInfo.address"
          />

          <InfoLink
            v-if="isInfoLinkVisibility"
            text="Check current Mint Fees"
            href="https://app.gmx.io/#/buy_glp"
            tooltip="Abracadabra leverage engine optmises the best route to join/leave GLP. These fees are not included in the slippgae tollerance"
          />
        </div>

        <router-link class="position-link link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>

      <div class="cauldron-stand" :style="backgroundInfo.stand">
        <h1 class="title">
          Borrow
          <MagicApeIcon v-if="cauldron" :cauldronId="cauldron.config.id" />
          MIM
        </h1>

        <div class="stand-info">
          <div class="stand-tags">
            <SpecialInfoBlock v-if="cauldron" :cauldron="cauldron" />
            <Tooltip
              v-if="cauldron"
              @click="showAdditionalInfo = !showAdditionalInfo"
            />
          </div>
          <div class="stand-data">
            <template v-if="cauldron">
              <PositionInfoBlock
                v-if="showAdditionalInfo"
                :cauldron="cauldron"
                :expectedCollateralAmount="expectedCollateralDeposit"
                :expectedBorrowAmount="+expectedBorrowAmount"
                :expectedLiquidationPrice="+expectedLiquidationPrice"
              />

              <AdditionalInfoBlock v-else :cauldron="cauldron" />
            </template>
            <EmptyState v-else />
          </div>
        </div>

        <CollateralApyBlock v-if="cauldron" :cauldron="cauldron" />

        <template v-if="cauldron">
          <div class="btn-wrap">
            <BaseButton
              primary
              :disabled="isTokenApproved"
              @click="approveTokenHandler"
              >Approve Token</BaseButton
            >
            <BaseButton @click="actionHandler" :disabled="isActionDisabled"
              >{{ actionInfo.buttonText }}
            </BaseButton>
          </div>

          <div class="main-info-wrap" v-if="cauldron">
            <ExecutionPrice
              v-if="isExecutionPriceBlock"
              :cauldron="cauldron"
              :slippage="+slippage"
              :collateralValue="+collateralValue"
              :maxBorrowValue="+maxBorrowValue"
              :multiplier="+multiplier"
            />
          </div>

          <div class="main-info-wrap">
            <MainInfoBlock :cauldron="cauldron" />
          </div>

          <LeftToBorrowBlock
            :borrowLeft="cauldron.mainParams.mimLeftToBorrow"
          />
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap
      :isOpened="isSettingsOpen"
      @closePopup="isSettingsOpen = false"
    >
      <!-- todo type slipage => slippage  -->
      <SettingsPopup :slipage="slippage" @saveSettings="changeSlippage"
    /></LocalPopupWrap>

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
import { utils, BigNumber } from "ethers";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getChainInfo } from "@/helpers/chain/getChainInfo.ts";
import notification from "@/helpers/notification/notification.js";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import { approveToken } from "@/helpers/approval";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier";
import {
  COLLATERAL_EMPTY_DATA,
  MAX_ALLOWANCE_VALUE,
} from "@/constants/cauldron.ts";

export default {
  mixins: [cookMixin],
  data() {
    return {
      slippage: 1,
      cauldron: "",
      multiplier: 1,
      rangeStep: 0.01,
      minRangeValue: 1,
      cauldronId: null,
      collateralValue: "",
      updateInterval: null,
      useOtherToken: false,
      isSettingsOpen: false,
      maxLeverageMultiplier: 5,
      showAdditionalInfo: true,
      isOpenMarketListPopup: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),

    backgroundInfo() {
      if (!this.cauldron) return false;
      const { id } = this.cauldron.config;
      if (id === 39)
        return {
          deposit: `background-image: url(${useImage(
            "assets/images/ape/bg.png"
          )})`,
          stand: `background-image: url(${useImage(
            "assets/images/ape/bg-info.png"
          )})`,
        };
      return false;
    },

    positionInfo() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { tokensRate } = this.cauldron.additionalInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { oracleRate } = this.cauldron.userPosition;

      const collateralAmount = +utils.formatUnits(
        userCollateralAmount,
        decimals
      );

      const borrowAmount = +utils.formatUnits(userBorrowAmount);

      const rates = +utils.formatUnits(tokensRate, decimals);
      const oracleExchangeRate = +utils.formatUnits(oracleRate, decimals);

      return {
        userCollateralAmount: collateralAmount,
        tokensRate: rates,
        userBorrowAmount: borrowAmount,
        oracleExchangeRate,
      };
    },

    collateralInUsd() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;
      const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);
      return this.expectedCollateralAmount / exchangeRate;
    },

    liquidationRisk() {
      const { oracleExchangeRate } = this.positionInfo;
      const { healthMultiplier } = this.cauldron.config.cauldronSettings;

      const priceDifference =
        1 / oracleExchangeRate - +this.expectedLiquidationPrice;

      const risk = parseFloat(
        priceDifference * healthMultiplier * oracleExchangeRate * 100
      ).toFixed(2);

      if (risk > 5 && risk <= 75) return "medium";
      if (risk <= 5) return "high";
      return "safe";
    },

    actionInfo() {
      const info = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.isActionDisabled) return info;

      if (+this.collateralValue && this.multiplier > 1) {
        info.methodName = "leverageUpHandler";
        info.buttonText = "Leverage Up";
      } else if (+this.collateralValue) {
        info.methodName = "addCollateralHandler";
        info.buttonText = "Add collateral";
      }

      return info;
    },

    nativeToken() {
      const { symbol, icon } = getChainInfo(this.chainId);
      const { nativeTokenBalance } = this.cauldron.userTokensInfo;

      return {
        name: symbol,
        icon,
        balance: {
          hex: nativeTokenBalance,
          value: utils.formatUnits(nativeTokenBalance),
        },
        decimals: 18,
        allowance: BigNumber.from(MAX_ALLOWANCE_VALUE),
        isNative: true,
      };
    },

    unwrappedToken() {
      const { name, icon } = this.cauldron.config.wrapInfo.unwrappedToken;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { unwrappedToken } = this.cauldron.contracts;
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
        contract: unwrappedToken,
      };
    },

    collateralToken() {
      const { icon } = this.cauldron.config;
      const { name, decimals } = this.cauldron.config.collateralInfo;
      const { collateral } = this.cauldron.contracts;
      const { collateralBalance, collateralAllowance } =
        this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        balance: {
          hex: collateralBalance,
          value: utils.formatUnits(collateralBalance, decimals),
        },
        decimals,
        allowance: collateralAllowance,
        contract: collateral,
      };
    },

    activeToken() {
      if (!this.cauldron) return COLLATERAL_EMPTY_DATA;

      const { acceptUseDefaultBalance } = this.cauldron.config.cauldronSettings;
      const useUnwrappedByDefault =
        this.cauldron.config?.wrapInfo?.useUnwrappedByDefault;

      if (acceptUseDefaultBalance && this.useOtherToken)
        return this.nativeToken;

      if (useUnwrappedByDefault && !this.useOtherToken)
        return this.unwrappedToken;

      return this.collateralToken;
    },

    errorCollateralValue() {
      if (isNaN(this.collateralValue)) return "Please input valid value";
      if (+this.collateralValue > +this.activeToken.balance.value)
        return `The value cannot be greater than ${this.activeToken.balance.value}`;
      return "";
    },

    maxBorrowValue() {
      if (!this.cauldron) return 0;

      const { mcr } = this.cauldron.config;
      const { userBorrowAmount } = this.positionInfo;

      const maxBorrow =
        (this.collateralInUsd / 100) * (mcr - 1) - userBorrowAmount;
      return maxBorrow < 0 ? 0 : maxBorrow;
    },

    expectedCollateralDeposit() {
      if (!this.cauldron) return 0;
      const { userCollateralAmount } = this.positionInfo;
      if (+this.collateralValue)
        return userCollateralAmount + +this.expectedCollateralAmount;

      return userCollateralAmount;
    },

    expectedCollateralAmount() {
      if (!this.collateralValue || !this.cauldron) return 0;

      const { tokensRate } = this.positionInfo;
      const wrapInfo = this.cauldron.config?.wrapInfo;
      const { decimals } = this.cauldron.config.collateralInfo;

      const collateralValue =
        wrapInfo && !this.useOtherToken
          ? this.collateralValue / tokensRate
          : this.collateralValue;

      const collateralAmount = utils.parseUnits(
        parseFloat(collateralValue).toString(),
        decimals
      );

      const leverageMultiplyer = BigNumber.from(
        parseFloat(this.multiplier * 1e10).toFixed(0)
      );

      const leverageSlippage = BigNumber.from(
        parseFloat(this.slippage * 1e10).toFixed(0)
      );

      const expectedToSwapAmount = collateralAmount
        .mul(leverageMultiplyer)
        .div(1e10)
        .sub(collateralAmount);
      const slippageAmount = expectedToSwapAmount
        .div(100)
        .mul(leverageSlippage)
        .div(1e10);
      const minToSwapExpected = expectedToSwapAmount.sub(slippageAmount);

      return utils.formatUnits(
        collateralAmount.add(minToSwapExpected),
        decimals
      );
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.positionInfo;
      if (!this.collateralValue) return userBorrowAmount;

      const { decimals } = this.cauldron.config.collateralInfo;
      const { borrowFee } = this.cauldron.config;
      const { oracleExchangeRate } = this.cauldron.mainParams;

      const collateralAmount = utils.parseUnits(
        this.collateralValue.toString(),
        decimals
      );

      const leverageMultiplyer = BigNumber.from(
        parseFloat(this.multiplier * 1e10).toFixed(0)
      );

      const expectedAmount = collateralAmount
        .mul(leverageMultiplyer)
        .div(1e10)
        .sub(collateralAmount);

      const borrowPart = expectedAmount
        .mul(String(1e18))
        .div(oracleExchangeRate);

      if (+borrowFee === 0)
        return +utils.formatUnits(borrowPart) + +userBorrowAmount;

      const fee = BigNumber.from(parseFloat(borrowFee * 1e10).toFixed(0));

      const borrowFeePart = borrowPart.div(100).mul(fee).div(1e10);

      return (
        +utils.formatUnits(borrowPart.add(borrowFeePart)) + +userBorrowAmount
      );
    },

    expectedLiquidationPrice() {
      const { mcr } = this.cauldron.config;
      const { userBorrowAmount, userCollateralAmount } = this.positionInfo;

      if (!this.expectedCollateralAmount) return 0;

      if (!this.collateralValue)
        return this.cauldron.userPosition.liquidationPrice;

      const borrowPart = +this.expectedBorrowAmount + +userBorrowAmount;

      const expectedCollateralPart =
        +this.expectedCollateralAmount + +userCollateralAmount;

      const liquidationPrice =
        +borrowPart / +expectedCollateralPart / (+mcr / 100) || 0;

      return liquidationPrice.toFixed(4);
    },

    isCauldronLoading() {
      return !!(this.$route.params.id && !this.cauldron);
    },

    isTokenApproved() {
      if (!this.account) return true;

      const allowance = +utils.formatUnits(
        this.activeToken.allowance,
        this.activeToken.decimals
      );

      return allowance > 0;
    },

    isActionDisabled() {
      if (!this.isTokenApproved) return true;
      if (this.errorCollateralValue) return true;
      if (!this.collateralValue) return true;
      return false;
    },

    isExecutionPriceBlock() {
      return this.cauldron?.config?.cauldronSettings?.executionPrice;
    },

    isInstantLiquidation() {
      const { oracleExchangeRate } = this.positionInfo;
      return this.expectedLiquidationPrice > 1 / oracleExchangeRate;
    },

    isInfoLinkVisibility() {
      return this.chainId === 42161 && this.cauldron?.config?.id === 3;
    },

    // todo isUserLocked() {
    //   return (
    //     this.selectedPool.userInfo?.userLockedTimestamp &&
    //     Number(this.selectedPool.userInfo?.userLockedTimestamp) !== 0
    //   );
    // },
  },

  watch: {
    async cauldronId() {
      await this.createCauldronInfo();
    },

    cauldron() {
      if (this.cauldron === null) this.$router.push(`/leverage`);
    },

    collateralValue(value, oldValue) {
      if (+value && value !== oldValue) {
        const maxMultiplier = getMaxLeverageMultiplier(this.cauldron, +value);
        if (maxMultiplier < this.multiplier) this.multiplier = maxMultiplier;
        this.maxLeverageMultiplier = maxMultiplier;
      }
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    updateCollateralValue(value) {
      this.collateralValue = value;
      if (!value) this.multiplier = 1;
    },

    updateMultiplier(value) {
      this.multiplier = value;
    },

    changeToken(value) {
      this.collateralValue = "";
      this.useOtherToken = value;
    },

    changeSlippage(value) {
      if (!value) this.slippage = 1;
      else this.slippage = value;

      this.isSettingsOpen = false;
    },

    async changeActiveMarket(marketId) {
      clearInterval(this.updateInterval);
      this.cauldronId = marketId;
      this.cauldron = "";
      this.useOtherToken = false;
      this.collateralValue = "";

      const duplicate = this.$route.fullPath === `/leverage/${marketId}`;
      if (!duplicate) this.$router.push(`/leverage/${marketId}`);

      this.isOpenMarketListPopup = false;
    },

    getDefaultSlippage() {
      const { id } = this.cauldron.config;

      if (this.chainId !== 1) return (this.slippage = 1);
      if (id === 30) return (this.slippage = 0.1);
      if (id === 31 || id === 32) return (this.slippage = 0.5);
    },

    async approveTokenHandler() {
      if (this.isTokenApproved) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { address } = this.cauldron.contracts.bentoBox;
      const approve = await approveToken(this.activeToken.contract, address);

      if (approve) await this.createCauldronInfo();
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    async createCauldronInfo() {
      if (!this.cauldronId) return false;

      const userSigner = this.account ? this.signer : this.provider;
      this.cauldron = await getCauldronInfo(
        this.cauldronId,
        this.chainId,
        this.provider,
        userSigner
      );

      this.getDefaultSlippage();

      this.updateInterval = await setInterval(async () => {
        this.cauldron = await getCauldronInfo(
          this.cauldronId,
          this.chainId,
          this.provider,
          this.signer
        );
      }, 15000);
    },

    async actionHandler() {
      // todo if (!this.checkIsUserWhitelistedBorrow()) {
      //   return false;
      // }

      // todo if (!this.checkIsAcceptNewYvcrvSTETHBorrow()) {
      //   return false;
      // }

      this[this.actionInfo.methodName]();
    },

    async addCollateralHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const collateralAmount = utils.parseUnits(
        this.collateralValue.toString(),
        this.activeToken.decimals
      );

      const payload = {
        amount: collateralAmount,
        updatePrice: true, // todo  updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      const isTokenToCookApprove = await this.checkAllowance(collateralAmount);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateral(
          payload,
          isMasterContractApproved,
          this.cauldron,
          notificationId,
          !!this.cauldron.config?.wrapInfo,
          !this.useOtherToken
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    async leverageUpHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;

      const notificationId = await this.createNotification(
        notification.pending
      );

      if (this.isInstantLiquidation) {
        await this.deleteNotification(notificationId);
        return await this.createNotification(notification.liquidation);
      }

      // todo if (
      //   !this.checkIsPoolAllowBorrow(this.multiplyMimExpected, notificationId)
      // ) {
      //   return false;
      // }

      const collateralAmount = utils.parseUnits(
        this.collateralValue.toString(),
        this.activeToken.decimals
      );

      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { bentoBox } = this.cauldron.contracts;

      const leverageMultiplyer = BigNumber.from(
        parseFloat(this.multiplier * 1e10).toFixed(0)
      );

      const leverageSlippage = this.$ethers.BigNumber.from(
        parseFloat(this.slippage * 1e10).toFixed(0)
      );

      const expectedAmount = collateralAmount
        .mul(leverageMultiplyer)
        .div(1e10)
        .sub(collateralAmount);

      const slippageAmount = expectedAmount
        .div(100)
        .mul(leverageSlippage)
        .div(1e10);

      const minExpected = expectedAmount.sub(slippageAmount);

      const shareToMin = await bentoBox.toShare(
        this.activeToken.contract.address,
        minExpected,
        true
      );

      const borrowPart = expectedAmount
        .mul(String(1e18))
        .div(oracleExchangeRate);

      const payload = {
        collateralAmount: collateralAmount.toString(),
        amount: borrowPart.toString(),
        minExpected: shareToMin.toString(),
        updatePrice: true, // todo  updatePrice: this.selectedPool.askUpdatePrice,
        // todo !!this.activeToken.isNative isNative ?.
        itsDefaultBalance: !!this.activeToken?.isNative,
        // todo slipage=> slippage
        slipage: this.slippage,
      };

      const isTokenToCookApprove = await this.checkAllowance(collateralAmount);

      if (isTokenToCookApprove) {
        this.cookLeverage(
          payload,
          isMasterContractApproved,
          this.cauldron,
          notificationId,
          !this.useOtherToken
        );

        return await this.createCauldronInfo();
      }

      await this.deleteNotification(notificationId);
      return await this.createNotification(notification.approveError);
    },

    async checkAllowance(amount) {
      const { isNative, contract } = this.activeToken;
      const { bentoBox } = this.cauldron.contracts;
      if (!isNative) {
        const allowance = await contract.allowance(
          this.account,
          bentoBox.address
        );

        if (allowance.lt(amount)) {
          return await approveToken(contract, bentoBox.address);
        }
      }

      return true;
    },

    // todo
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
    // todo
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
    // todo
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
  },

  async created() {
    this.cauldronId = this.$route.params.id;
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList: defineAsyncComponent(() =>
      import("@/components/ui/NetworksList.vue")
    ),
    InputLabel: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputLabel.vue")
    ),
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    UseCheckbox: defineAsyncComponent(() =>
      import("@/components/ui/checkboxes/UseCheckbox.vue")
    ),
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    SettingsButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/SettingsButton.vue")
    ),
    Range: defineAsyncComponent(() => import("@/components/ui/Range.vue")),
    DynamicallyEstimatedPrice: defineAsyncComponent(() =>
      import("@/components/borrow/DynamicallyEstimatedPrice.vue")
    ),
    InfoLink: defineAsyncComponent(() =>
      import("@/components/ui/links/InfoLink.vue")
    ),
    MagicApeIcon: defineAsyncComponent(() =>
      import("@/components/icons/MagicApe.vue")
    ),
    SpecialInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/SpecialInfoBlock.vue")
    ),
    PositionInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/PositionInfoBlock.vue")
    ),
    AdditionalInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/AdditionalInfoBlock.vue")
    ),
    EmptyState: defineAsyncComponent(() =>
      import("@/components/borrow/EmptyState.vue")
    ),
    CollateralApyBlock: defineAsyncComponent(() =>
      import("@/components/borrow/CollateralApyBlock.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    ExecutionPrice: defineAsyncComponent(() =>
      import("@/components/borrow/ExecutionPrice.vue")
    ),
    MainInfoBlock: defineAsyncComponent(() =>
      import("@/components/borrow/MainInfoBlock.vue")
    ),
    LeftToBorrowBlock: defineAsyncComponent(() =>
      import("@/components/borrow/LeftToBorrowBlock.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    LocalPopupWrap: defineAsyncComponent(() =>
      import("@/components/popups/LocalPopupWrap.vue")
    ),
    SettingsPopup: defineAsyncComponent(() =>
      import("@/components/leverage/SettingsPopup.vue")
    ),
    MarketsListPopup: defineAsyncComponent(() =>
      import("@/components/popups/MarketsListPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.cauldron-view {
  display: grid;
  grid-gap: 20px;
  margin: 0 auto;
  max-width: calc(100% - 20px);
  padding: 100px 0;
  grid-template-columns: 550px 1fr;
  width: 1320px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.cauldron-deposit {
  padding: 30px 30px 50px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  background-position: center;
  background-size: cover;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collateral-assets {
  padding-top: 27px;
  padding-bottom: 24px;
}

.range-wrap {
  margin-bottom: 30px;
}

.setting-button-wrap {
  display: flex;
  justify-content: flex-end;
}

.multiplier-value {
  margin: 10px 0;
  text-align: right;
}

.position-link {
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

.cauldron-stand {
  min-height: 520px;
  padding: 30px 20px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
}

.stand-info {
  background-color: #23212d4d;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
}

.stand-tags {
  display: flex;
  justify-content: space-between;
  padding: 9px 30px 7px;
  min-height: 40px;
  gap: 15px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.main-info-wrap {
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .cauldron-view {
    grid-template-columns: 1fr;
    width: 95%;
  }

  .cauldron-deposit {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .collateral-assets {
    padding: 20px 0 15px;
  }

  .position-link {
    bottom: 15px;
  }

  .title {
    margin-bottom: 20px;
  }

  .cauldron-stand {
    padding: 20px 10px;
    min-height: auto;
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
  }
}
</style>
