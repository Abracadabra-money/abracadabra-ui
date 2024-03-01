<template>
  <div class="stake-info">
    <LiquidityInfo :stakeInfo="stakeInfo" v-if="!mobileMode" />

    <Totals :stakeInfo="stakeInfo" :pointsStatistics="pointsStatistics" />

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
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
    pointsStatistics: {
      type: Object,
      requared: true,
    },
    mobileMode: {
      type: Boolean,
      default: false,
    },
  },

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
