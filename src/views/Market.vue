<template>
  <div class="market-view">
    <MarketHead />

    <div class="market-info">
      <div class="market-actions"></div>
      <div class="market-stats"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    MarketHead: defineAsyncComponent(
      () => import("@/components/market/MarketHead.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-view {
  padding: 100px 0;
}
</style>
