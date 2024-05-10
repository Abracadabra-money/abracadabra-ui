<template>
  <div class="total-info-wrap">
    <div class="tag">
      <img class="mim-icon" src="@/assets/images/market/m-icon.svg" />
      <span class="title">Total {{ totalDepositedInfo.title }}:</span>
      <span class="value">
        <BaseTokenIcon
          :icon="mimSavingRateInfo?.stakingToken.icon"
          :name="mimSavingRateInfo?.stakingToken.name"
          size="24px"
        />
        {{ formatTokenBalance(totalDepositedInfo.value) }}</span
      >
    </div>

    <div class="tag">
      <img class="mim-icon" src="@/assets/images/market/m-icon.svg" />
      <span class="title">APR:</span>
      <span class="value">{{ formatPercent(totalDepositedInfo.apr) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import type { PropType } from "vue";
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { formatTokenBalance, formatPercent } from "@/helpers/filters";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import type { MSRActionName } from "@/views/MimSavingRate.vue";

export default {
  props: {
    mimSavingRateInfo: { type: Object as PropType<MimSavingRateInfo | null> },
    activeTabItem: { type: String as PropType<MSRActionName> },
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

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
    formatTokenBalance,
    formatPercent,
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.total-info-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
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
  min-width: 174px;
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

.value {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
}

.mim-icon {
  position: absolute;
  top: 16.84px;
  left: 0;
}

@media (max-width: 760px) {
  .total-info-wrap {
    bottom: 20px;
    font-size: 14px;
    font-weight: 400;
  }

  .tag {
    width: 100%;
  }
}
</style>
