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
          deprecated
          :data="stakeInfo.mezzanine"
          :apy="stakeInfo.tranchesStatistics.mezzanineApy"
          :rewards="stakeInfo.tranchesStatistics.mezzanineTotalRewardsUsd"
        />
      </div>

      <div class="row">
        <TrancheStatisticsItem
          deprecated
          :data="stakeInfo.junior"
          :apy="stakeInfo.tranchesStatistics.juniorApy"
          :rewards="stakeInfo.tranchesStatistics.juniorTotalRewardsUsd"
        />

        <div class="info-wrap">
          <div class="info-item">
            <h4 class="info-title">
              Total rewards earned
              <TooltipIcon
                :width="20"
                :height="20"
                fill="#878B93"
                tooltip="Total Amount of Rewards Autocompounded back into the vault."
              />
            </h4>

            <div class="reward-wrap">
              <img
                class="reward-icon"
                :src="stakeInfo.senior.stakeToken.icon"
                alt="Reward token icon"
              />
              <span>
                {{
                  formatTokenBalance(
                    stakeInfo.tranchesStatistics.totalRewardsUsd
                  )
                }}
                LVL</span
              >
            </div>
          </div>
          <div class="info-item">
            <h4 class="info-title">
              Total Supply
              <TooltipIcon
                :width="20"
                :height="20"
                fill="#878B93"
                tooltip="Total Amount of Staked Assets."
              />
            </h4>
            <div class="reward-wrap">
              {{ formatUSD(stakeInfo.tranchesStatistics.totalSupplyUsd) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    stakeInfo: {
      type: Object as any,
    },
  },
  methods: {
    formatTokenBalance,

    formatUSD(value: any, decimals = 18) {
      return formatUSD(formatUnits(value, decimals));
    },
  },

  components: {
    TrancheStatisticsItem: defineAsyncComponent(
      () => import("@/components/stake/magicLvl/TrancheStatisticsItem.vue")
    ),
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
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
  justify-content: space-between;
  align-items: stretch;
}

.info-wrap {
  width: 100%;
  gap: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-item {
  width: 100%;
  padding: 11px 24px;
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

.info-title {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #99a0b2;
  font-weight: 500;
  line-height: 150%;
  margin-bottom: 8px;
}

.reward-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reward-icon {
  width: 32px;
  height: 32px;
}

@media screen and (max-width: 1200px) {
  .info-title {
    font-size: 15px;
  }
}

@media screen and (max-width: 600px) {
  .row {
    flex-direction: column;
  }
}
</style>
