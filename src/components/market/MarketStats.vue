<template>
  <div class="market-stats">
    <div class="row">
      <div
        style="
          height: 48px;
          width: 215px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(16, 18, 23, 0.38);
        "
      ></div>
      <PriceRange />
    </div>

    <div class="row">
      <PositionInfo />
      <CauldronInfo />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    PriceRange: defineAsyncComponent(
      () => import("@/components/ui/range/PriceRange.vue")
    ),
    PositionInfo: defineAsyncComponent(
      () => import("@/components/market/PositionInfo.vue")
    ),
    CauldronInfo: defineAsyncComponent(
      () => import("@/components/market/CauldronInfo.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-stats {
  @include font;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.cauldron-info {
  max-width: 410px;
  padding: 24px;
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  align-self: stretch;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}
</style>
