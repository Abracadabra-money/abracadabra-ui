<template>
  <div class="tranche-statistics">
    <h3 class="title">Tranche statistics</h3>

    <div class="wrapper">
      <div class="row">
        <TrancheStatisticsItem
          :data="stakeInfo.senior"
          :apy="stakeInfo.tranchesStatistics.seniorApy"
          :rewards="stakeInfo.tranchesStatistics.seniorTotalRewardsUsd"
        />

        <TrancheStatisticsItem
          :data="stakeInfo.mezzanine"
          :apy="stakeInfo.tranchesStatistics.mezzanineApy"
          :rewards="stakeInfo.tranchesStatistics.mezzanineTotalRewardsUsd"
        />
      </div>

      <div class="row">
        <TrancheStatisticsItem
          :data="stakeInfo.junior"
          :apy="stakeInfo.tranchesStatistics.juniorApy"
          :rewards="stakeInfo.tranchesStatistics.juniorTotalRewardsUsd"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    stakeInfo: {
      type: Array as any,
    },
  },

  components: {
    TrancheStatisticsItem: defineAsyncComponent(
      () => import("@/components/stake_new/magicLvl/TrancheStatisticsItem.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tranche-statistics {
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title {
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
  margin-bottom: 16px;
}

.wrapper {
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.row {
  width: 100%;
  gap: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
