<template>
  <div>
    <h3 class="title">Remove collateral</h3>
    <h4 class="subtitle">Choose the amount of collateral you want to remove</h4>

    <AmountRange
      :amount="withdrawAmount"
      :maxAmount="maxToRemove"
      :risk="positionHealth"
      @updateAmount="onUpdateWithdrawValue"
    />

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
  </div>
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";

import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { trimZeroDecimals } from "@/helpers/numbers";

import {
  getLiquidationPrice,
  getPositionHealth,
  PERCENT_PRESITION,
  getMaxCollateralToRemove,
} from "@/helpers/cauldron/utils";

export default {
  props: {
    cauldron: {
      type: Object as any,
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

  emits: ["updateWithdrawAmount"],

  data() {
    return { slippage: 1, inputValue: 0 };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    inputAmount() {
      const withdrawAmount = this.withdrawAmount
        ? this.withdrawAmount
        : BigNumber.from(0);

      if (withdrawAmount!.eq(BigNumber.from(0))) {
        return "";
      }

      return trimZeroDecimals(
        utils.formatUnits(
          withdrawAmount,
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
  },

  watch: {
    inputAmpunt(value) {
      if (value.eq(0)) {
        this.inputValue = 0;
        return false;
      }

      this.inputValue = Number(utils.formatUnits(value));
    },
  },

  methods: {
    setEmptyState() {
      this.$emit("updateWithdrawAmount", BigNumber.from(0));
    },

    onUpdateWithdrawValue(value: BigNumber | null) {
      if (value === null) return this.setEmptyState();
      this.$emit("updateWithdrawAmount", value);
    },
  },

  components: {
    AmountRange: defineAsyncComponent(
      () => import("@/components/ui/range/AmountRange.vue")
    ),

    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
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
</style>
