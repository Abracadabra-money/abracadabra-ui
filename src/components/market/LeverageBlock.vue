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

  <!-- <DynamicallyEstimatedPrice
    v-if="chainId !== 2222"
    :amount="formatUnits(expectedBorrowAmount)"
    :mimAddress="cauldron.config.mimInfo.address"
  /> -->
</template>

<script lang="ts">
import {
  getLeverageAmounts,
  getLiquidationPrice,
  getPositionHealth,
  applyBorrowFee,
  PERCENT_PRESITION
} from "@/helpers/cauldron/utils";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { mapGetters } from "vuex";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier";

export default {
  props: {
    depositCollateralAmount: {
      type: BigNumber,
    },
    leverageAmounts: {},
    cauldron: {
      type: Object as any,
    },
  },

  emits: ["updateLeverageAmounts"],

  data() {
    return {
      slippage: 1,
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
    depositCollateralAmount(value) {
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
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const multiplier = utils.parseUnits(String(this.multiplier), PERCENT_PRESITION);
      const slippage = utils.parseUnits(String(this.slippage), PERCENT_PRESITION);

      const leverageAmounts = getLeverageAmounts(
        //@ts-ignore
        this.depositCollateralAmount,
        multiplier,
        slippage,
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
      const maxMultiplier = getMaxLeverageMultiplier(
        this.cauldron,
        //@ts-ignore
        depositCollateralAmount > 0 ? depositCollateralAmount : undefined
      );
      
      if (maxMultiplier < this.multiplier) this.multiplier = maxMultiplier;
      this.maxLeverageMultiplier = maxMultiplier;
    },
  },

  created() {
    this.getMaxLeverageMultiplier();
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    LeverageRange: defineAsyncComponent(
      () => import("@/components/ui/range/LeverageRange.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    DynamicallyEstimatedPrice: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/market/DynamicallyEstimatedPrice.vue")
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
  min-height: 190px;
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 390px;
  justify-content: space-between;
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 16px;
}

.range-wrap {
  margin-bottom: 16px;
}
</style>
