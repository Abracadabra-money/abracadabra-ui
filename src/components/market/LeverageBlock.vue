<template>
  <div class="range-wrap">
    <BaseTokenInput
      :value="borrowInputAmount"
      :name="cauldron.config.mimInfo.name"
      :icon="cauldron.config.mimInfo.icon"
      :decimals="cauldron.config.mimInfo.decimals"
      :max="maxToBorrow"
      isBigNumber
      primaryMax
      @updateInputValue="onUpdateBorrowInputAmount"
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

  <DynamicPillsMultiplier :multiplier="multiplier" v-if="hasPillsPotions" />

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
import {
  getBorrowAmountByMultiplier,
  getMaxLeverageMultiplierAlternative,
  getLeverageMultiplierByBorrowAmount,
} from "@/helpers/cauldron/getMaxLeverageMultiplier";
import { mapGetters } from "vuex";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { formatToFixed } from "@/helpers/filters";
import { trimZeroDecimals } from "@/helpers/numbers";
import { applySlippageToMinOut } from "@/helpers/gm/applySlippageToMinOut";

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

  emits: ["updateLeverageAmounts", "updateMaxToBorrow"],

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
      maxToBorrow: BigNumber.from(0),
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    borrowInputAmount() {
      if (this.useCustomBorrowValue) {
        if (this.borrowInputValue.eq(0)) return "";
        return trimZeroDecimals(
          utils.formatUnits(this.borrowInputValue, MIM_DECIMALS)
        );
      }

      const amount = getBorrowAmountByMultiplier(
        this.multiplier,
        this.cauldron,
        this.depositCollateralAmount!
      );

      const borrowInputAmount = trimZeroDecimals(
        utils.formatUnits(amount, MIM_DECIMALS)
      );

      if (!Number(borrowInputAmount)) return "";
      return borrowInputAmount;
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

    hasPillsPotions() {
      return this.cauldron.config.cauldronSettings.isUSD0;
    },
  },

  watch: {
    depositCollateralAmount() {
      this.getMaxLeverageMultiplier();
      this.getMaxBorrowAmount();
      this.updateLeverageAmounts();
    },

    slippage() {
      this.getMaxLeverageMultiplier();
      this.updateLeverageAmounts();
    },

    borrowInputAmount() {
      const borrowInputAmount = utils.parseUnits(
        this.borrowInputAmount || "0",
        MIM_DECIMALS
      );

      const leverageAmounts = {
        amountFrom: borrowInputAmount,
        amountToMin: applySlippageToMinOut(
          Number(this.slippage),
          borrowInputAmount
        ),
      };

      this.$emit("updateLeverageAmounts", leverageAmounts);
    },
  },

  methods: {
    onUpdateMultiplier(value: number) {
      this.useCustomBorrowValue = false;
      this.multiplier = value;
      this.updateLeverageAmounts();
    },

    onUpdateBorrowInputAmount(value: BigNumber) {
      this.useCustomBorrowValue = true;
      this.borrowInputValue = value;
      this.updateLeverageAmounts();
    },

    updateLeverageAmounts() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      const { oracleExchangeRate } = this.cauldron.mainParams;

      if (this.useCustomBorrowValue) {
        const multiplier = getLeverageMultiplierByBorrowAmount(
          this.borrowInputValue,
          this.maxToBorrow,
          this.maxLeverageMultiplier
        );

        this.multiplier = Number(
          formatToFixed(String(utils.formatUnits(multiplier, MIM_DECIMALS)), 2)
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

    getMaxBorrowAmount() {
      if (!this.depositCollateralAmount?.isZero)
        this.maxToBorrow = BigNumber.from(0);
      else {
        this.maxToBorrow = getBorrowAmountByMultiplier(
          this.maxLeverageMultiplier,
          this.cauldron,
          this.depositCollateralAmount!
        );
      }

      this.$emit("updateMaxToBorrow", this.maxToBorrow);
    },
  },

  created() {
    this.getMaxLeverageMultiplier();
    this.getMaxBorrowAmount();
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
    DynamicPillsMultiplier: defineAsyncComponent(
      () => import("@/components/market/DynamicPillsMultiplier.vue")
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
