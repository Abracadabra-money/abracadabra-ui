<template>
  <div class="reward-info-wrap">
    <img class="mim-icon" src="@/assets/images/market/m-icon.svg" />

    <span class="title">Epoch’s total rewards</span>

    <RowSkeleton v-if="isMimSavingRateInfoLoading && !mimSavingRateInfo" />
    <div class="reward-tokens" v-else>
      <div
        class="token-info"
        v-for="(
          { name, icon, decimals, epochReward }, index
        ) in rewardsForEpoch"
        :key="index"
      >
        <BaseTokenIcon :name="name" :icon="icon" size="32px" />
        {{ formatLargeSum(epochReward, decimals) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import type { PropType } from "vue";
import { formatLargeSum } from "@/helpers/filters";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { formatUnits } from "viem";

export default {
  props: {
    mimSavingRateInfo: { type: Object as PropType<MimSavingRateInfo | null> },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    rewardsForEpoch() {
      const rewardsPerToken = this.mimSavingRateInfo?.rewardsPerToken || [];
      return this.mimSavingRateInfo?.rewardTokens.map((rewardToken, index) => {
        return {
          ...rewardToken,
          epochReward: rewardsPerToken[index].rewardsForDuration || 0n,
        };
      });
    },
  },

  methods: {
    formatLargeSum(value: bigint, decimals: number) {
      return formatLargeSum(formatUnits(value, decimals));
    },
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
.reward-info-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
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

.title {
  color: #99a0b2;
  font-size: 16px;
  font-weight: 500;
}

.reward-tokens {
  display: flex;
  align-items: center;
  gap: 32px;
}

.token-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 20px;
  font-weight: 500;
}

.token-icon {
  margin-right: 0 !important;
}

.mim-icon {
  position: absolute;
  top: 16.84px;
  left: 0;
}

.row-skeleton {
  height: 32px !important;
}

@media (max-width: 760px) {
  .reward-tokens {
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .token-info {
    font-size: 18px;
  }
}
</style>
