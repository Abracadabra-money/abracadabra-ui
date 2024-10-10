<template>
  <div class="staking-apr">
    <p class="title">
      <img
        src="@/assets/images/pools/pool/staking-apr-image.svg"
        class="staking-apr-image"
      />
      Staking APR
    </p>

    <div class="reward-items">
      <img
        :src="reward.token.icon"
        alt=""
        class="reward-icon"
        v-for="(reward, index) in poolRewards"
        :key="index"
      />
      <p class="apr">{{ apr }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { formatPercent } from "@/helpers/filters";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import type { PropType } from "vue";

export default {
  props: {
    pool: { type: Object as PropType<MagicLPInfo>, required: true },
  },

  computed: {
    poolRewards() {
      if (!this.pool.config.rewardTokens) return;
      return this.pool.config.rewardTokens.map((token, index) => ({
        token,
        apr: this.pool.poolAPR?.tokensApr[index].apr ?? 0,
      }));
    },

    apr() {
      if (!this.pool?.poolAPR) return "0.0%";
      return formatPercent(this.pool.poolAPR.totalApr);
    },
  },
};
</script>

<style lang="scss" scoped>
.staking-apr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.staking-rewards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.reward-items {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reward-icon {
  border-radius: 8px;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.reward-icon:not(:first-child) {
  margin-left: -12px;
}

.reward-name {
  font-size: 18px;
}

.apr {
  font-size: 23px;
  font-weight: 600;
  text-shadow: 0px 0px 16px #ab5de8;
}
</style>
