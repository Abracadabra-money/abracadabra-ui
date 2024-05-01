<template>
  <div class="action">
    <div class="apr-efficiency">
      <div class="title-tooltip">
        Your APR Efficiency
        <QuestionMarkIcon v-tooltip="'Your APR Efficiency'" />
      </div>

      <div class="efficiency-indicator"></div>
    </div>

    <Assets
      :locked-amount="userLockedAmount"
      :unlocked-amount="userUnlockedAmount"
    />

    <Rewards />

    <EpochTimeLine :mimSavingRateInfo="mimSavingRateInfo" />
    <BaseButton class="action-button" primary @click="actionHandler"
      >Claim</BaseButton
    >
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { mapActions, mapMutations } from "vuex";
import { formatTokenBalance } from "@/helpers/filters";
import notification from "@/helpers/notification/notification";
import { getRewards } from "@/helpers/mimSavingRate/actions/getRewards";

export default {
  emits: ["updateMimSavingRateInfo"],

  props: {
    mimSavingRateInfo: { type: Object },
  },

  computed: {
    userLockedAmount(): string | number {
      return formatTokenBalance(
        formatUnits(this.mimSavingRateInfo!.userInfo.balances.locked, 18)
      );
    },

    userUnlockedAmount(): string | number {
      return formatTokenBalance(
        formatUnits(this.mimSavingRateInfo!.userInfo.balances.unlocked, 18)
      );
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
    QuestionMarkIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    Assets: defineAsyncComponent(() => import("@/components/msr/Assets.vue")),
    Rewards: defineAsyncComponent(() => import("@/components/msr/Rewards.vue")),
  },
};
</script>

<style lang="scss" scoped>
.title-tooltip {
  display: flex;
  align-items: center;
}

.apr-efficiency {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.efficiency-indicator {
  width: 100%;
  height: 12px;
  border-radius: 12px;
  background: rgba(109, 248, 114, 0.2);
  margin: auto;
}
</style>
