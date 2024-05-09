<template>
  <div class="action">
    <Assets
      :locked-amount="userLockedAmount"
      :unlocked-amount="userUnlockedAmount"
      :rewardTokens="rewardTokens"
      :depositedToken="mimSavingRateInfo?.stakingToken"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />

    <div class="apr-rewards">
      <APREfficiency
        :mimSavingRateInfo="mimSavingRateInfo"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
        @chooseLockAction="$emit('chooseLockAction')"
      />
      <Rewards
        :mimSavingRateInfo="mimSavingRateInfo"
        :isUserRewardLockExpired="isUserRewardLockExpired"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      />
    </div>

    <EpochTimeLine
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />

    <BaseButton
      class="action-button"
      primary
      @click="actionHandler"
      :disabled="isButtonDisabled"
    >
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { mapActions, mapMutations } from "vuex";
import { formatTokenBalance } from "@/helpers/filters";
import notification from "@/helpers/notification/notification";
import { getRewards } from "@/helpers/mimSavingRate/actions/getRewards";
import type { RewardTokenConfig } from "@/configs/stake/mimSavingRateConfig";

export default {
  emits: ["updateMimSavingRateInfo", "chooseLockAction"],

  props: {
    mimSavingRateInfo: { type: Object },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    buttonText() {
      if (this.isEarned && !this.isUserRewardLockAmount)
        return "Earned to vesting";

      if (
        this.isEarned &&
        this.isUserRewardLockAmount &&
        this.isUserRewardLockExpired
      )
        return "Earned to vesting and claim";

      if (
        !this.isEarned &&
        this.isUserRewardLockAmount &&
        !this.isUserRewardLockExpired
      )
        return "Wait until unlocks";

      if (this.isButtonDisabled) return "Unavailable";

      return "Claim";
    },

    isButtonDisabled() {
      return (
        (!this.isEarned && !this.isUserRewardLockAmount) ||
        (!this.isEarned &&
          this.isUserRewardLockAmount &&
          !this.isUserRewardLockExpired)
      );
    },

    isEarned() {
      if (!this.mimSavingRateInfo) return false;
      return this.mimSavingRateInfo.userInfo.earned.token0 > 0n;
    },

    isUserRewardLockAmount() {
      if (!this.mimSavingRateInfo) return false;
      return (
        this.mimSavingRateInfo.userInfo.userRewardLock.items[0].amount > 0n
      );
    },

    isUserRewardLockExpired() {
      if (!this.mimSavingRateInfo) return true;

      const now = moment().utc();

      const unlockTime = moment.utc(
        Number(this.mimSavingRateInfo!.userInfo.userRewardLock.unlockTime) *
          1000
      );

      return now.isAfter(unlockTime);
    },

    userLockedAmount(): string | number {
      return formatTokenBalance(
        formatUnits(this.mimSavingRateInfo?.userInfo.balances.locked || 0n, 18)
      );
    },

    userUnlockedAmount(): string | number {
      return formatTokenBalance(
        formatUnits(
          this.mimSavingRateInfo?.userInfo.balances.unlocked || 0n,
          18
        )
      );
    },

    rewardTokens(): RewardTokenConfig[] {
      return this.mimSavingRateInfo?.rewardTokens || [];
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async actionHandler() {
      if (this.isButtonDisabled) return;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await getRewards(
        this.mimSavingRateInfo?.lockingMultiRewardsContract
      );

      await this.deleteNotification(notificationId);

      if (error) {
        await this.createNotification(error);
      } else {
        this.$emit("updateMimSavingRateInfo");
        await this.createNotification(notification.success);
      }
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    EpochTimeLine: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/msr/EpochTimeLine.vue")
    ),
    Assets: defineAsyncComponent(() => import("@/components/msr/Assets.vue")),
    APREfficiency: defineAsyncComponent(
      () => import("@/components/msr/apr-efficiency/APREfficiency.vue")
    ),
    Rewards: defineAsyncComponent(() => import("@/components/msr/Rewards.vue")),
  },
};
</script>

<style lang="scss" scoped>
.apr-rewards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title-tooltip {
  display: flex;
  align-items: center;
}

.action-button {
  margin-top: 0 !important;
}
</style>
