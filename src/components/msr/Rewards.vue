<template>
  <div class="rewards-wrap">
    <div class="rewards-fraction">
      <div class="title">
        Reward earned <Tooltip :width="20" :height="20" />
      </div>

      <div class="token-values">
        <div
          class="token-value-wrap"
          v-for="(reward, index) in rewards"
          :key="index"
        >
          <div class="token-info">
            <BaseTokenIcon
              :icon="reward.icon"
              :name="reward.name"
              size="20px"
            />
            {{ reward.name }}
          </div>
          <RowSkeleton v-if="isMimSavingRateInfoLoading" />
          <span class="value" v-else>
            {{ reward.total }}
          </span>
        </div>
      </div>
    </div>

    <div class="rewards-fraction">
      <div class="title">
        Pending <Tooltip :width="20" :height="20" />
        <span class="claim-timing">
          Will become claimable on
          <span class="time"> {{ unlockTime.formatted }} UTC</span>
        </span>
      </div>

      <div class="token-values">
        <div
          class="token-value-wrap"
          v-for="(reward, index) in rewards"
          :key="index"
        >
          <div class="token-info">
            <BaseTokenIcon
              :icon="reward.icon"
              :name="reward.name"
              size="20px"
            />
            {{ reward.name }}
          </div>
          <RowSkeleton v-if="isMimSavingRateInfoLoading" />
          <span class="value" v-else>
            {{ reward.vesting }}
          </span>
        </div>
      </div>
    </div>

    <div class="rewards-fraction">
      <div class="title">
        Ready to claim <Tooltip :width="20" :height="20" />
      </div>

      <div class="token-values">
        <div
          class="token-value-wrap"
          v-for="(reward, index) in rewards"
          :key="index"
        >
          <div class="token-info">
            <BaseTokenIcon
              :icon="reward.icon"
              :name="reward.name"
              size="20px"
            />
            {{ reward.name }}
          </div>
          <RowSkeleton v-if="isMimSavingRateInfoLoading" />
          <span class="value" v-else>
            {{ reward.claimable }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import moment from "moment";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";

type TokenRewards = {
  name: string;
  icon: string;
  total: string | number;
  claimable: string | number;
  vesting: string | number;
};

export default {
  props: {
    mimSavingRateInfo: {
      type: Object as PropType<MimSavingRateInfo | null>,
      required: true,
    },
    isUserRewardLockExpired: { type: Boolean },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    rewards(): TokenRewards[] {
      if (!this.mimSavingRateInfo)
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

      return this.mimSavingRateInfo.rewardTokens.map(
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
        Number(this.mimSavingRateInfo.nextEpoch) * 1000;

      return {
        time: moment.utc(unlockTimeTimestamp),
        formatted: moment.utc(unlockTimeTimestamp).format("D MMM H:mm"),
      };
    },
  },

  methods: {
    createRewardToken(arrayIndex: number): TokenRewards {
      const tokenInfo = this.mimSavingRateInfo!.rewardTokens[arrayIndex];

      const userInfo = this.mimSavingRateInfo!.userInfo;
      const total: bigint =
        userInfo?.earned[
          `token${arrayIndex}` as keyof typeof userInfo.earned
        ] || 0n;

      const rewardLockAmount =
        userInfo?.userRewardLock.items[arrayIndex]?.amount || 0n;

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
  gap: 24px;
  width: 100%;
}

.rewards-fraction {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
}

.title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  line-height: normal;
}

.claim-timing {
  font-size: 14px;
  line-height: normal;
  color: #878b93;
  margin-left: auto;
}

.time {
  color: white;
}

.token-values {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.token-value-wrap,
.token-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.token-value-wrap {
  justify-content: space-between;
}

.token-icon {
  margin-right: 0 !important;
}

.row-skeleton {
  height: 21px !important;
}

@media (max-width: 500px) {
  .rewards-wrap {
    gap: 16px;
  }
}
</style>
