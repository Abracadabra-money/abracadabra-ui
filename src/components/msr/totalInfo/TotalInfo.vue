<template>
  <div class="total-info-wrap">
    <div class="tag total">
      <img class="mim-icon" src="@/assets/images/market/m-icon.svg" />
      <span class="title">Total {{ totalDepositedInfo.title }}</span>
      <RowSkeleton v-if="isMimSavingRateInfoLoading && !mimSavingRateInfo" />
      <span class="value" v-else>
        <BaseTokenIcon
          :icon="mimSavingRateInfo?.stakingToken.icon"
          :name="mimSavingRateInfo?.stakingToken.name"
          size="24px"
        />
        {{ formatLargeSum(totalDepositedInfo.value) }}</span
      >
    </div>

    <div class="tag apr">
      <img class="mim-icon" src="@/assets/images/market/m-icon.svg" />
      <span class="title">APR</span>
      <RowSkeleton v-if="isMimSavingRateInfoLoading && !mimSavingRateInfo" />
      <span class="value" v-else>{{
        formatPercent(totalDepositedInfo.apr)
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import type { PropType } from "vue";
import { formatUnits } from "viem";
import { formatLargeSum, formatPercent } from "@/helpers/filters";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import type { MSRActionName } from "@/views/MimSavingRate.vue";

export default {
  props: {
    mimSavingRateInfo: { type: Object as PropType<MimSavingRateInfo | null> },
    activeTabItem: { type: String as PropType<MSRActionName> },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    totalDepositedInfo() {
      if (!this.mimSavingRateInfo?.userInfo)
        return {
          value: "",
          apr: "",
          title: "",
        };

      const baseApr = this.mimSavingRateInfo?.baseApr || 0;
      const decimals = this.mimSavingRateInfo.stakingToken.decimals;

      switch (this.activeTabItem) {
        case "Stake":
          return {
            value: formatUnits(this.mimSavingRateInfo.unlockedSupply, decimals),
            apr: baseApr,
            title: "Staked",
          };
        case "Lock":
          return {
            value: formatUnits(this.mimSavingRateInfo.lockedSupply, decimals),
            apr: baseApr * 3,
            title: "Locked",
          };
      }

      return {
        value: "",
        apr: "",
        title: "Claimed",
      };
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
.total-info-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
}

.tag {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  text-align: center;
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

.total {
  width: 243px;
}

.apr {
  width: 174px;
}

.title {
  color: #99a0b2;
  font-size: 16px;
  font-weight: 500;
}

.value {
  display: inline-flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
}

.mim-icon {
  position: absolute;
  top: 16.84px;
  left: 0;
}

.row-skeleton {
  height: 24px !important;
}

@media (max-width: 760px) {
  .total-info-wrap {
    justify-content: center;
    bottom: 20px;
    width: 100%;
    font-size: 14px;
    font-weight: 400;
  }

  .total {
    max-width: 224px;
  }

  .apr {
    max-width: 103px;
  }
}
</style>
