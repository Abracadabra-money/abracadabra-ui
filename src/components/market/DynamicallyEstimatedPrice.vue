<template>
  <div class="dynamic-wrap">
    <DynamicFee
      v-if="cauldron.config.chainId !== 2222"
      :amount="amount"
      :isClose="isClose"
      :mimAddress="cauldron.config.mimInfo.address"
    />

    <GmPriceImpact />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    amount: {},
    isClose: {
      type: Boolean,
      default: false,
    },
  },

  components: {
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
