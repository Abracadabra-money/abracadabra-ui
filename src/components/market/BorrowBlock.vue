<template>
  <div class="market-actions-wrap">
    <DepositBlock
      :cauldron="cauldron"
      :inputAmpunt="amounts.deposit.inputAmount"
      :useNativeToken="useNativeToken"
      :useUnwrapToken="useUnwrapToken"
      :toggleNativeToken="() => (useNativeToken = !useNativeToken)"
      :toggleUnwrapToken="() => (useUnwrapToken = !useUnwrapToken)"
      @updateDepositAmounts="onUpdateDepositAmounts"
    />
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
        :max="maxToBorrow"
        :tokenPrice="borrowToken.price"
        isBigNumber
        @updateInputValue="onUpdateBorrowValue"
      />

      <div class="range-wrap">
        <LtvRange
          :value="ltvRangeValue"
          :positionLtv="positionLtv"
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
  applyBorrowFee,
  getLiquidationPrice,
  getMaxToBorrow,
  getMimToBorrowByLtv,
  getPositionHealth,
  getUserLtv,
} from "@/helpers/cauldron/utils";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { approveToken } from "@/helpers/approval";
// @ts-ignore
import cookMixin from "@/mixins/borrow/cooksV2.js";
// @ts-ignore
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
// @ts-ignore
import notification from "@/helpers/notification/notification.js";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

import { trimZeroDecimals } from "@/helpers/numbers";

import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";

const MIM_PRICE = 1;

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
      borrowInputValue: "",
      ltvRangeValue: "",
      amounts: {
        deposit: {
          inputAmount: BigNumber.from(0),
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
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

    isTokenApproved() {
      if (!this.account) return true;

      const { unwrappedTokenAllowance } = this.cauldron.userTokensInfo;
      const { collateralAllowance } = this.cauldron.userTokensInfo;

      const { collateralTokenAmount, unwrapTokenAmount } = this.amounts.deposit;

      if (this.useNativeToken) return true;

      if (this.useUnwrapToken)
        return unwrappedTokenAllowance.gte(unwrapTokenAmount);

      return collateralAllowance.gte(collateralTokenAmount);
    },

    isActionDisabled() {
      const { collateralBalance, unwrappedTokenBalance, nativeTokenBalance } =
        this.cauldron.userTokensInfo;

      const { inputAmount } = this.amounts.deposit;
      const { borrow } = this.amounts;

      if (inputAmount.isZero() && borrow.isZero()) return true;

      if (this.useNativeToken && inputAmount.gt(nativeTokenBalance)) return true;
      if (this.useUnwrapToken && inputAmount.gt(unwrappedTokenBalance)) return true;
      if(!this.useNativeToken && !this.useUnwrapToken && inputAmount.gt(collateralBalance)) return true

      if (borrow.gt(this.maxToBorrow)) return true;

      return false;
    },

    maxToBorrow() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      return getMaxToBorrow(
        this.expectedCollateralAmount,
        userBorrowAmount,
        mcr,
        oracleExchangeRate
      );
    },

    expectedCollateralAmount() {
      return this.cauldron.userPosition.collateralInfo.userCollateralAmount.add(
        this.amounts.deposit.collateralTokenAmount
      );
    },

    expectedBorrowAmount() {
      const { borrowFee } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      return applyBorrowFee(this.amounts.borrow, borrowFee * 1000).add(
        userBorrowAmount
      );
    },

    expectedLiquidationPrice() {
      return getLiquidationPrice(
        this.expectedBorrowAmount,
        this.expectedCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );
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
      const positionLtv = utils.formatUnits(
        getUserLtv(
          this.expectedCollateralAmount,
          this.expectedBorrowAmount,
          this.cauldron.mainParams.oracleExchangeRate
        ),
        PERCENT_PRESITION
      );

      return Math.ceil(Number(positionLtv));
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

    onUpdateDepositAmounts(amounts: any) {
      this.amounts.deposit = amounts;
      this.$emit("updateAmounts", this.amounts);
    },

    onUpdateBorrowValue(value: BigNumber | null) {
      if (value === null) {
        this.amounts.borrow = BigNumber.from(0);
        this.borrowInputValue = "";
        this.$emit("updateAmounts", this.amounts);
        return;
      }

      this.amounts.borrow = value;
      this.borrowInputValue = trimZeroDecimals(utils.formatUnits(value));
      this.$emit("updateAmounts", this.amounts);
    },

    updateBorrowValueByLtv(value: number) {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const ltv = expandDecimals(value, PERCENT_PRESITION);
      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      const mimToBorrow = getMimToBorrowByLtv(
        ltv,
        mcr,
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
    DepositBlock: defineAsyncComponent(
      () => import("@/components/market/DepositBlock.vue")
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
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
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
