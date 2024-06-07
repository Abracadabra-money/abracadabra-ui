<template>
  <div class="action">
    <h2 class="action-title">
      {{ titleText }} MIM
      <Tabs
        class="tabs"
        :name="activeTab"
        :items="tabItems"
        @select="changeTab"
      />
    </h2>

    <BaseTokenInput
      :value="inputValue"
      :name="mimSavingRateInfo?.stakingToken?.name || 'MIM'"
      :decimals="mimSavingRateInfo?.stakingToken.decimals"
      :icon="mimSavingRateInfo?.stakingToken.icon || mimIcon"
      :max="maxInputValue"
      :disabled="isMimSavingRateInfoLoading"
      :primaryMax="!isStakeAction"
      :tokenPrice="1"
      @updateInputValue="onUpdateStakeValue"
    />

    <BaseButton
      class="action-button"
      primary
      @click="actionHandler"
      :disabled="actionValidationData.isDisabled"
      >{{ actionValidationData.btnText }}
    </BaseButton>

    <PromoCard
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
      @click="$emit('chooseLockAction')"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
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

type ActiveTab = "stake" | "unstake";
type TabItems = string[];
type InputValue = string | bigint;
type ActionConfig = {
  stakeAmount: bigint;
  withdrawAmount: bigint;
  lockAmount: bigint;
};

export default {
  emits: ["chooseLockAction", "updateMimSavingRateInfo"],

  props: {
    mimSavingRateInfo: {
      type: null as any,
      default: null,
      required: false,
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
        lockAmount: this.mimSavingRateInfo?.userInfo?.unlocked || 0n,
      } as ActionConfig,
      //todo: temporary untill understand how it should work properly
      lockingDeadline: moment().unix() + Number(300n),
      mimIcon,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain(): boolean {
      return this.chainId != this.mimSavingRateInfo?.chainId;
    },

    isStakeAction(): boolean {
      return this.activeTab === "stake";
    },

    titleText(): string {
      return this.isStakeAction ? "Stake" : "Unstake";
    },

    isTokenApproved(): boolean {
      const { approvedAmount } =
        this.mimSavingRateInfo?.userInfo.stakeToken || 0n;
      return approvedAmount >= this.actionConfig.stakeAmount;
    },

    actionMethodName() {
      return this.isStakeAction ? "stake" : "withdraw";
    },

    maxInputValue(): bigint {
      const { balance } = this.mimSavingRateInfo?.userInfo.stakeToken || 0n;
      const { unlocked } = this.mimSavingRateInfo?.userInfo || 0n;

      return this.isStakeAction ? balance : unlocked;
    },

    actionValidationData() {
      return validateAction(
        this.mimSavingRateInfo,
        this.activeTab,
        this.chainId,
        this.actionConfig
      );
    },
  },

  watch: {
    mimSavingRateInfo() {
      this.actionConfig.lockAmount =
        this.mimSavingRateInfo?.userInfo.unlocked || 0n;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatPercent,

    resetAmounts() {
      this.inputValue = "";

      this.actionConfig = {
        stakeAmount: 0n,
        withdrawAmount: 0n,
        lockAmount: this.mimSavingRateInfo.userInfo.unlocked || 0n,
      };
    },

    changeTab(action: ActiveTab) {
      this.resetAmounts();
      this.activeTab = action;
    },

    onUpdateStakeValue(value: bigint) {
      this.inputValue = !value
        ? ""
        : formatUnits(
            value,
            this.mimSavingRateInfo?.stakingToken.decimals || 18
          );

      if (this.isStakeAction) {
        this.actionConfig.stakeAmount = value;
      } else {
        this.actionConfig.withdrawAmount = value;
      }
    },

    async approveTokenHandler() {
      if (this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.mimSavingRateInfo?.stakingToken.contract,
        this.mimSavingRateInfo?.lockingMultiRewardsContract.address,
        this.actionConfig.stakeAmount
      );
      if (approve) this.$emit("updateMimSavingRateInfo");

      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
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

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await actions[this.actionMethodName](
        this.mimSavingRateInfo?.lockingMultiRewardsContract,
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
    },
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    PromoCard: defineAsyncComponent(
      () => import("@/components/msr/PromoCard.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  width: min-content;
}

.title {
  font-size: 14px;
  font-weight: 500;
}

.default-button {
  margin-top: 0 !important;
}

.lock-action-button {
  margin-top: auto;
  width: auto !important;
}
</style>
