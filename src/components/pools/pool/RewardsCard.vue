<template>
  <div class="rewards-card" :class="{'position-view': isPosition}"v-if="isPoolHasReward && poolRewards">
    <div class="row">
      <p class="title">Staking Rewards</p>
      <div class="reward-items">
        <img
          :src="reward.token.icon"
          alt=""
          class="reward-icon"
          v-for="(reward, index) in poolRewards"
          :key="index"
        />
        <!-- <p class="reward-name">{{ reward.token.name }}</p> -->
      </div>
    </div>
    <div class="row apr-item">
      <div class="title-wrap">
        <Tooltip :width="18" :height="18" fill="#ffffff" :tooltip="''" />
        <p class="title">APR</p>
        <div class="apr-info">
          <div
            class="apr-item"
            v-for="item in poolRewards"
            :key="item.token.address"
          >
            <img :src="item.token.icon" alt="" class="token-icon" />
            <p class="name">{{ item.token.name }}:</p>
            <p class="apr">{{ Number(item.apr).toFixed(2) }}%</p>
          </div>
          <!-- <div class="apr-item total-item">
            <p class="name">Total:</p>
            <p class="apr">{{ Number(pool.poolAPR.totalApr).toFixed(2) }} %</p>
          </div> -->
        </div>
      </div>
      <p class="value">{{ Number(pool.poolAPR.totalApr).toFixed(2) }}%</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  name: "RewardsCard",
  props: {
    pool: { type: Object, required: true },
    isPosition: { type: Boolean, default: false}
  },
  computed: {
    isPoolHasReward() {
      return this.pool.stakeInfo ?? false;
    },

    poolRewards() {
      if (!this.isPoolHasReward) return;
      return this.pool.stakeInfo.earnedInfo;
    },
  },
  components: {
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style scoped lang="scss">
.rewards-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);

  &.position-view {
    padding: 0;
    background: none;
    box-shadow: none;
    border: none;
  }

  .apr-item {
    .title-wrap {
      display: flex;
      align-items: center;
      gap: 3px;
      position: relative;
      cursor: pointer;

      &:hover {
        .apr-info {
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      }

      .apr-info {
        display: none;
        z-index: -100;
        position: absolute;
        left: -92px;
        bottom: 100%;
        min-width: 200px;
        border-radius: 12px;
        background: #15192a;
        box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
        padding: 12px;
        transition: opacity 0.3s ease;

        .total-item {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 8px;
        }

        .apr-item {
          width: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          // margin-bottom: 8px;

          .token-icon {
            width: 20px;
            height: 20px;
            object-fit: contain;
            margin-right: 4px;
          }

          .name {
            color: #878b93;
          }

          .apr {
            font-weight: 500;
            margin-left: auto;
            text-align: right;
          }
        }
      }
    }

    .value {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .reward-items {
    display: flex;
    align-items: center;
    gap: 4px;

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
  }
}
</style>
