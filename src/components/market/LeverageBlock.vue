<template>
  <div class="range-wrap">
    <LeverageRange
      :value="multiplier"
      :max="maxLeverageMultiplier"
      :risk="positionHealth"
      :collateralValue="depositInputValue"
      tooltipText="Allows users to leverage their position. Read more about this in the documents!"
      @updateValue="onUpdateMultiplier"
    />
  </div>

  <DynamicallyEstimatedPrice
    :multiplier="multiplier"
    :cauldron="cauldron"
    :amount="leverageAmounts.amountFrom"
  />
</template>

<script lang="ts">
import {
  getLeverageAmounts,
  getLiquidationPrice,
  getPositionHealth,
  applyBorrowFee,
  PERCENT_PRESITION,
} from "@/helpers/cauldron/utils";
import { mapGetters } from "vuex";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier";

export default {
  props: {
    slippage: {
      type: BigNumber,
    },
    depositCollateralAmount: {
      type: BigNumber,
    },
    leverageAmounts: {
      default: {
        amountFrom: BigNumber.from(0),
        amountToMin: BigNumber.from(0),
      },
    },
    cauldron: {
      type: Object as any,
    },
  },

  emits: ["updateLeverageAmounts"],

  data() {
    return {
      multiplier: 1,
      useNativeToken: false,
      useUnwrapToken: false,
      depositInputValue: "",
      maxLeverageMultiplier: 5,
      amounts: {
        deposit: {
          collateralTokenAmount: BigNumber.from(0),
          unwrapTokenAmount: BigNumber.from(0),
          minToSwap: BigNumber.from(0),
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

    expectedCollateralAmount() {
      return this.cauldron.userPosition.collateralInfo.userCollateralAmount
        .add(
          //@ts-ignore
          this.leverageAmounts.amountToMin
        )
        .add(this.depositCollateralAmount);
    },

    expectedBorrowAmount() {
      const { borrowFee } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      return applyBorrowFee(
        //@ts-ignore
        this.leverageAmounts.amountFrom,
        borrowFee * 1000
      ).add(userBorrowAmount);
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
    depositCollateralAmount() {
      this.getMaxLeverageMultiplier();
      this.updateLeverageAmounts();
    },
    slippage() {
      this.getMaxLeverageMultiplier();
      this.updateLeverageAmounts();
    },
  },

  methods: {
    onUpdateMultiplier(value: number) {
      this.multiplier = value;
      this.updateLeverageAmounts();
    },

    updateLeverageAmounts() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      const { oracleExchangeRate } = this.cauldron.mainParams;
      const multiplier = utils.parseUnits(
        String(this.multiplier),
        PERCENT_PRESITION
      );

      const positionExpectedCollateral = userCollateralAmount.add(
        this.depositCollateralAmount
      );

      const leverageAmounts = getLeverageAmounts(
        //@ts-ignore
        positionExpectedCollateral,
        multiplier,
        //@ts-ignore
        this.slippage,
        oracleExchangeRate
      );

      this.$emit("updateLeverageAmounts", leverageAmounts);
    },

    getMaxLeverageMultiplier() {
      const { decimals } = this.cauldron.config.collateralInfo;

      const depositCollateralAmount = Number(
        //@ts-ignore
        utils.formatUnits(this.depositCollateralAmount, decimals)
      );

      const slippage = utils.formatUnits(this.slippage!, PERCENT_PRESITION);

      const maxMultiplier = getMaxLeverageMultiplier(
        this.cauldron,
        //@ts-ignore
        depositCollateralAmount > 0 ? depositCollateralAmount : undefined,
        false,
        Number(slippage)
      );

      if (maxMultiplier < this.multiplier) this.multiplier = maxMultiplier;
      this.maxLeverageMultiplier = maxMultiplier;
    },
  },

  created() {
    this.getMaxLeverageMultiplier();
  },

  components: {
    LeverageRange: defineAsyncComponent(
      () => import("@/components/ui/range/LeverageRange.vue")
    ),
    DynamicallyEstimatedPrice: defineAsyncComponent(
      () => import("@/components/market/DynamicallyEstimatedPrice.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.range-wrap {
  margin-bottom: 16px;
}
</style>
