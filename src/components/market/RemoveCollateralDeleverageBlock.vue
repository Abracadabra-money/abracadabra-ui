<template>
  <div>
    <BaseTokenInput
      :value="inputAmount"
      :name="cauldron.config.name"
      :icon="cauldron.config.icon"
      :decimals="cauldron.config.collateralInfo.decimals"
      :max="maxToRemove"
      isBigNumber
      primaryMax
      @updateInputValue="onUpdateWithdrawValue"
    />

    <div class="expected-amount" v-if="isWrapAllowed && withdrawUnwrapToken">
      <span> Expected</span>
      <span>
        {{ expectedTokenAmount }}
        {{ cauldron.config.wrapInfo?.unwrappedToken.name }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  getLiquidationPrice,
  PERCENT_PRESITION,
  getMaxCollateralToRemove,
} from "@/helpers/cauldron/utils";
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { formatToFixed } from "@/helpers/filters";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { trimZeroDecimals } from "@/helpers/numbers";
import type { CauldronInfo } from "@/helpers/cauldron/types";

export default {
  props: {
    cauldron: {
      type: Object as PropType<CauldronInfo>,
      required: true,
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
      default: BigNumber.from(0),
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
    inputAmount() {
      if (this.withdrawAmount.eq(BigNumber.from(0))) {
        return "";
      }

      return trimZeroDecimals(
        utils.formatUnits(
          this.withdrawAmount,
          this.cauldron.config.collateralInfo.decimals
        )
      );
    },

    maxToRemove() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      const { oracleExchangeRate } = this.cauldron.mainParams;
      //@ts-ignore
      const { amountFrom } = this.deleverageAmounts;

      const mcr = expandDecimals(this.cauldron.config.mcr, PERCENT_PRESITION);

      // after swap
      let expectedCollateralAmount = userCollateralAmount
        .sub(amountFrom)
        .lt(BigNumber.from(0))
        ? BigNumber.from(0)
        : userCollateralAmount.sub(amountFrom);

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
      if (this.isWithdrawUnwrapToken)
        return formatToFixed(this.inputValue, this.rangePrecision);
      else
        return formatToFixed(
          this.inputValue *
            Number(utils.formatUnits(this.cauldron.additionalInfo.tokensRate)),
          this.rangePrecision
        );
    },

    rangePrecision() {
      const price = 100000;
      const { decimals } = this.cauldron.config.collateralInfo;
      const { collateralPrice } = this.cauldron.mainParams.alternativeData;
      return Number(formatUnits(collateralPrice, decimals)) > price ? 6 : 4;
    },
  },

  watch: {
    useDeleverage() {
      this.inputValue = 0;
    },
  },

  methods: {
    setEmptyState() {
      this.$emit("updateWithdrawAmount", BigNumber.from(0));
    },

    onUpdateWithdrawValue(value: BigNumber) {
      if (value === null) return this.setEmptyState();
      this.inputValue = Number(utils.formatUnits(value));
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
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
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
  margin-top: 20px;
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
