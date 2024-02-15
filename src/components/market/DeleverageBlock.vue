<template>
  <div>
    <AmountRange
      :amount="deleverageAmounts.amountToMin"
      :maxAmount="maxToRepay"
      :risk="positionHealth"
      @updateAmount="onUpdateInputAmount"
    />

    <div class="dynamic-wrap" v-if="showDynamicBlock">
      <DynamicFee
        v-if="!hideDynamicFee"
        :isClose="true"
        :amount="deleverageAmounts.amountToMin"
        :mimAddress="cauldron.config.mimInfo.address"
        :chainId="cauldron.config.chainId"
      />

      <GmPriceImpact
        v-if="cauldron.config.cauldronSettings.isGMXMarket"
        :cauldronObject="cauldron"
        :amount="deleverageAmounts.amountFrom"
        :actionType="2"
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
    slippage: {
      type: BigNumber,
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

  data() {
    return {
      value: BigNumber.from(0),
    };
  },

  emits: ["updateDeleverageAmounts"],

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    showDynamicBlock() {
      return (
        !this.hideDynamicFee ||
        this.cauldron.config.cauldronSettings.isGMXMarket
      );
    },

    hideDynamicFee() {
      const disabledChains = [2222, 80085];

      return disabledChains.indexOf(this.cauldron.config.chainId) !== -1;
    },

    maxToRepay() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      return userBorrowAmount;
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

  watch: {
    slippage() {
      this.updateDeleverageAmounts(this.value);
    },
  },

  methods: {
    onUpdateInputAmount(value: BigNumber) {
      this.value = value;
      this.updateDeleverageAmounts(value);
    },
    updateDeleverageAmounts(value: BigNumber) {
      const { oracleExchangeRate } = this.cauldron.mainParams;

      const deleverageAmounts = getDeleverageAmounts(
        value,
        this.slippage!,
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
    GmPriceImpact: defineAsyncComponent(
      () => import("@/components/market/GmPriceImpact.vue")
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
