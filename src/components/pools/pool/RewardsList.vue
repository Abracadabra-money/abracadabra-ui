<template>
  <ul class="rewards-list">
    <li
      class="list-item reward"
      v-for="(reward, index) in rewardsList"
      :key="index"
    >
      <img class="reward-icon" :src="reward.icon" />

      <p class="reward-title">
        {{ reward.title }} per hour
        <Tooltip
          :tooltip="reward.tooltip"
          :height="20"
          :width="20"
          fill="#878B93"
        />
      </p>

      <div class="value-wrap">
        <div class="value">{{ reward.value }}</div>
        <p class="for-thousand" v-if="!inputAmount">for $1K</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    rewards: { type: Object },
    inputAmount: { default: 0n },
    isRewardsCalculating: { type: Boolean },
  },

  computed: {
    rewardsList() {
      return [
        {
          title: "Points",
          icon: useImage("assets/images/points-dashboard/blast.png"),
          tooltip: "Points",
          value: this.isRewardsCalculating
            ? "-"
            : `~${formatTokenBalance(this.rewards.pointsReward)}`,
        },
        {
          title: "Gold",
          icon: useImage("assets/images/points-dashboard/gold-points.svg"),
          tooltip: "Gold",
          value: this.isRewardsCalculating
            ? "-"
            : `~${formatTokenBalance(this.rewards.goldReward)}`,
        },
        {
          title: "Potion",
          icon: useImage("assets/images/points-dashboard/potion.png"),
          tooltip: "Potion",
          value: this.isRewardsCalculating ? "-" : "~0.0",
        },
      ];
    },
  },

  methods: {
    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.rewards-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.list-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 126px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.reward-icon {
  width: 32px;
}

.reward-title {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.value-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value {
  font-size: 22px;
  font-weight: 500;
}

.for-thousand {
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
}

@media (max-width: 600px) {
  .rewards-list {
    flex-direction: column;
    width: 100%;
  }

  .list-item {
    flex-direction: row;
    min-height: auto;
    width: 100%;
  }

  .reward-icon {
    width: 28px;
  }

  .value-wrap {
    margin-left: auto;
  }

  .value {
    font-size: 18px;
  }
}
</style>
