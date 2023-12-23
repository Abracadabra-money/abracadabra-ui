<template>
  <TokenInput
    :value="inputValue"
    :name="borrowToken.name"
    :icon="borrowToken.icon"
    :max="borrowToken.balance"
    :tokenPrice="borrowToken.price"
    isBigNumber
    @updateInputValue="updateInputValue"
  />

  <div class="range-wrap">
    <LtvRange
      :value="multiplier"
      :max="cauldron.config.mcr"
      :min="0"
      :step="1"
      :risk="'medium'"
      :collateralValue="positionLtv"
      :disabled="false"
      :mcr="cauldron.config.mcr"
      @updateValue="updateMultiplier"
    />
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { getMimToBorrowByLtv, getUserLtv } from "@/helpers/cauldron/utils";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    expectedCollateralAmount: {
      type: Object as any,
    },
    expectedBorrowAmount: {
      type: Object as any,
    },
  },

  emits: ["updateBorrowValue"],

  data() {
    return {
      multiplier: 0,
      inputValue: "" as number | string,
    };
  },

  computed: {
    borrowToken() {
      const { config, userTokensInfo } = this.cauldron;

      return {
        name: config.mimInfo.name,
        icon: config.mimInfo.icon,
        balance: userTokensInfo.mimBalance,
        price: 1,
      };
    },

    positionLtv() {
      return Math.round(
        +utils.formatUnits(
          getUserLtv(
            this.expectedCollateralAmount,
            this.expectedBorrowAmount,
            this.cauldron.mainParams.oracleExchangeRate
          ),
          2
        )
      );
    },
  },

  methods: {
    updateMultiplier(ltv: any) {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      const mimToBorrow = getMimToBorrowByLtv(
        ltv,
        this.cauldron.config.mcr,
        this.expectedCollateralAmount,
        userBorrowAmount,
        this.cauldron.mainParams.oracleExchangeRate
      );

      const borrowMimAmount = +utils.formatUnits(
        mimToBorrow.sub(userBorrowAmount)
      );

      if (borrowMimAmount <= 0) this.inputValue = 0;
      else this.inputValue = borrowMimAmount;
    },

    updateInputValue(value: any) {
      this.$emit("updateBorrowValue", value);
    },
  },

  components: {
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    LtvRange: defineAsyncComponent(
      () => import("@/components/ui/range/LtvRange.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.range-wrap {
  height: 100px;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
}
</style>
