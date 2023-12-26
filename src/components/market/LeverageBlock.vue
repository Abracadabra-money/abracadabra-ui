<template>
  <div class="market-actions-wrap">
    <div class="deposit-wrap">
      <div>
        <div class="row">
          <h3 class="title">Deposit collateral {{ expectedBorrowAmount }}</h3>
          <Toggle
            v-if="isNativeToken"
            :selected="useNativeToken"
            :text="nativeToken.name"
            @updateToggle="useNativeToken = !useNativeToken"
          />

          <Toggle
            v-if="isUnwrapToken"
            :selected="useUnwrapToken"
            :text="unwrapTokenName"
            @updateToggle="useUnwrapToken = !useUnwrapToken"
          />
        </div>

        <h4 class="subtitle">
          Select the amount of GLP to deposit in the Cauldron
        </h4>
      </div>

      <TokenInput
        :value="depositInputValue"
        :name="activeToken.name"
        :icon="activeToken.icon"
        :max="activeToken.balance"
        :decimals="activeToken.decimals"
        :tokenPrice="activeToken.price"
        isBigNumber
        @updateInputValue="updateDepositValue"
      />
    </div>

    <div class="borrow-wrap">
      <div>
        <div class="row">
          <h3 class="title">
            Leverage Up
            <IconButton
              seting
              v-if="useLeverage"
              :width="20"
              :height="20"
              padding="4px"
            />
          </h3>

          <Toggle
            :selected="useLeverage"
            text="Leverage"
            @updateToggle="updateActionType"
          />
        </div>

        <h4 class="subtitle">Select leverage ‘’x’’</h4>

        <div class="range-wrap">
          <LeverageRange
            :value="multiplier"
            :max="maxLeverageMultiplier"
            :min="minRangeValue"
            :step="rangeStep"
            :risk="positionHealth"
            :collateralValue="depositInputValue"
            :disabled="!depositInputValue"
            tooltipText="Allows users to leverage their position. Read more about this in the documents!"
            @updateValue="updateMultiplier"
          />
        </div>

        <DynamicallyEstimatedPrice
          v-if="chainId !== 2222"
          :amount="formatUnits(expectedBorrowAmount)"
          :mimAddress="cauldron.config.mimInfo.address"
        />
      </div>

      <BaseButton
        primary
        :disabled="actionInfo.buttonText === 'Nothing to do'"
        @click="actionHandler"
        >{{ actionInfo.buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getLeverageAmounts,
  getLiquidationPrice,
  getMaxToBorrow,
  getPositionHealth,
} from "@/helpers/cauldron/utils";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { getChainById } from "@/helpers/chains";
import { approveToken } from "@/helpers/approval";
// @ts-ignore
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { MAX_ALLOWANCE_VALUE } from "@/constants/cauldron";
// @ts-ignore
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { applyTokenWrapperRate } from "@/helpers/cauldron/utils";
// @ts-ignore
import notification from "@/helpers/notification/notification.js";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier";

export default {
  mixins: [cookMixin],
  props: {
    cauldron: {
      type: Object as any,
    },
    useLeverage: {
      type: Boolean,
    },
  },

  data() {
    return {
      slippage: 1,
      multiplier: 1,
      rangeStep: 0.01,
      minRangeValue: 1,
      useNativeToken: false,
      useUnwrapToken: false,
      depositInputValue: "",
      maxLeverageMultiplier: 5,
      depositAmount: BigNumber.from(0),
      amounts: {
        deposit: {
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
          expectedMinToSwap: BigNumber.from(0),
        },
        borrow: BigNumber.from(0),
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isNativeToken() {
      return this.cauldron.config.cauldronSettings.acceptUseDefaultBalance;
    },

    isUnwrapToken() {
      return !!this.cauldron.config?.wrapInfo;
    },

    isTokenApproved() {
      if (!this.account) return true;
      if (this.activeToken.balance.lt(this.amounts.deposit.unwrapTokenAmount))
        return true;
      return this.activeToken.allowance.gte(
        this.amounts.deposit.unwrapTokenAmount
      );
    },

    isActionDisabled() {
      const { unwrapTokenAmount } = this.amounts.deposit;
      if (unwrapTokenAmount.isZero()) return true;
      return unwrapTokenAmount.gt(this.activeToken.balance);
    },

    parseMultiplyer() {
      return BigNumber.from(
        parseFloat((this.multiplier * 1e10).toString()).toFixed(0)
      );
    },

    parseSlippage() {
      return BigNumber.from(
        parseFloat((this.slippage * 1e10).toString()).toFixed(0)
      );
    },

    expectedCollateralAmount() {
      return this.amounts.deposit.unwrapTokenAmount.add(this.expectedMinToSwap);
    },

    expectedMinToSwap() {
      const slippageAmount = this.expectedToSwapAmount
        .div(100)
        .mul(this.parseSlippage)
        .div(1e10);

      return this.expectedToSwapAmount.sub(slippageAmount);
    },

    expectedToSwapAmount() {
      return this.amounts.deposit.unwrapTokenAmount
        .mul(this.parseMultiplyer)
        .div(1e10)
        .sub(this.amounts.deposit.unwrapTokenAmount);
    },

    expectedLiquidationPrice() {
      return getLiquidationPrice(
        this.expectedBorrowAmount,
        this.expectedCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    expectedBorrowAmount() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      return (
        this.expectedToSwapAmount
          // .mul(expandDecimals(1, MIM_DESIMALS))
          .mul(String(1e18))
          .div(oracleExchangeRate)
      );
    },

    unwrapTokenName() {
      if (this.cauldron.config?.wrapInfo?.useUnwrappedByDefault)
        return this.cauldron.config.name;
      return this.cauldron.config?.wrapInfo.unwrappedToken.name;
    },

    nativeToken() {
      const { config, userTokensInfo, mainParams, additionalInfo } =
        this.cauldron;
      const { nativeTokenBalance } = userTokensInfo;
      const { decimals } = config.collateralInfo;
      const { symbol, baseTokenIcon }: any = getChainById(config.chainId);

      const { collateralPrice } = mainParams;
      const { tokensRate } = additionalInfo;

      const price = collateralPrice
        .mul(expandDecimals(1, decimals))
        .div(tokensRate);

      return {
        name: symbol,
        icon: baseTokenIcon,
        balance: nativeTokenBalance,
        decimals: 18,
        allowance: BigNumber.from(MAX_ALLOWANCE_VALUE),
        isNative: true,
        price: utils.formatUnits(price, decimals),
      };
    },

    unwrappedToken() {
      const { config, userTokensInfo, additionalInfo, mainParams } =
        this.cauldron;
      const { decimals } = config.collateralInfo;
      const { name, icon } = config.wrapInfo.unwrappedToken;
      const { unwrappedTokenBalance, unwrappedTokenAllowance } = userTokensInfo;
      const { collateralPrice } = mainParams;
      const { tokensRate } = additionalInfo;

      const price = collateralPrice
        .mul(expandDecimals(1, decimals))
        .div(tokensRate);

      return {
        name,
        icon,
        balance: unwrappedTokenBalance,
        decimals,
        allowance: unwrappedTokenAllowance,
        contract: this.cauldron.contracts?.unwrappedToken,
        price: utils.formatUnits(price, decimals),
      };
    },

    collateralToken() {
      const { config, userTokensInfo, mainParams } = this.cauldron;
      const { collateralPrice } = mainParams;
      const { icon } = config;
      const { name, decimals } = config.collateralInfo;
      const { collateralBalance, collateralAllowance } = userTokensInfo;

      return {
        name,
        icon,
        balance: collateralBalance,
        decimals,
        allowance: collateralAllowance,
        contract: this.cauldron.contracts?.collateral,
        price: utils.formatUnits(collateralPrice, decimals),
      };
    },

    activeToken() {
      const useUnwrappedByDefault =
        this.cauldron.config?.wrapInfo?.useUnwrappedByDefault;

      if (this.useNativeToken) return this.nativeToken;
      if (useUnwrappedByDefault && !this.useUnwrapToken)
        return this.unwrappedToken;
      return this.collateralToken;
    },

    positionHealth() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;

      const riskPersent = getPositionHealth(
        this.expectedLiquidationPrice,
        oracleExchangeRate,
        decimals
      );

      if (riskPersent.gte(0) && riskPersent.lte(25)) return "safe";
      if (riskPersent.gt(25) && riskPersent.lte(75)) return "medium";
      return "high";
    },

    actionInfo() {
      const { isCollateralLocked } = this.cauldron.additionalInfo;

      const info = {
        methodName: null as null | string,
        buttonText: "Nothing to do",
      };

      if (this.chainId !== this.cauldron.config.chainId) {
        info.buttonText = "Switch Chain";
        return info;
      }

      if (!this.isTokenApproved) {
        info.buttonText = "Approve";
        return info;
      }

      if (this.isActionDisabled) return info;
      if (isCollateralLocked) return info;

      const { collateralTokenAmount } = this.amounts.deposit;

      if (!collateralTokenAmount.isZero() && this.multiplier > 1) {
        info.methodName = "leverageUpHandler";
        info.buttonText = "Leverage Up";
      } else if (!collateralTokenAmount.isZero()) {
        info.methodName = "addCollateralHandler";
        info.buttonText = "Add collateral";
      }

      return info;
    },

    // ------

    // todo approv

    maxBorrowAmount() {
      const { borrowInfo, collateralInfo } = this.cauldron.userPosition;
      const { userBorrowAmount } = borrowInfo;
      const { userCollateralAmount } = collateralInfo;

      return getMaxToBorrow(
        userCollateralAmount.add(this.amounts.deposit.collateralTokenAmount),
        userBorrowAmount,
        this.cauldron.config.mcr,
        this.cauldron.mainParams.oracleExchangeRate
      );
    },
  },

  watch: {
    useUnwrapToken() {
      this.clearInputs();
    },

    useNativeToken() {
      this.clearInputs();
    },

    depositInputValue(value, oldValue) {
      if (!Number(value) && value !== oldValue) {
        const maxMultiplier = getMaxLeverageMultiplier(
          this.cauldron,
          Number(value)
        );
        if (maxMultiplier < this.multiplier) this.multiplier = maxMultiplier;
        this.maxLeverageMultiplier = maxMultiplier;
      }
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUnits(value: string, decimals = 18) {
      return Number(utils.formatUnits(value, decimals));
    },

    updateDepositValue(value: BigNumber) {
      const { tokensRate } = this.cauldron.additionalInfo;
      const { decimals } = this.cauldron.config.collateralInfo;

      const isUnwrapToken = this.cauldron.config?.wrapInfo
        ?.useUnwrappedByDefault
        ? !this.useUnwrapToken
        : this.useUnwrapToken;

      const collateralTokenAmount = isUnwrapToken
        ? applyTokenWrapperRate(value, tokensRate, decimals)
        : value;

      const unwrapTokenAmount = value ? value : BigNumber.from(0);

      this.amounts.deposit = {
        collateralTokenAmount,
        unwrapTokenAmount,
      };

      this.$emit("updateAmounts", this.amounts);
      if (value.isZero()) this.multiplier = 1;
      this.depositInputValue = utils.formatUnits(value, decimals);
    },

    updateActionType() {
      this.$emit("toogleUseLeverage");
    },

    // todo
    updateMultiplier(value: number) {
      const { oracleExchangeRate } = this.cauldron.mainParams;

      this.multiplier = value;
      this.amounts.borrow = this.expectedBorrowAmount;
      this.amounts.deposit.minToSwap = this.expectedMinToSwap;

      // todo
      const leverageAmounts = getLeverageAmounts(
        this.amounts.deposit.unwrapTokenAmount,
        this.multiplier * 100,
        this.slippage,
        oracleExchangeRate
      );
    },

    async actionHandler() {
      if (this.chainId !== this.cauldron.config.chainId) {
        await switchNetwork(this.cauldron.config.chainId);
        return false;
      }

      if (!this.isTokenApproved) {
        this.approveTokenHandler();
        return false;
      }

      if (this.isActionDisabled) return false;

      if (!this[this.actionInfo.methodName]) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const isPermissionToCook = await this.checkPermissionToCook(
        notificationId,
        this.expectedBorrowAmount,
        this.amounts.deposit.unwrapTokenAmount
      );

      if (!isPermissionToCook) return false;

      try {
        await this[this.actionInfo.methodName]();

        // todo
        // this.clearInputs();

        this.deleteNotification(notificationId);
        this.createNotification(notification.success);
      } catch (error) {
        console.log("leverage error", error);

        const errorType =
          String(error).indexOf("GM") !== -1 ? "warning" : "error";

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: errorType,
        };

        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
    },

    async checkPermissionToCook(
      notificationId: number,
      borrowAmount: BigNumber
    ) {
      if (borrowAmount.isZero()) return true;
      const { id } = this.cauldron.config;
      const { whitelistedInfo } = this.cauldron.additionalInfo;
      const { userMaxBorrow, mimLeftToBorrow } = this.cauldron.mainParams;

      if (mimLeftToBorrow.lt(borrowAmount)) {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.allowBorrow);
        return false;
      }

      if (borrowAmount.gt(userMaxBorrow)) {
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

    async approveTokenHandler() {
      if (this.isTokenApproved || this.isActionDisabled) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const { address } = this.cauldron.contracts.bentoBox;

      const approve = await approveToken(this.activeToken.contract, address);

      if (approve) await this.$emit("updateMarket");
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    async addCollateralHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        amount: this.amounts.deposit.unwrapTokenAmount,
        updatePrice,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      await this.cookAddCollateral(
        payload,
        isMasterContractApproved,
        this.cauldron,
        !!this.cauldron.config?.wrapInfo,
        !this.useUnwrapToken
      );

      this.$emit("updateMarket");
    },

    // -----

    async leverageUpHandler() {
      console.log("leverageUpHandler");
    },

    clearInputs() {
      this.depositInputValue = "";
    },
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    LeverageRange: defineAsyncComponent(
      () => import("@/components/ui/range/LeverageRange.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    DynamicallyEstimatedPrice: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/borrow/DynamicallyEstimatedPrice.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-actions-wrap {
  @include font;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
}

.deposit-wrap {
  @include block-wrap;
  min-height: 190px;
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 390px;
  justify-content: space-between;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 16px;
}

.range-wrap {
  margin-bottom: 16px;
}
</style>
