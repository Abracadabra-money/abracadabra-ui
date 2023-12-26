<template>
  <div class="market-actions-wrap">
    <div class="deposit-wrap">
      <DepositForm
        :cauldron="cauldron"
        :useUnwrapToken="useUnwrapToken"
        :useNativeToken="useNativeToken"
        :depositInputValue="depositInputValue"
        @toogleUseNativeToken="toogleUseNativeToken"
        @toogleUseUnwrapToken="toogleUseUnwrapToken"
        @updateCollateralValues="updateCollateralValues"
      />
    </div>

    <div class="borrow-wrap">
      <div>
        <div class="row">
          <h3 class="title">
            {{ borrowBlockTitle }} <IconButton seting v-if="useLeverage" />
          </h3>

          <Toggle
            :selected="useLeverage"
            text="Leverage"
            @updateToggle="updateActionType"
          />
        </div>

        <h4 class="subtitle">{{ borrowBlockSubtitle }}</h4>
      </div>

      <LeverageForm v-if="useLeverage" :cauldron="cauldron" />
      <BorrowForm
        v-else
        :cauldron="cauldron"
        :borrowInputValue="borrowInputValue"
        :useUnwrapToken="useUnwrapToken"
        :collateralAmounts="amounts.deposit"
        @updateBorrowValue="updateBorrowValue"
      />

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
import { BigNumber } from "ethers";
import { defineAsyncComponent } from "vue";
import { getMaxToBorrow } from "@/helpers/cauldron/utils";
// @ts-ignore
import cookMixin from "@/mixins/borrow/cooksV2.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
// @ts-ignore
import notification from "@/helpers/notification/notification.js";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { approveToken } from "@/helpers/approval";
import { MAX_ALLOWANCE_VALUE } from "@/constants/cauldron";
import { getChainById } from "@/helpers/chains";
import { switchNetwork } from "@/helpers/chains/switchNetwork";

export default {
  mixins: [cookMixin],
  props: {
    cauldron: {
      type: Object as any,
    },
    useUnwrapToken: {
      type: Boolean,
    },
    useNativeToken: {
      type: Boolean,
    },
  },

  data() {
    return {
      useLeverage: false,
      amounts: {
        deposit: {
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
        },
        borrow: BigNumber.from(0),
      },
      depositInputValue: null,
      borrowInputValue: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    borrowBlockTitle() {
      if (this.useLeverage) return "Leverage Up";
      return "Borrow MIM";
    },

    borrowBlockSubtitle() {
      if (this.useLeverage) return "Select leverage ‘’x’’";
      return "Select the amount of MIM to borrow from the Cauldron";
    },

    nativeToken() {
      const { config, userTokensInfo } = this.cauldron;
      const { nativeTokenBalance } = userTokensInfo;
      const { symbol, baseTokenIcon }: any = getChainById(config.chainId);

      return {
        name: symbol,
        icon: baseTokenIcon,
        balance: nativeTokenBalance,
        decimals: 18,
        allowance: BigNumber.from(MAX_ALLOWANCE_VALUE),
        isNative: true,
      };
    },

    collateralToken() {
      const { config, userTokensInfo } = this.cauldron;
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
      };
    },

    unwrappedToken() {
      const { config, userTokensInfo } = this.cauldron;
      const { decimals } = config.collateralInfo;
      const { name, icon } = config.wrapInfo.unwrappedToken;
      const { unwrappedTokenBalance, unwrappedTokenAllowance } = userTokensInfo;

      return {
        name,
        icon,
        balance: unwrappedTokenBalance,
        decimals,
        allowance: unwrappedTokenAllowance,
        contract: this.cauldron.contracts?.unwrappedToken,
      };
    },

    activeToken() {
      const { acceptUseDefaultBalance } = this.cauldron.config.cauldronSettings;
      const useUnwrappedByDefault =
        this.cauldron.config?.wrapInfo?.useUnwrappedByDefault;

      if (acceptUseDefaultBalance && this.useNativeToken)
        return this.nativeToken;
      if (useUnwrappedByDefault && !this.useUnwrapToken)
        return this.unwrappedToken;
      return this.collateralToken;
    },

    // -----

    isTokenApproved() {
      console.log("this.activeToken", this.activeToken);

      if (!this.account) return true;
      return this.activeToken.allowance.gte(
        this.amounts.deposit.unwrapTokenAmount
      );
    },

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

    isActionDisabled() {
      const { collateralBalance, unwrappedTokenBalance } =
        this.cauldron.userTokensInfo;
      const { collateralTokenAmount } = this.amounts.deposit;
      const { borrow } = this.amounts;

      const wrapInfo = this.cauldron.config?.wrapInfo;

      if (collateralTokenAmount.isZero() && borrow.isZero()) return true;

      if (borrow.gt(this.maxBorrowAmount)) return true;

      if (wrapInfo?.useUnwrappedByDefault && !this.useUnwrapToken) {
        return collateralTokenAmount.gt(unwrappedTokenBalance);
      }

      if (wrapInfo?.useUnwrappedByDefault && this.useUnwrapToken) {
        return collateralTokenAmount.gt(collateralBalance);
      }

      return collateralTokenAmount.gt(collateralBalance);
    },

    actionInfo() {
      const { borrow } = this.amounts;
      const { collateralTokenAmount } = this.amounts.deposit;
      const { isCollateralLocked } = this.cauldron.additionalInfo;

      const info: any = {
        methodName: null,
        buttonText: "Nothing to do",
      };

      if (this.chainId !== this.cauldron.config.chainId) {
        info.methodName = "switchHandler";
        info.buttonText = "Switch Chain";
        return info;
      }

      if (!this.isTokenApproved) {
        info.methodName = "approveTokenHandler";
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

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    toogleUseNativeToken() {
      this.$emit("toogleUseNativeToken");
    },

    updateCollateralValues(value: any) {
      this.amounts.deposit = value;
      this.$emit("updateAmounts", this.amounts);
    },

    updateBorrowValue(value: any) {
      this.amounts.borrow = value;
      this.$emit("updateAmounts", this.amounts);
    },

    toogleUseUnwrapToken() {
      this.$emit("toogleUseUnwrapToken");
    },

    updateActionType() {
      this.useLeverage = !this.useLeverage;
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

      if (this.isActionDisabled) return false;

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

      this.depositInputValue = "";

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

      this.borrowInputValue = "";

      this.$emit("updateMarket");
    },

    async addCollateralAndBorrowHandler() {
      const { isMasterContractApproved } = this.cauldron.additionalInfo;
      const { updatePrice } = this.cauldron.mainParams;

      const payload = {
        collateralAmount: this.amounts.deposit.unwrapTokenAmount,
        amount: this.amounts.borrow,
        updatePrice,
        // itsDefaultBalance: !!this.activeToken.isNative,
        itsDefaultBalance: false,
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

    async switchHandler() {
      console.log("this.cauldron.config.chainId", this.cauldron.config.chainId);
    },

    clearInputs() {
      this.depositInputValue = "";
      this.borrowInputValue = "";
    },
  },

  components: {
    DepositForm: defineAsyncComponent(
      () => import("@/components/market/DepositForm.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    BorrowForm: defineAsyncComponent(
      () => import("@/components/market/BorrowForm.vue")
    ),
    LeverageForm: defineAsyncComponent(
      () => import("@/components/market/LeverageForm.vue")
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
