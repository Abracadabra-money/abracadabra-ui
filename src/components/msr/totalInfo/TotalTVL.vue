<template>
  <div class="tvl-card">
    <div class="total-tvl">
      <h4 class="tvl-card-title">Mim Saving Rate TVL</h4>
      <div class="tvl-card-value">
        <BaseTokenIcon :icon="icon" size="24px" />
        <RowSkeleton v-if="isMimSavingRateInfoLoading" />
        <span class="total-tvl-value" v-else>
          {{ formatLargeSum(totalTvl) }}
        </span>
      </div>
    </div>

    <div class="line"></div>

    <ul class="tvl-by-action">
      <li class="action-tvl staked">
        Staked
        <RowSkeleton v-if="isMimSavingRateInfoLoading" />
        <span class="action-tvl-value" v-else>
          {{ formatLargeSum(stakedTvl) }}
        </span>
      </li>
      <li class="action-tvl locked">
        Locked
        <RowSkeleton v-if="isMimSavingRateInfoLoading" />
        <span class="action-tvl-value" v-else>
          {{ formatLargeSum(lockedTvl) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import type { PropType } from "vue";
import { formatLargeSum, formatPercent } from "@/helpers/filters";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { formatUnits } from "viem";

export default {
  props: {
    mimSavingRateInfo: { type: Object as PropType<MimSavingRateInfo | null> },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    totalTvl() {
      return formatUnits(
        this.mimSavingRateInfo?.totalSupply || 0n,
        this.decimals
      );
    },

    stakedTvl() {
      return formatUnits(
        this.mimSavingRateInfo?.unlockedSupply || 0n,
        this.decimals
      );
    },

    lockedTvl() {
      return formatUnits(
        this.mimSavingRateInfo?.lockedSupply || 0n,
        this.decimals
      );
    },

    decimals() {
      return this.mimSavingRateInfo?.stakingToken.decimals || 18;
    },

    icon() {
      return this.mimSavingRateInfo?.stakingToken.icon || "";
    },
  },

  methods: {
    formatLargeSum,
    formatPercent,
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tvl-card {
  align-self: center;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 35px;
  border-radius: 16px;
  border: 1px solid #00296b;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  background: url("@/assets/images/farm/reward-card-background.png"),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  background-repeat: no-repeat;
  background-position: 0 16px;
  min-width: 335px;
}

.tvl-card-title {
  color: #99a0b2;
  text-align: center;
  font-weight: 500;
}

.total-tvl {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tvl-card-value {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
  line-height: normal;
}

.total-tvl-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 28px;
  font-weight: 500;
  line-height: 0;
}

.action-tvl-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.line {
  width: 1px;
  height: 66px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.12) 46%,
    rgba(255, 255, 255, 0) 100%
  );
}

.tvl-by-action {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
}

.action-tvl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 1000px) {
  .tvl-card {
    display: flex;
    flex-direction: column;
    justify-self: center;
    width: calc(100% - 32px);
    min-width: auto;
  }

  .line {
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.12) 46%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .tvl-by-action {
    width: 100%;
  }
}
</style>
