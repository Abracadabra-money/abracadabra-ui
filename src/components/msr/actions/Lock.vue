<template>
  <div class="action">
    <div class="action-header">
      <h2 class="action-title">Lock MIM</h2>
      <CheckBox
        :value="!isStakeAndLock"
        @update="toggleAction"
        v-if="mimSavingRateInfo?.userInfo?.balances.unlocked"
      >
        Lock staked amount
      </CheckBox>
    </div>

    <BaseTokenInput
      :value="inputValue"
      :name="mimSavingRateInfo.stakingToken.name"
      :decimals="mimSavingRateInfo.stakingToken.decimals"
      :icon="mimSavingRateInfo.stakingToken.icon"
      :max="maxInputValue"
      :tokenPrice="1"
      :primaryMax="!isStakeAndLock"
      @updateInputValue="onUpdateLockValue"
    />

    <EpochTimeLine :mimSavingRateInfo="mimSavingRateInfo" />

    <BaseButton
      primary
      :disabled="actionValidationData.isDisabled"
      @click="actionHandler"
    >
      {{ actionValidationData.btnText }}
    </BaseButton>

    <LockInfo :mimSavingRateInfo="mimSavingRateInfo" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import moment from "moment";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatUnits } from "viem";
import notification from "@/helpers/notification/notification";
import { approveTokenViem } from "@/helpers/approval";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import actions from "@/helpers/mimSavingRate/actions";
import { validateAction } from "@/helpers/mimSavingRate/validators";

export default {
  props: {
    mimSavingRateInfo: { type: Object },
  },

  data() {
    return {
      inputValue: "",
      actionType: "stakeAndLock",
      actionConfig: {
        stakeAmount: 0n,
        lockAmount: 0n,
      },
      //todo: temporary untill understand how it should work properly
      lockingDeadline: moment().unix() + Number(300n),
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.mimSavingRateInfo.chainId;
    },

    isTokenApproved() {
      if (!this.mimSavingRateInfo.userInfo) return false;
      const { approvedAmount } = this.mimSavingRateInfo.userInfo.stakeToken;
      return approvedAmount >= this.actionConfig.stakeAmount;
    },

    maxInputValue() {
      return this.isStakeAndLock
        ? this.mimSavingRateInfo.userInfo?.stakeToken.balance || 0n
        : this.mimSavingRateInfo.userInfo?.balances.unlocked || 0n;
    },

    isStakeAndLock() {
      return this.actionType === "stakeAndLock";
    },

    amountToUse() {
      return this.isStakeAndLock ? "stakeAmount" : "lockAmount";
    },

    actionValidationData() {
      return validateAction(
        this.mimSavingRateInfo,
        this.actionType,
        this.chainId,
        this.actionConfig
      );
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    toggleAction() {
      this.resetAmounts();
      this.actionType = this.actionType === "lock" ? "stakeAndLock" : "lock";
    },

    onUpdateLockValue(value) {
      if (!value) {
        this.inputValue = "";
        this.actionConfig[this.amountToUse] = BigInt(0);
      } else {
        this.actionConfig[this.amountToUse] = value;
        this.inputValue = formatUnits(
          value,
          this.mimSavingRateInfo.stakingToken.decimals
        );
      }
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.mimSavingRateInfo.stakingToken.contract,
        this.mimSavingRateInfo.lockingMultiRewardsContract.address,
        this.actionConfig.stakeAmount
      );

      if (approve) await this.$emit("updateMimSavingRateInfo");
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async lockActionHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );
      const { error } = await actions.lock(
        this.mimSavingRateInfo.lockingMultiRewardsContract,
        this.actionConfig.lockAmount,
        this.lockingDeadline
      );

      await this.deleteNotification(notificationId);

      if (error) {
        await this.createNotification(error);
      } else {
        this.$emit("updateMimSavingRateInfo");
        await this.createNotification(notification.success);
      }
    },

    async stakeAndLockActionHandler() {
      if (!this.isTokenApproved) {
        await this.approveTokenHandler();
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = await actions.stakeLocked(
        this.mimSavingRateInfo.lockingMultiRewardsContract,
        this.actionConfig.stakeAmount,
        this.lockingDeadline
      );

      await this.deleteNotification(notificationId);

      if (error) {
        await this.createNotification(error);
      } else {
        this.$emit("updateMimSavingRateInfo");
        await this.createNotification(notification.success);
      }
    },

    async actionHandler() {
      if (this.actionValidationData.isDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) {
        switchNetwork(this.mimSavingRateInfo.chainId);
        return false;
      }

      if (this.isStakeAndLock) {
        await this.stakeAndLockActionHandler();
      } else {
        await this.lockActionHandler();
      }

      this.resetAmounts();
    },

    resetAmounts() {
      this.inputValue = "";

      this.actionConfig = {
        stakeAmount: 0n,
        lockAmount: 0n,
      };
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    CheckBox: defineAsyncComponent(() =>
      import("@/components/msr/CheckBox.vue")
    ),
    EpochTimeLine: defineAsyncComponent(() =>
      import("@/components/msr/EpochTimeLine.vue")
    ),
    LockInfo: defineAsyncComponent(() =>
      import("@/components/msr/LockInfo.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
