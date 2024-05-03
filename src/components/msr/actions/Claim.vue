<template>
  <div class="action">
    <Assets
      :locked-amount="userLockedAmount"
      :unlocked-amount="userUnlockedAmount"
      :rewardTokens="rewardTokens"
    />

    <div class="apr-rewards">
      <APREfficiency @chooseLockAction="$emit('chooseLockAction')" />
      <Rewards :mim-saving-rate-info="mimSavingRateInfo" />
    </div>

    <EpochTimeLine :mimSavingRateInfo="mimSavingRateInfo" />

    <BaseButton class="action-button" primary @click="actionHandler">
      Claim
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { mapActions, mapMutations } from "vuex";
import { formatTokenBalance } from "@/helpers/filters";
import notification from "@/helpers/notification/notification";
import { getRewards } from "@/helpers/mimSavingRate/actions/getRewards";
import type { RewardTokenConfig } from "@/configs/stake/mimSavingRateConfig";

export default {
  emits: ["updateMimSavingRateInfo", "chooseLockAction"],

  props: {
    mimSavingRateInfo: { type: Object },
  },

  computed: {
    userLockedAmount(): string | number {
      return formatTokenBalance(
        formatUnits(this.mimSavingRateInfo!.userInfo?.balances.locked || 0n, 18)
      );
    },

    userUnlockedAmount(): string | number {
      return formatTokenBalance(
        formatUnits(
          this.mimSavingRateInfo!.userInfo?.balances.unlocked || 0n,
          18
        )
      );
    },

    rewardTokens(): RewardTokenConfig[] {
      return this.mimSavingRateInfo!.rewardTokens;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async actionHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await getRewards(
        this.mimSavingRateInfo!.lockingMultiRewardsContract
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
