<template>
  <div class="action-wrap">
    <div class="action">
      <div class="common-info">
        Available on:
        <AvailableNetworksBlock
          :selectedNetwork="42161"
          :availableNetworks="[42161]"
        />
      </div>

      <h2 class="action-title">
        {{ activeTab }} MIM
        <Tabs
          class="tabs"
          :name="activeTabName"
          :items="tabItems"
          @select="changeTab"
        />
      </h2>

      <BaseTokenInput
        :value="inputValue"
        :name="mimSavingRateInfo?.stakingToken?.name || 'MIM'"
        :decimals="mimSavingRateInfo?.stakingToken?.decimals || 18"
        :icon="mimSavingRateInfo?.stakingToken?.icon || mimIcon"
        :max="maxInputValue"
        :disabled="isMimSavingRateInfoLoading || !mimSavingRateInfo"
        :primaryMax="activeTab === 'unstake'"
        @updateInputValue="onUpdateActionValue"
      />

      <div class="lock-toggle-wrap" v-if="isStakeAction || isLockAction">
        <Toggle
          :selected="isLockAction"
          text="Lock for 3 months to get higher APR"
          @updateToggle="toggleLock"
        />
      </div>

      <BaseButton
        class="action-button"
        primary
        @click="actionHandler"
        :disabled="actionValidationData.isDisabled"
      >
        {{ actionValidationData.btnText }}
      </BaseButton>

      <div class="description-wrap" v-if="isLockAction">
        <p class="description">
          The locked amount will be assigned to the current epoch, with each
          epoch starting every Thursday at 00:00 UTC.
        </p>

        <div class="lock-time-notification">
          <span class="notification-message">
            Unlock date:
            <Tooltip
              tooltip="tooltip"
              :width="20"
              :height="20"
              fill="#878B93"
            />
          </span>

          <div class="date-time">
            <RowSkeleton
              v-if="isMimSavingRateInfoLoading || !mimSavingRateInfo"
            />
            <span class="date" v-else>{{
              formatTimestampToUnix(
                mimSavingRateInfo.nextUnlockTime,
                "DD MMM. YYYY"
              )
            }}</span>
            <span class="time"> (00:01 UTC)</span>
          </div>
        </div>
      </div>
    </div>

    <StakeActionInfo
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import moment from "moment";
import { formatUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/mimSavingRate/actions";
import { formatPercent } from "@/helpers/filters";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { validateAction } from "@/helpers/mimSavingRate/validators";
import mimIcon from "@/assets/images/tokens/MIM.png";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { formatTimestampToUnix } from "@/helpers/time";

type ActiveTab = "stake" | "unstake" | "lock";
type TabItems = string[];
type InputValue = string | bigint;
export type ActionConfig = {
  stakeAmount: bigint;
  withdrawAmount: bigint;
  lockAmount: bigint;
  lockingDeadline: number;
};

export default {
  emits: ["chooseLockAction", "updateMimSavingRateInfo"],

  props: {
    mimSavingRateInfo: {
      type: Object as PropType<MimSavingRateInfo | null>,
      required: true,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return {
      activeTab: "stake" as ActiveTab,
      tabItems: ["stake", "unstake"] as TabItems,
      inputValue: "" as InputValue,
      actionConfig: {
        stakeAmount: 0n,
        withdrawAmount: 0n,
        lockAmount: 0n,
        //todo: temporary untill understand how it should work properly
        lockingDeadline: moment().unix() + Number(300n),
      } as ActionConfig,
      isActionProcessing: false,
      mimIcon,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain(): boolean {
      return (
        this.chainId != (this.mimSavingRateInfo?.chainId || ARBITRUM_CHAIN_ID)
      );
    },

    isStakeAction(): boolean {
      return this.activeTab === "stake";
    },

    isLockAction(): boolean {
      return this.activeTab === "lock";
    },

    isTokenApproved(): boolean {
      if (!this.mimSavingRateInfo) return false;
      const { approvedAmount } =
        this.mimSavingRateInfo?.userInfo?.stakeToken || 0n;
      return approvedAmount >= this.actionConfig.stakeAmount;
    },

    activeTabName() {
      return this.isStakeAction || this.isLockAction ? "stake" : "unstake";
    },

    actionMethodName() {
      switch (this.activeTab) {
        case "unstake":
          return "withdraw";
        case "lock":
          return "stakeLocked";
        default:
          return "stake";
      }
    },

    maxInputValue(): bigint {
      if (!this.mimSavingRateInfo) return 0n;
      const { balance } = this.mimSavingRateInfo?.userInfo?.stakeToken || 0n;
      const { unlocked } = this.mimSavingRateInfo?.userInfo || 0n;

      return this.isStakeAction || this.isLockAction ? balance : unlocked;
    },

    actionValidationData() {
      if (!this.mimSavingRateInfo)
        return {
          isAllowed: false,
          isDisabled: true,
          btnText: "Enter amount",
        };
      return validateAction(
        this.mimSavingRateInfo,
        this.isLockAction ? "stakeAndLock" : this.activeTab,
        this.chainId,
        this.actionConfig,
        this.isActionProcessing
      );
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatPercent,
    formatTimestampToUnix,

    resetAmounts() {
      this.inputValue = "";

      this.actionConfig = {
        stakeAmount: 0n,
        withdrawAmount: 0n,
        lockAmount: 0n,
        lockingDeadline: moment().unix() + Number(300n),
      };
    },

    changeTab(action: ActiveTab) {
      this.resetAmounts();
      this.activeTab = action;
    },

    toggleLock() {
      const tabToChange = this.isStakeAction ? "lock" : "stake";
      this.changeTab(tabToChange);
    },

    onUpdateActionValue(value: bigint) {
      this.inputValue = !value
        ? ""
        : formatUnits(
            value,
            this.mimSavingRateInfo?.stakingToken.decimals || 18
          );

      switch (this.activeTab) {
        case "unstake":
          this.actionConfig.withdrawAmount = value;
          break;
        default:
          this.actionConfig.lockAmount = value;
          this.actionConfig.stakeAmount = value;
          break;
      }
    },

    async approveTokenHandler() {
      if (this.isUnsupportedChain || !this.mimSavingRateInfo) return false;
      this.isActionProcessing = true;
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.mimSavingRateInfo?.stakingToken.contract,
        this.mimSavingRateInfo?.lockingMultiRewardsContract.address,
        this.actionConfig.stakeAmount
      );

      if (approve) {
        this.$emit("updateMimSavingRateInfo");
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } else {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.approveError);
      }
      this.isActionProcessing = false;
    },

    async actionHandler() {
      if (this.actionValidationData.isDisabled) return false;

      if (!this.account && !this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (this.isUnsupportedChain) {
        switchNetwork(this.mimSavingRateInfo?.chainId || 1);
        return false;
      }

      if (!this.isTokenApproved) {
        await this.approveTokenHandler();
        return false;
      }
      this.isActionProcessing = true;
      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await actions[this.actionMethodName](
        this.mimSavingRateInfo!.lockingMultiRewardsContract,
        this.actionConfig
      );

      await this.deleteNotification(notificationId);

      if (error) {
        await this.createNotification(error);
      } else {
        this.$emit("updateMimSavingRateInfo");
        this.resetAmounts();
        await this.createNotification(notification.success);
      }
      this.isActionProcessing = false;
    },
  },

  components: {
    StakeActionInfo: defineAsyncComponent(
      () => import("@/components/msr/actions/stake/StakeActionInfo.vue")
    ),
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake/AvailableNetworksBlock.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
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
  height: fit-content;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(50px);
  overflow: auto;
}

.common-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.tabs {
  width: min-content;
}

.action-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  text-transform: capitalize;
}

.default-button {
  margin-top: 0 !important;
}

.lock-action-button {
  margin-top: auto;
  width: auto !important;
}

.lock-toggle-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}

.description-wrap {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.description {
  font-size: 14px;
  font-weight: 400;
  line-height: 26px;
  text-align: center;
}

.lock-time-notification {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 206px;
  padding: 8px 16px 8px 12px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    url("@/assets/images/msr/lock-until-background-timer.svg");
  background-repeat: no-repeat;
  background-position: center center, center top -10px;
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.notification-message {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 26px;
}

.date-time {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
}

.time {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 26px;
}

.row-skeleton {
  height: 26px !important;
}

@media (max-width: 1100px) {
  .action-wrap {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .description-wrap {
    flex-direction: column;
  }

  .lock-time-notification {
    width: 100%;
  }

  .date-time {
    flex-direction: row;
    gap: 4px;
  }

  .date {
    font-weight: 18px;
  }
}
</style>
