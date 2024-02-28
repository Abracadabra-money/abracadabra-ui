<template>
  <div class="stake-info">
    <LiquidityInfo />

    <Totals />

    <PointsInfo />

    <CauldronItem />
  </div>
</template>

<script lang="ts">
import LiquidityInfo from "@/components/stake/earnPoints/LiquidityInfo.vue";
import Totals from "@/components/stake/earnPoints/Totals.vue";
import PointsInfo from "@/components/stake/earnPoints/PointsInfo.vue";
import CauldronItem from "@/components/stake/earnPoints/CauldronItem.vue";

export default {
  data() {
    return {};
  },

  components: { LiquidityInfo, Totals, PointsInfo, CauldronItem },
};
</script>

<style lang="scss" scoped>
.stake-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
