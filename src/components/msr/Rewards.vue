<template>
  <div class="rewards-wrap">
    <div class="rewards-fraction">
      <div class="title">
        Reward earned <Tooltip :width="20" :height="20" />
      </div>

      <div class="token-values">
        <div class="token-value-wrap">
          <BaseTokenIcon
            :icon="token0Rewards.icon"
            :name="token0Rewards.name"
            size="20px"
          />
          {{ token0Rewards.total }}
        </div>
        \
        <div class="token-value-wrap">
          <BaseTokenIcon
            :icon="token1Rewards.icon"
            :name="token1Rewards.name"
            size="20px"
          />
          {{ token1Rewards.total }}
        </div>
      </div>
    </div>

    <div class="rewards-fraction">
      <div class="title">
        Vesting <Tooltip :width="20" :height="20" />
        <span class="claim-timing">
          Will become claimable on
          <span class="time"> {{ nextUnlockTime }} UTC</span>
        </span>
      </div>

      <div class="token-values">
        <div class="token-value-wrap">
          <BaseTokenIcon
            :icon="token0Rewards.icon"
            :name="token0Rewards.name"
            size="20px"
          />
          1000
        </div>
        \
        <div class="token-value-wrap">
          <BaseTokenIcon
            :icon="token1Rewards.icon"
            :name="token1Rewards.name"
            size="20px"
          />
          1000
        </div>
      </div>
    </div>

    <div class="rewards-fraction">
      <div class="title">
        Ready to claim <Tooltip :width="20" :height="20" />
      </div>

      <div class="token-values">
        <div class="token-value-wrap">
          <BaseTokenIcon
            :icon="token0Rewards.icon"
            :name="token0Rewards.name"
            size="20px"
          />
          1000
        </div>
        \
        <div class="token-value-wrap">
          <BaseTokenIcon
            :icon="token1Rewards.icon"
            :name="token1Rewards.name"
            size="20px"
          />
          1000
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import moment from "moment";
import { formatUnits } from "viem";

export default {
  props: {
    mimSavingRateInfo: { type: Object },
  },

  computed: {
    token0Rewards() {
      const tokenInfo = this.mimSavingRateInfo!.rewardTokens[0];
      const tokenRewards = this.mimSavingRateInfo!.rewardsPerToken[0];
      return {
        name: tokenInfo.name,
        icon: tokenInfo.icon,
        total: formatUnits(tokenRewards.totalReward, tokenInfo.decimals),
      };
    },

    token1Rewards() {
      const tokenInfo = this.mimSavingRateInfo!.rewardTokens[1];
      const tokenRewards = this.mimSavingRateInfo!.rewardsPerToken[1];
      return {
        name: tokenInfo.name,
        icon: tokenInfo.icon,
        total: formatUnits(tokenRewards.totalReward, tokenInfo.decimals),
      };
    },

    nextUnlockTime() {
      return moment
        .utc(Number(this.mimSavingRateInfo!.nextUnlockTime) * 1000)
        .format("D MMM H:mm");
    },
  },

  methods: {},

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.rewards-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 12px 16px 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.rewards-fraction {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
}

.title {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: 150px;
  line-height: normal;
}

.claim-timing {
  font-size: 12px;
  line-height: normal;
  color: #878b93;
}

.time {
  color: white;
}

.token-values {
  display: flex;
  align-items: center;
  gap: 6px;
}

.token-value-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.token-icon {
  margin-right: 0 !important;
}

@media (max-width: 500px) {
  .rewards-fraction {
    flex-direction: column;
  }

  .title {
    width: auto;
  }
}
</style>
