<template>
  <div class="dynamic-wrap">
    <DynamicFee
      v-if="hideDynamicFee"
      :amount="amount"
      :isClose="isClose"
      :mimAddress="cauldron.config.mimInfo.address"
    />

    <DynamicApr :cauldron="cauldron" :multiplier="multiplier" />

    <GmPriceImpact
      v-if="cauldron.config.cauldronSettings.isGMXMarket"
      :cauldronObject="cauldron"
      :amount="amount"
      :actionType="1"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { BigNumber } from "ethers";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    multiplier: {
      type: Number,
    },
    amount: {
      default: BigNumber.from(0),
    },
    isClose: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    hideDynamicFee() {
      const disabledChains = [2222, 80085];

      return disabledChains.indexOf(this.cauldron.config.chainId) !== -1;
    },
  },

  components: {
    DynamicFee: defineAsyncComponent(
      () => import("@/components/market/DynamicFee.vue")
    ),
    DynamicApr: defineAsyncComponent(
      () => import("@/components/market/DynamicApr.vue")
    ),
    GmPriceImpact: defineAsyncComponent(
      () => import("@/components/market/GmPriceImpact.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dynamic-wrap {
  display: flex;
  padding: 5px 12px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}
</style>
