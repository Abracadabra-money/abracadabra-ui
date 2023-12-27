<template>
  <div class="market-actions-wrap">
    <div class="deposit-wrap">
      <div>
        <h3 class="title">Remove collateral</h3>
        <h4 class="subtitle">
          Select the amount of GLP to withdraw from the Cauldron
        </h4>
      </div>

      <TokenInput
        :value="depositInputValue"
        :name="activeToken.name"
        :icon="activeToken.icon"
        :max="maxCollateralAmount"
        :decimals="activeToken.decimals"
        :tokenPrice="activeToken.price"
        isBigNumber
        @updateInputValue="updateDepositValue"
      />
    </div>

    <div class="borrow-wrap">
      <div>
        <div class="row">
          <h3 class="title">Borrow MIM</h3>

          <Toggle
            :selected="useLeverage"
            text="Leverage"
            @updateToggle="updateActionType"
          />
        </div>

        <h4 class="subtitle">
          Select the amount of MIM to borrow from the Cauldron
        </h4>
      </div>

      <TokenInput
        :value="borrowInputValue"
        :name="borrowToken.name"
        :icon="borrowToken.icon"
        :max="maxBorrowAmount"
        :tokenPrice="borrowToken.price"
        isBigNumber
        @updateInputValue="updateBorrowValue"
      />

      <div class="range-wrap">
        <LtvRange
          :value="ltvRangeValue"
          :userLtv="positionLtv"
          :mcr="cauldron.config.mcr"
          :max="cauldron.config.mcr"
          :risk="positionHealth"
          @updateValue="updateBorrowValueByLtv"
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
  getLiquidationPrice,
  getMaxCollateralToRemove,
  getMimToBorrowByLtv,
  getPositionHealth,
  getUserLtv,
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

const MIM_PRICE = 1;

type ActiveToken = {
  name: string;
  icon: string;
  balance: BigNumber;
  decimals: number;
  allowance: BigNumber;
  isNative?: boolean;
  price: string;
  contract?: any;
};

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
      useNativeToken: false,
      useUnwrapToken: false,
      depositInputValue: "",
      borrowInputValue: "",
      ltvRangeValue: "",
      amounts: {
        deposit: {
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
        },
        borrow: BigNumber.from(0),
        actionType: "repay",
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    maxCollateralAmount() {
      const { mcr } = this.cauldron.config;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.activeToken;
      const { borrowInfo, collateralInfo } = this.cauldron.userPosition;
      const { userBorrowAmount } = borrowInfo;
      const { userCollateralAmount } = collateralInfo;

      return getMaxCollateralToRemove(
        userCollateralAmount,
        userBorrowAmount.sub(this.amounts.borrow),
        mcr,
        oracleExchangeRate,
        decimals
      );
    },

    maxBorrowAmount() {
      const { balance } = this.borrowToken;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      if (userBorrowAmount.gt(balance)) return balance;
      return userBorrowAmount;
    },

    expectedCollateralAmount() {
      return this.cauldron.userPosition.collateralInfo.userCollateralAmount.sub(
        this.amounts.deposit.collateralTokenAmount
      );
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      return userBorrowAmount.sub(this.amounts.borrow);
    },

    // ------

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
      const { collateralBalance, unwrappedTokenBalance, nativeTokenBalance } =
        this.cauldron.userTokensInfo;
      const { unwrapTokenAmount } = this.amounts.deposit;
      const { borrow } = this.amounts;

      const wrapInfo = this.cauldron.config?.wrapInfo;

      if (unwrapTokenAmount.isZero() && borrow.isZero()) return true;

      if (borrow.gt(this.maxBorrowAmount)) return true;

      if (this.useNativeToken) {
        return unwrapTokenAmount.gt(nativeTokenBalance);
      }

      if (wrapInfo?.useUnwrappedByDefault && !this.useUnwrapToken) {
        return unwrapTokenAmount.gt(unwrappedTokenBalance);
      }

      if (wrapInfo?.useUnwrappedByDefault && this.useUnwrapToken) {
        return unwrapTokenAmount.gt(collateralBalance);
      }

      return unwrapTokenAmount.gt(collateralBalance);
    },

    expectedLiquidationPrice() {
      return getLiquidationPrice(
        this.expectedBorrowAmount,
        this.expectedCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
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

    activeToken(): ActiveToken {
      const useUnwrappedByDefault =
        this.cauldron.config?.wrapInfo?.useUnwrappedByDefault;

      if (this.useNativeToken) return this.nativeToken;
      if (useUnwrappedByDefault && !this.useUnwrapToken)
        return this.unwrappedToken;
      return this.collateralToken;
    },

    borrowToken() {
      const { config, userTokensInfo } = this.cauldron;
      return {
        name: config.mimInfo.name,
        icon: config.mimInfo.icon,
        balance: userTokensInfo.mimBalance,
        price: MIM_PRICE,
      };
    },

    positionLtv() {
      return utils.formatUnits(
        getUserLtv(
          this.expectedCollateralAmount,
          this.expectedBorrowAmount,
          this.cauldron.mainParams.oracleExchangeRate
        ),
        2
      );
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

    // maxBorrowAmount() {
    //   const { borrowInfo, collateralInfo } = this.cauldron.userPosition;
    //   const { userBorrowAmount } = borrowInfo;
    //   const { userCollateralAmount } = collateralInfo;

    //   return getMaxToBorrow(
    //     userCollateralAmount.add(this.amounts.deposit.collateralTokenAmount),
    //     userBorrowAmount,
    //     this.cauldron.config.mcr,
    //     this.cauldron.mainParams.oracleExchangeRate
    //   );
    // },

    actionInfo(): any {
      const { borrow } = this.amounts;
      const { collateralTokenAmount } = this.amounts.deposit;
      const { isCollateralLocked } = this.cauldron.additionalInfo;

      const info: any = {
        methodName: null,
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

      if (!borrow.isZero() && !collateralTokenAmount.isZero()) {
        info.methodName = "addCollateralAndBorrowHandler";
        info.buttonText = "Add collateral and borrow";
      } else if (!borrow.isZero()) {
        info.methodName = "borrowHandler";
        info.buttonText = "Borrow";
      } else if (!collateralTokenAmount.isZero()) {
        info.methodName = "addCollateralHandler";
        info.buttonText = "Add collateral";
      }

      return info;
    },
  },

  watch: {
    useUnwrapToken() {
      this.clearInputs();
    },

    useNativeToken() {
      this.clearInputs();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

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

      this.depositInputValue = utils.formatUnits(value, decimals);
    },

    updateBorrowValue(value: BigNumber) {
      this.amounts.borrow = value;
      this.borrowInputValue = utils.formatUnits(value);
      this.$emit("updateAmounts", this.amounts);
    },

    updateBorrowValueByLtv(ltv: number) {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      const mimToBorrow = getMimToBorrowByLtv(
        ltv,
        this.cauldron.config.mcr,
        this.expectedCollateralAmount,
        userBorrowAmount,
        this.cauldron.mainParams.oracleExchangeRate
      );

      this.borrowInputValue = utils.formatUnits(mimToBorrow);
    },

    updateActionType() {
      this.$emit("toogleUseLeverage");
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
      // @ts-ignore
      if (!this[this.actionInfo.methodName]) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const isPermissionToCook = await this.checkPermissionToCook(
        notificationId,
        this.amounts.borrow
      );

      if (!isPermissionToCook) return false;

      try {
        // @ts-ignore
        await this[this.actionInfo.methodName]();

        this.clearInputs();

        this.deleteNotification(notificationId);
        this.createNotification(notification.success);
      } catch (error) {
        console.log("borrow error", error);
        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        this.deleteNotification(notificationId);
        this.createNotification(errorNotification);
      }
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

    async borrowHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        amount: this.amounts.borrow,
        updatePrice,
      };

      await this.cookBorrow(payload, isMasterContractApproved, this.cauldron);

      this.$emit("updateMarket");
    },

    async addCollateralAndBorrowHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        collateralAmount: this.amounts.deposit.unwrapTokenAmount,
        amount: this.amounts.borrow,
        updatePrice,
        itsDefaultBalance: !!this.activeToken.isNative,
      };

      await this.cookAddCollateralAndBorrow(
        payload,
        isMasterContractApproved,
        this.cauldron,
        !!this.cauldron.config?.wrapInfo,
        !this.useUnwrapToken
      );

      this.$emit("updateMarket");
    },

    clearInputs() {
      this.depositInputValue = "";
      this.borrowInputValue = "";
    },
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    LtvRange: defineAsyncComponent(
      () => import("@/components/ui/range/LtvRange.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
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
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 370px;
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
  margin-bottom: 4px;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 16px;
}

.dynamic-fee {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dynamic-fee-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
}

.dynamic-fee-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}
</style>
