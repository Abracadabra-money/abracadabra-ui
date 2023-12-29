<template>
  <div>
    <AmountRange
      :amount="deleverageAmounts.amountToMin"
      :maxAmount="maxToRepay"
      :risk="positionHealth"
      @updateAmount="onUpdateInputAmount"
    />

    <div class="dynamic-wrap">
      <DynamicFee
        v-if="cauldron.config.chainId !== 2222"
        :isClose="true"
        :amount="deleverageAmounts.amountToMin"
        :mimAddress="cauldron.config.mimInfo.address"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";

import {
  getLiquidationPrice,
  getPositionHealth,
  getDeleverageAmounts,
  PERCENT_PRESITION,
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

  emits: ["updateDeleverageAmounts"],

  data() {
    return { slippage: 1 };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    maxToRepay() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { mimBalance } = this.cauldron.userTokensInfo;
      const maxToRepay = userBorrowAmount.gt(mimBalance)
        ? mimBalance
        : userBorrowAmount;

      return maxToRepay;
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      const { amountToMin } = this.deleverageAmounts;

      const expectedBorrowAmount = userBorrowAmount.sub(amountToMin);

      return expectedBorrowAmount.lt(0)
        ? BigNumber.from(0)
        : expectedBorrowAmount;
    },

    expectedCollateralAmount() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
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

  methods: {
    onUpdateInputAmount(value: BigNumber) {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const slippage = utils.parseUnits(
        String(this.slippage),
        PERCENT_PRESITION
      );

      const deleverageAmounts = getDeleverageAmounts(
        value,
        slippage,
        oracleExchangeRate
      );

      this.$emit("updateDeleverageAmounts", deleverageAmounts);
    },
  },

  components: {
    AmountRange: defineAsyncComponent(
      () => import("@/components/ui/range/AmountRange.vue")
    ),
    DynamicFee: defineAsyncComponent(
      () => import("@/components/market/DynamicFee.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dynamic-wrap {
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  padding: 5px 12px;
}
</style>
