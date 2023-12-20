<template>
  <div class="market-view">
    <img class="bg-top" src="@/assets/images/market/bg-top.png" alt="" />
    <img class="bg-bottom" src="@/assets/images/market/bg-bottom.png" alt="" />
    <MarketHead />

    <div class="market-info">
      <MarketActions />
      <MarketStats />
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
    MarketActions: defineAsyncComponent(
      () => import("@/components/market/MarketActions.vue")
    ),
    MarketStats: defineAsyncComponent(
      () => import("@/components/market/MarketStats.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-view {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: linear-gradient(
    291deg,
    #102649 -26.37%,
    #0c0f1c 40.92%,
    #131728 62.83%,
    #212555 123.87%
  );
}

.bg-top {
  position: absolute;
  top: 145px;
  left: 0;
}

.bg-bottom {
  position: absolute;
  top: 94vh;
  right: 70px;
}

.market-info {
  max-width: 1310px;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
}
</style>
