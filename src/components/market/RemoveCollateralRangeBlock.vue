<template>
  <div>
    <div class="row">
      <h3 class="title">Remove collateral</h3>

      <Toggle
        v-if="isWrapAllowed"
        :text="unwrappedTokenName"
        :selected="isWithdrawUnwrapToken"
        @updateToggle="onChangeWithdrawToken"
      />
    </div>

    <h4 class="subtitle">Choose the amount of collateral you want to remove</h4>

    <AmountRange
      :amount="withdrawAmount"
      :maxAmount="maxToRemove"
      :risk="positionHealth"
      isPotion
      @updateAmount="onUpdateWithdrawValue"
    />

    <div class="expected-amount" v-if="isWrapAllowed && withdrawUnwrapToken">
      <span> Expected</span>
      <span>
        {{ expectedTokenAmount }}
        {{ cauldron.config.wrapInfo.unwrappedToken.name }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  getLiquidationPrice,
  getPositionHealth,
  PERCENT_PRESITION,
  getMaxCollateralToRemove,
} from "@/helpers/cauldron/utils";
import { mapGetters } from "vuex";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { formatToFixed } from "@/helpers/filters";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    isWithdrawUnwrapToken: {
      type: Boolean,
      default: true,
    },
    useDeleverage: {
      type: Boolean,
      default: false,
    },
    deleverageAmounts: {
      default: {
        amountFrom: BigNumber.from(0),
        amountToMin: BigNumber.from(0),
      },
    },
    withdrawAmount: {
      type: BigNumber,
    },
  },

  emits: ["updateWithdrawAmount", "updateToggle"],

  data() {
    return {
      slippage: 1,
      inputValue: 0,
      withdrawUnwrapToken: true,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    maxToRemove() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      //@ts-ignore
      const { amountFrom } = this.deleverageAmounts;

      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      // after swap
      const expectedCollateralAmount = userCollateralAmount.sub(amountFrom);
      const maxToRemove = getMaxCollateralToRemove(
        expectedCollateralAmount,
        this.expectedBorrowAmount,
        mcr,
        oracleExchangeRate
      );

      if (maxToRemove.gt(userCollateralAmount)) return userCollateralAmount;

      return maxToRemove;
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      //@ts-ignore
      const { amountToMin } = this.deleverageAmounts;

      const expectedBorrowAmount = userBorrowAmount.sub(amountToMin);

      return expectedBorrowAmount.lt(0)
        ? BigNumber.from(0)
        : expectedBorrowAmount;
    },

    expectedCollateralAmount() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      //@ts-ignore
      const { amountFrom } = this.deleverageAmounts;

      const expectedCollateralAmount = userCollateralAmount
        .sub(amountFrom)
        .sub(this.withdrawAmount);

      return expectedCollateralAmount.lt(0)
        ? BigNumber.from(0)
        : expectedCollateralAmount;
    },

    expectedLiquidationPrice() {
      return getLiquidationPrice(
        this.expectedBorrowAmount,
        this.expectedCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    positionHealth() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;

      const { status } = getPositionHealth(
        this.expectedLiquidationPrice,
        oracleExchangeRate,
        decimals
      );

      return status;
    },

    isWrapAllowed() {
      return (
        this.cauldron?.config?.wrapInfo &&
        !this.cauldron?.config?.wrapInfo?.isHiddenWrap
      );
    },

    unwrappedTokenName() {
      return `As ${this.cauldron?.config?.wrapInfo?.unwrappedToken?.name}`;
    },

    expectedTokenAmount() {
      return formatToFixed(
        this.inputValue *
          +utils.formatUnits(this.cauldron.additionalInfo.tokensRate),
        2
      );
    },
  },

  watch: {
    inputAmpunt(value) {
      if (value.eq(0)) {
        this.inputValue = 0;
        return false;
      }

      this.inputValue = Number(utils.formatUnits(value));
    },

    useDeleverage() {
      this.inputValue = 0;
    },

    isWithdrawUnwrapToken() {
      this.inputValue = 0;
    },
  },

  methods: {
    setEmptyState() {
      this.$emit("updateWithdrawAmount", BigNumber.from(0));
    },

    onUpdateWithdrawValue(value: BigNumber | null) {
      if (value === null) return this.setEmptyState();
      this.inputValue = +utils.formatUnits(value);
      this.$emit("updateWithdrawAmount", value);
    },

    onChangeWithdrawToken() {
      this.withdrawUnwrapToken = !this.withdrawUnwrapToken;
      this.$emit(
        "updateToggle",
        "withdrawUnwrapToken",
        this.withdrawUnwrapToken
      );
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    AmountRange: defineAsyncComponent(
      () => import("@/components/ui/range/AmountRange.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 16px;
}

.expected-amount {
  padding: 6px 12px;
  color: #878b93;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.42px;
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
</style>
