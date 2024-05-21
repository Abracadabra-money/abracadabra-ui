<template>
  <div class="apr-efficiency">
    <EfficiencyIndicator
      :aprEfficiency="aprEfficiency"
      :apr="userApr"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />

    <div class="efficiency-info">
      <div class="efficiency-title">
        APR Efficiency
        <Tooltip :width="20" :height="20" />
      </div>

      <p class="efficiency-description">{{ efficiencyDescription }}</p>

      <BaseButton @click="$emit('chooseLockAction')">Go to Lock</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";

export default {
  emits: ["chooseLockAction"],

  props: {
    mimSavingRateInfo: { type: Object },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    efficiencyDescription() {
      return "Lock your Staked MIM for 3 months to get maximum APR Efficiency ";
    },

    baseApr() {
      return this.mimSavingRateInfo!.baseApr;
    },

    boostedApr() {
      return this.baseApr * 3;
    },

    userApr() {
      if (this.isMimSavingRateInfoLoading) return 0;

      const { unlocked, locked } = this.mimSavingRateInfo!.userInfo.balances;
      const decimals = this.mimSavingRateInfo!.stakingToken.decimals;

      const formattedStaked = Number(formatUnits(unlocked, decimals));
      const formattedLocked = Number(formatUnits(locked, decimals));

      return (
        (formattedStaked * this.baseApr + formattedLocked * this.boostedApr) /
          (formattedStaked + formattedLocked) || 0
      );
    },

    aprEfficiency() {
      if (this.isMimSavingRateInfoLoading) return 0;

      return (this.userApr * 100) / (this.boostedApr - this.baseApr) || 0;
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    EfficiencyIndicator: defineAsyncComponent(
      () => import("@/components/msr/apr-efficiency/EfficiencyIndicator.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.title-tooltip {
  display: flex;
  align-items: center;
}

.apr-efficiency {
  display: flex;
  justify-content: space-between;
  gap: 21px;
}

.efficiency-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.efficiency-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.efficiency-description {
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

.default-button {
  padding: 9px 24px !important;
  height: 39px !important;
  border-radius: 10px !important;
}

@media (max-width: 500px) {
  .apr-efficiency {
    flex-direction: column;
  }
}
</style>
