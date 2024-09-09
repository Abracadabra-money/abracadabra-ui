<template>
  <div class="action-wrap">
    <div class="action-info">
      <Rewards
        :mimSavingRateInfo="mimSavingRateInfo"
        :isUserRewardLockExpired="isUserRewardLockExpired"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      />
    </div>

    <div class="action">
      <Assets
        :locked-amount="userLockedAmount"
        :unlocked-amount="userUnlockedAmount"
        :rewardTokens="rewardTokens"
        :depositedToken="mimSavingRateInfo?.stakingToken"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
        :isMimSavingRateInfo="!!mimSavingRateInfo"
      />

      <APREfficiency
        :mimSavingRateInfo="mimSavingRateInfo"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
        @updateMimSavingRateInfo="$emit('updateMimSavingRateInfo')"
      />

      <Rewards
        class="mobile-rewards"
        :mimSavingRateInfo="mimSavingRateInfo"
        :isUserRewardLockExpired="isUserRewardLockExpired"
        :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      />

      <div class="timeline-button-wrap">
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
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { defineAsyncComponent, type PropType } from "vue";
import { formatUnits } from "viem";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatTokenBalance } from "@/helpers/filters";
import notification from "@/helpers/notification/notification";
import { getRewards } from "@/helpers/mimSavingRate/actions/getRewards";
import type { RewardTokenConfig } from "@/configs/stake/mimSavingRateConfig";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";

export default {
  emits: ["updateMimSavingRateInfo", "chooseLockAction"],

  props: {
    mimSavingRateInfo: {
      type: Object as PropType<MimSavingRateInfo | null>,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    buttonText() {
      if (this.isUnsupportedChain) return "Switch chain";

      if (!this.account) return "Connect wallet";

      if (this.isEarned && !this.isUserRewardLockAmount)
        return "Starts Pending";

      if (
        this.isEarned &&
        this.isUserRewardLockAmount &&
        !this.isUserRewardLockExpired
      )
        return "Starts Pending and Claim rewards";

      if (
        !this.isEarned &&
        this.isUserRewardLockAmount &&
        !this.isUserRewardLockExpired
      )
        return "Unlocking";

      if (this.isButtonDisabled) return "Unavailable";

      return "Claim";
    },

    isButtonDisabled() {
      if (
        !this.account ||
        this.isUnsupportedChain ||
        !this.mimSavingRateInfo ||
        this.isMimSavingRateInfoLoading
      )
        return false;

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
      if (
        !this.mimSavingRateInfo ||
        this.mimSavingRateInfo.userInfo.userRewardLock.items.length == 0
      )
        return false;
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

    isUnsupportedChain() {
      return this.chainId != this.mimSavingRateInfo?.chainId;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async actionHandler() {
      if (this.isButtonDisabled || !this.mimSavingRateInfo) return false;

      if (!this.account && !this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (this.isUnsupportedChain) {
        switchNetwork(this.mimSavingRateInfo?.chainId);
        return false;
      }

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
.action-wrap {
  display: grid;
  grid-template-columns: 525px auto;
  gap: 24px;
}

.action {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mobile-rewards {
  display: none !important;
}

.timeline-button-wrap {
  @include block-wrap;
}

.title-tooltip {
  display: flex;
  align-items: center;
}

.action-button {
  margin-top: 0 !important;
}

@media (max-width: 1100px) {
  .action-wrap {
    display: flex;
    flex-direction: column-reverse;
  }

  .action-info {
    display: none;
  }

  .mobile-rewards {
    display: flex !important;
  }
}

@media (max-width: 500px) {
  .timeline-button-wrap {
    padding: 0;
    border-radius: 0;
    border: none;
    background: none;
    box-shadow: none;
    backdrop-filter: none;
  }
}
</style>
