<template>
  <TokenInput
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
      :max="10"
      :min="0"
      :step="0.1"
      :risk="'medium'"
      :collateralValue="5"
      :disabled="false"
      tooltipText="Allows users to leverage their position. Read more about this in the documents!"
      @updateValue="updateMultiplier"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  data() {
    return {
      multiplier: 0,
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
  },

  methods: {
    updateMultiplier(value: any) {
      this.multiplier = value;
    },

    updateInputValue(value: any) {
      this.$emit("updateBorrowValues", value);
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
