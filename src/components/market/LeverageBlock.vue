<template>
  <div class="range-wrap">
    <BaseTokenInput
      :value="inputAmount"
      :name="cauldron.config.mimInfo.name"
      :icon="cauldron.config.mimInfo.icon"
      :decimals="cauldron.config.mimInfo.decimals"
      :max="maxToBorrow"
      isBigNumber
      primaryMax
      @updateInputValue="onUpdateInputAmount"
    />

    <LeverageRange
      :value="multiplier"
      :max="maxLeverageMultiplier"
      :risk="positionHealth"
      :collateralValue="depositInputValue"
      tooltipText="Allows users to leverage their position. Read more about this in the documents!"
      isPotion
      @updateValue="onUpdateMultiplier"
    />
  </div>

  <DynamicElixirPotionsMultiplier
    :multiplier="multiplier"
    v-if="hasElixirPotions"
  />

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
import { formatToFixed } from "@/helpers/filters";
import { trimZeroDecimals } from "@/helpers/numbers";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { getMaxLeverageMultiplierAlternative } from "@/helpers/cauldron/getMaxLeverageMultiplier";

const MIM_DECIMALS = 18;

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
      borrowInputValue: BigNumber.from(0),
      useCustomBorrowValue: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    inputAmount() {
      if (this.useCustomBorrowValue) {
        if (this.borrowInputValue.eq(0)) return "";
        return trimZeroDecimals(
          utils.formatUnits(this.borrowInputValue, MIM_DECIMALS)
        );
      }

      const amount = this.getBorrowAmountByMultiplier(this.multiplier);

      const inputAmount = trimZeroDecimals(
        utils.formatUnits(amount, MIM_DECIMALS)
      );

      if (!Number(inputAmount)) return "";
      return inputAmount;
    },

    maxToBorrow() {
      return this.getBorrowAmountByMultiplier(this.maxLeverageMultiplier);
    },

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

    hasElixirPotions() {
      return this.cauldron.config.cauldronSettings.hasElixirPotions;
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
      this.useCustomBorrowValue = false;
      this.multiplier = value;
      this.updateLeverageAmounts();
    },

    onUpdateInputAmount(value: BigNumber) {
      this.useCustomBorrowValue = true;
      this.borrowInputValue = value;
      this.updateLeverageAmounts();
    },

    updateLeverageAmounts() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      const { oracleExchangeRate } = this.cauldron.mainParams;

      if (this.useCustomBorrowValue) {
        this.multiplier = this.calculateLeverageMultiplier(
          this.borrowInputValue,
          this.maxToBorrow,
          this.maxLeverageMultiplier
        );
      }

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
      const maxMultiplier = getMaxLeverageMultiplierAlternative(
        this.cauldron,
        //@ts-ignore
        this.depositCollateralAmount,
        //@ts-ignore
        this.slippage!
      );

      if (maxMultiplier < this.multiplier) this.multiplier = maxMultiplier;
      this.maxLeverageMultiplier = maxMultiplier;
    },

    getBorrowAmountByMultiplier(leverageMultiplier: number) {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      const { oracleExchangeRate } = this.cauldron.mainParams;

      const positionExpectedCollateral = userCollateralAmount.add(
        this.depositCollateralAmount
      );

      const multiplier = utils.parseUnits(
        String(leverageMultiplier),
        PERCENT_PRESITION
      );

      const collateralToSwap = positionExpectedCollateral
        .mul(multiplier)
        .div(expandDecimals(1, 2))
        .sub(positionExpectedCollateral);

      return expandDecimals(collateralToSwap, MIM_DECIMALS).div(
        oracleExchangeRate
      );
    },

    calculateLeverageMultiplier(
      borrowInputValue: BigNumber,
      maxToBorrow: BigNumber,
      maxLeverageMultiplier: number
    ): number {
      const borrowAmount = +utils.formatUnits(borrowInputValue, MIM_DECIMALS);
      const maxBorrowAmount = +utils.formatUnits(maxToBorrow, MIM_DECIMALS);
      const leverageMultiplier = (maxLeverageMultiplier - 1) * 100;
      const leveragePercentage = maxBorrowAmount / leverageMultiplier;
      const leverageResult = borrowAmount / leveragePercentage / 100 + 1;
      return Number(formatToFixed(String(leverageResult), 2));
    },
  },

  created() {
    this.getMaxLeverageMultiplier();
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    LeverageRange: defineAsyncComponent(
      () => import("@/components/ui/range/LeverageRange.vue")
    ),
    DynamicallyEstimatedPrice: defineAsyncComponent(
      () => import("@/components/market/DynamicallyEstimatedPrice.vue")
    ),
    DynamicElixirPotionsMultiplier: defineAsyncComponent(
      () => import("@/components/market/DynamicElixirPotionsMultiplier.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.range-wrap {
  margin: 4px 0 4px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}
</style>
