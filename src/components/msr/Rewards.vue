<template>
  <div class="rewards-wrap">
    <div class="rewards-fraction">
      <div class="title">
        Reward earned <Tooltip :width="20" :height="20" />
      </div>

      <RowSkeleton v-if="isMimSavingRateInfoLoading" />
      <div class="token-values" v-else>
        <div
          class="token-value-wrap"
          v-for="(reward, index) in rewards"
          :key="index"
        >
          <span class="divide-slash" v-if="index > 0">\ </span>

          <BaseTokenIcon :icon="reward.icon" :name="reward.name" size="20px" />
          {{ reward.total }}
        </div>
      </div>
    </div>

    <div class="rewards-fraction">
      <div class="title">
        Vesting <Tooltip :width="20" :height="20" />
        <span class="claim-timing">
          Will become claimable on
          <span class="time"> {{ unlockTime.formatted }} UTC</span>
        </span>
      </div>

      <RowSkeleton v-if="isMimSavingRateInfoLoading" />
      <div class="token-values" v-else>
        <div
          class="token-value-wrap"
          v-for="(reward, index) in rewards"
          :key="index"
        >
          <span class="divide-slash" v-if="index > 0">\ </span>

          <BaseTokenIcon :icon="reward.icon" :name="reward.name" size="20px" />
          {{ reward.vesting }}
        </div>
      </div>
    </div>

    <div class="rewards-fraction">
      <div class="title">
        Ready to claim <Tooltip :width="20" :height="20" />
      </div>

      <RowSkeleton v-if="isMimSavingRateInfoLoading" />
      <div class="token-values" v-else>
        <div
          class="token-value-wrap"
          v-for="(reward, index) in rewards"
          :key="index"
        >
          <span class="divide-slash" v-if="index > 0">\ </span>

          <BaseTokenIcon :icon="reward.icon" :name="reward.name" size="20px" />
          {{ reward.claimable }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import moment from "moment";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

type TokenRewards = {
  name: string;
  icon: string;
  total: string | number;
  claimable: string | number;
  vesting: string | number;
};

export default {
  props: {
    mimSavingRateInfo: { type: Object },
    isUserRewardLockExpired: { type: Boolean },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    rewards(): TokenRewards[] {
      if (
        !this.mimSavingRateInfo ||
        this.mimSavingRateInfo.userInfo.userRewardLock.items.length === 0
      )
        return [
          {
            name: "",
            icon: "",
            total: "0.0",
            claimable: "0.0",
            vesting: "0.0",
          },
          {
            name: "",
            icon: "",
            total: "0.0",
            claimable: "0.0",
            vesting: "0.0",
          },
        ];

      return this.mimSavingRateInfo.userInfo.userRewardLock.items.map(
        (_: any, index: number) => {
          return this.createRewardToken(index);
        }
      );
    },

    unlockTime() {
      if (!this.mimSavingRateInfo)
        return {
          time: "",
          formatted: "",
        };

      const unlockTimeTimestamp =
        Number(this.mimSavingRateInfo.nextUnlockTime) * 1000;

      return {
        time: moment.utc(unlockTimeTimestamp),
        formatted: moment.utc(unlockTimeTimestamp).format("D MMM H:mm"),
      };
    },
  },

  methods: {
    createRewardToken(arrayIndex: number): TokenRewards {
      if (
        !this.mimSavingRateInfo ||
        this.mimSavingRateInfo.userInfo.userRewardLock.items.length === 0
      )
        return {
          name: "",
          icon: "",
          total: "0",
          claimable: "0",
          vesting: "0",
        };

      const tokenInfo = this.mimSavingRateInfo.rewardTokens[arrayIndex];
      const userInfo = this.mimSavingRateInfo.userInfo;
      const total: bigint = userInfo?.earned[`token${arrayIndex}`] || 0n;

      const rewardLockAmount = userInfo.userRewardLock.items[arrayIndex].amount;

      let claimable: bigint = this.isUserRewardLockExpired
        ? rewardLockAmount
        : 0n;
      let vesting: bigint = this.isUserRewardLockExpired
        ? 0n
        : rewardLockAmount;

      return {
        name: tokenInfo.name,
        icon: tokenInfo.icon,
        total: this.formatTokenBalance(total, tokenInfo.decimals),
        claimable: this.formatTokenBalance(claimable, tokenInfo.decimals),
        vesting: this.formatTokenBalance(vesting, tokenInfo.decimals),
      };
    },

    formatTokenBalance(value: bigint, decimals: number) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
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
  font-style: normal;
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

.row-skeleton {
  height: 21px !important;
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
