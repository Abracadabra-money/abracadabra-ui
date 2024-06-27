<template>
  <div class="rewards-card" v-if="isPoolHasReward && reward">
    <p class="title">Staking Rewards</p>
    <div class="reward-item">
      <img :src="reward.icon" alt="" class="reward-icon" />
      <p class="reward-name">{{ reward.name }}</p>
    </div>
  </div>
</template>

<script lang="ts">
type RewardData = {
  icon: string;
  name: string;
};

type Rewards = {
  [key: string]: {
    [key: string]: RewardData;
  };
};

import { useImage } from "@/helpers/useImage";

export default {
  name: "RewardsCard",
  props: {
    pool: { type: Object, required: true },
  },
  data() {
    return {
      rewards: {
        2222: {
          1: {
            icon: useImage("assets/images/networks/kava.png"),
            name: "wKAVA",
          },
        },
        42161: {
          1: {
            icon: useImage("assets/images/tokens/SPELL.png"),
            name: "SPELL",
          },
        },
      } as Rewards,
    };
  },
  computed: {
    isPoolHasReward() {
      return (
        this.rewards[this.pool.chainId] &&
        this.rewards[this.pool.chainId][this.pool.id]
      );
    },
    reward() {
      if (!this.isPoolHasReward) return;
      return this.rewards[this.pool.chainId][this.pool.id];
    },
  },
};
</script>

<style scoped lang="scss">
.rewards-card {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .reward-item {
    display: flex;
    align-items: center;
    gap: 4px;

    .reward-icon {
      // border-radius: 50%;
      width: 28px;
      height: 28px;
      object-fit: contain;
    }

    .reward-name {
      font-size: 18px;
    }
  }
}
</style>
