<template>
  <div class="cauldron-view" :class="{ loading: isCauldronLoading }">
    <template v-if="!isCauldronLoading">
      <div class="cauldron-deposit" :style="backgroundInfo.deposit">
        <div class="underline">
          <h4>Choose Chain</h4>
          <NetworksList />
        </div>

        <div class="collateral-assets underline">
          <InputLabel :amount="activeToken.balance" />

          <BaseTokenInput
            :icon="activeToken.icon"
            :name="activeToken.name"
            :value="collateralValue"
            :max="activeToken.balance"
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
          <MagicApeIcon v-if="cauldron" :cauldron="cauldron" />
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
          <div>
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
              :disabled="isTokenApproved || isActionDisabled"
              @click="approveTokenHandler"
              >Approve</BaseButton
            >
            <BaseButton
              @click="actionHandler"
              :disabled="!isTokenApproved || isActionDisabled"
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
      <SettingsPopup :slippage="slippage" @saveSettings="changeSlippage"
    /></LocalPopupWrap>

    <LocalPopupWrap
      :isOpened="isOpenMarketListPopup"
      @closePopup="isOpenMarketListPopup = false"
    >
      <MarketsListPopup
        popupType="leverage"
        @changeActiveMarket="changeActiveMarket($event)"
    /></LocalPopupWrap>
  </div>
</template>

<script>
import { utils, BigNumber } from "ethers";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { mapGetters, mapActions, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification.js";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import { approveToken } from "@/helpers/approval";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier";
import {
  COLLATERAL_EMPTY_DATA,
  MAX_ALLOWANCE_VALUE,
} from "@/constants/cauldron.ts";

import cooks from "@/helpers/cauldron/cook/cooks";
const { cookLeverage, cookAddCollateral } = cooks;

export default {
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
      getChainById: "getChainById",
    }),

    isCauldronLoading() {
      return !!(this.$route.params.id && !this.cauldron);
    },

    isTokenApproved() {
      if (!this.account) return true;

      const allowance = +utils.formatUnits(
        this.activeToken.allowance,
        this.activeToken.decimals
      );

      return allowance > +this.collateralValue;
    },

    isActionDisabled() {
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

    parseCollateralAmount() {
      const { tokensRate } = this.positionInfo;
      const wrapInfo = this.cauldron.config?.wrapInfo;
      const { decimals } = this.activeToken;

      const amount = filters.formatToFixed(this.collateralValue || 0, decimals);

      const collateralAmount =
        wrapInfo && !this.useOtherToken
          ? (amount * 1e10) / tokensRate
          : amount * 1e10;

      const parseCollateralAmount = utils.parseUnits(
        collateralAmount.toString(),
        this.activeToken.decimals
      );

      return parseCollateralAmount.div(1e10);
    },

    parseCollateralValue() {
      const { decimals } = this.activeToken;

      return utils.parseUnits(
        filters.formatToFixed(this.collateralValue || 0, decimals),
        decimals
      );
    },

    parseMultiplyer() {
      return BigNumber.from(parseFloat(this.multiplier * 1e10).toFixed(0));
    },

    parseSlippage() {
      return BigNumber.from(parseFloat(this.slippage * 1e10).toFixed(0));
    },

    expectedCollateralDeposit() {
      if (!this.cauldron) return 0;

      const { userCollateralAmount } = this.positionInfo;
      if (!+this.collateralValue) return userCollateralAmount;
      return userCollateralAmount + +this.expectedCollateralAmount;
    },

    expectedCollateralAmount() {
      if (!this.collateralValue || !this.cauldron) return 0;

      return utils.formatUnits(
        this.parseCollateralAmount.add(this.expectedMinToSwap),
        this.activeToken.decimals
      );
    },

    expectedToSwapAmount() {
      return this.parseCollateralAmount
        .mul(this.parseMultiplyer)
        .div(1e10)
        .sub(this.parseCollateralAmount);
    },

    expectedMinToSwap() {
      const slippageAmount = this.expectedToSwapAmount
        .div(100)
        .mul(this.parseSlippage)
        .div(1e10);

      return this.expectedToSwapAmount.sub(slippageAmount);
    },

    expectedBorrowPart() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      return this.expectedToSwapAmount
        .mul(String(1e18))
        .div(oracleExchangeRate);
    },

    expectedBorrowAmount() {
      const { borrowFee } = this.cauldron.config;
      const { userBorrowAmount } = this.positionInfo;

      if (!this.collateralValue) return userBorrowAmount;

      const borrowPart = +utils.formatUnits(this.expectedBorrowPart);
      if (+borrowFee === 0) return borrowPart + +userBorrowAmount;

      const fee = BigNumber.from(parseFloat(borrowFee * 1e10).toFixed(0));
      const borrowFeePart = this.expectedBorrowPart.div(100).mul(fee).div(1e10);

      return (
        +utils.formatUnits(this.expectedBorrowPart.add(borrowFeePart)) +
        +userBorrowAmount
      );
    },

    expectedLiquidationPrice() {
      const { mcr } = this.cauldron.config;
      const { liquidationPrice } = this.cauldron.userPosition;

      if (!this.collateralValue) return liquidationPrice;

      return (
        +this.expectedBorrowAmount /
          +this.expectedCollateralDeposit /
          (+mcr / 100) || 0
      ).toFixed(4);
    },

    maxBorrowValue() {
      if (!this.cauldron) return 0;

      const { mcr } = this.cauldron.config;
      const { userBorrowAmount } = this.positionInfo;

      const maxBorrow =
        (this.collateralInUsd / 100) * (mcr - 1) - userBorrowAmount;
      return maxBorrow < 0 ? 0 : maxBorrow;
    },

    errorCollateralValue() {
      if (isNaN(this.collateralValue)) return "Please input valid value";
      if (+this.collateralValue > +this.activeToken.balance)
        return `The value cannot be greater than ${this.activeToken.balance}`;
      return "";
    },

    collateralInUsd() {
      const { oracleExchangeRate } = this.positionInfo;
      return this.expectedCollateralAmount / oracleExchangeRate;
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
      const { isCollateralLocked } = this.cauldron.additionalInfo;

      const info = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.isActionDisabled) return info;
      if (isCollateralLocked) return info;

      if (+this.collateralValue && this.multiplier > 1) {
        info.methodName = "leverageUpHandler";
        info.buttonText = "Leverage Up";
      } else if (+this.collateralValue) {
        info.methodName = "addCollateralHandler";
        info.buttonText = "Add collateral";
      }

      return info;
    },

    positionInfo() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { oracleExchangeRate: oracleRate } = this.cauldron.mainParams;
      const { tokensRate } = this.cauldron.additionalInfo;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      return {
        userCollateralAmount: +utils.formatUnits(
          userCollateralAmount,
          decimals
        ),
        tokensRate: +utils.formatUnits(tokensRate, decimals),
        userBorrowAmount: +utils.formatUnits(userBorrowAmount),
        oracleExchangeRate: +utils.formatUnits(oracleRate, decimals),
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

    collateralToken() {
      const { icon } = this.cauldron.config;
      const { name, decimals } = this.cauldron.config.collateralInfo;
      const { collateral } = this.cauldron.contracts;
      const { collateralBalance, collateralAllowance } =
        this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        balance: utils.formatUnits(collateralBalance, decimals),
        decimals,
        allowance: collateralAllowance,
        contract: collateral,
      };
    },

    unwrappedToken() {
      const { name, icon } = this.cauldron.config.wrapInfo.unwrappedToken;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { unwrappedToken } = this.cauldron.contracts;
      const { unwrappedTokenBalance, unwrappedTokenAllowance } =
        this.cauldron.userTokensInfo;

      return {
        name,
        icon,
        balance: utils.formatUnits(unwrappedTokenBalance, decimals),
        decimals,
        allowance: unwrappedTokenAllowance,
        contract: unwrappedToken,
      };
    },

    nativeToken() {
      const { symbol, baseTokenIcon } = this.getChainById(this.chainId);
      const { nativeTokenBalance } = this.cauldron.userTokensInfo;
      const { collateral } = this.cauldron.contracts;

      return {
        name: symbol,
        icon: baseTokenIcon,
        balance: utils.formatUnits(nativeTokenBalance),
        decimals: 18,
        allowance: BigNumber.from(MAX_ALLOWANCE_VALUE),
        contract: collateral,
        isNative: true,
      };
    },

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
      if (this.isTokenApproved || this.isActionDisabled) return false;

      const { address } = this.cauldron.contracts.bentoBox;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveToken(this.activeToken.contract, address);

      if (approve) await this.createCauldronInfo();
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    async checkPermissionToCook(notificationId, borrowAmount) {
      if (borrowAmount == 0) return true;
      const { userMaxBorrow, mimLeftToBorrow } = this.cauldron.mainParams;
      const { id } = this.cauldron.config;
      const { whitelistedInfo } = this.cauldron.additionalInfo;
      const leftToBorrow = utils.formatUnits(mimLeftToBorrow);
      const borrowLimit = utils.formatUnits(userMaxBorrow);

      if (this.isInstantLiquidation) {
        await this.deleteNotification(notificationId);
        return await this.createNotification(notification.liquidation);
      }

      if (!+leftToBorrow < +borrowAmount) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.allowBorrow);
        return false;
      }

      if (+borrowAmount > +borrowLimit) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.borrowLimit);
        return false;
      }

      if (!whitelistedInfo && this.chainId === 1 && id === 33) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.whitelisted);
        return false;
      }

      return true;
    },

    async actionHandler() {
      if (!this.isTokenApproved || this.isActionDisabled) return false;

      if (!this[this.actionInfo.methodName]) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const borrowValue =
        this.multiplier > 1
          ? utils.formatUnits(this.expectedBorrowPart)
          : this.borrowValue;

      const isPermissionToCook = await this.checkPermissionToCook(
        notificationId,
        borrowValue || 0,
        this.collateralValue || 0
      );

      if (!isPermissionToCook) return false;

      this[this.actionInfo.methodName](notificationId);
    },

    async addCollateralHandler() {
      const payload = {
        amount: this.parseCollateralValue,
        useNativeToken: !!this.activeToken?.isNative,
        useWrapper: !this.useOtherToken,
        to: this.account
      };

      await cookAddCollateral(
        payload,
        this.cauldron,
      );

      return await this.createCauldronInfo();
    },

    async leverageUpHandler(notificationId) {
      const { bentoBox, collateral } = this.cauldron.contracts;
      const { updatePrice } = this.cauldron.mainParams;
      const { isMasterContractApproved } = this.cauldron.additionalInfo;

      const shareToMin = await bentoBox.toShare(
        collateral.address,
        this.expectedMinToSwap,
        true
      );

      const payload = {
        collateralAmount: this.parseCollateralValue.toString(),
        amount: this.expectedBorrowPart.toString(),
        minExpected: shareToMin.toString(),
        updatePrice,
        itsDefaultBalance: !!this.activeToken?.isNative,
        slipage: this.slippage, // todo type
      };

      await cookLeverage(
        payload,
        isMasterContractApproved,
        this.cauldron,
        notificationId,
        !this.useOtherToken && !!this.cauldron.config.wrapInfo,
        this.account
      );

      return await this.createCauldronInfo();
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
      }, 60000);
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
      import("@/components/borrow/SettingsPopup.vue")
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

.cauldron-stand {
  min-height: 520px;
  padding: 30px 20px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
  background-position: center;
  background-size: cover;
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

  .cauldron-stand {
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
  }
}
</style>
