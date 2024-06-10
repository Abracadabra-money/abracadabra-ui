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
      :name="mimSavingRateInfo?.stakingToken.name || 'MIM'"
      :decimals="mimSavingRateInfo?.stakingToken.decimals"
      :icon="mimSavingRateInfo?.stakingToken.icon || mimIcon"
      :max="maxInputValue"
      :disabled="isMimSavingRateInfoLoading"
      :tokenPrice="1"
      :primaryMax="!isStakeAndLock"
      @updateInputValue="onUpdateLockValue"
    />

    <div class="description-wrap">
      <p class="description">
        The locked amount will be assigned to the current epoch, with each epoch
        starting every Thursday at 00:00 UTC.
      </p>

      <div class="lock-time-notification">
        <span class="notification-message"> Lock untill: </span>

        <div class="date-time">
          <RowSkeleton v-if="isMimSavingRateInfoLoading" />
          <span class="date" v-else>{{
            formatTimestampToUnix(
              mimSavingRateInfo?.nextUnlockTime,
              "DD MMM. YYYY"
            )
          }}</span>
          <span class="time"> (00:01 UTC)</span>
        </div>
      </div>
    </div>

    <BaseButton
      primary
      :disabled="actionValidationData.isDisabled"
      @click="actionHandler"
    >
      {{ actionValidationData.btnText }}
    </BaseButton>

    <LockInfo
      :mimSavingRateInfo="mimSavingRateInfo"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />
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
import { formatTimestampToUnix } from "@/helpers/time/index";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  props: {
    mimSavingRateInfo: { type: Object },
    isMimSavingRateInfoLoading: { type: Boolean },
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
      mimIcon,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId != this.mimSavingRateInfo?.chainId;
    },

    isTokenApproved() {
      if (!this.mimSavingRateInfo) return false;
      const { approvedAmount } = this.mimSavingRateInfo.userInfo.stakeToken;
      return approvedAmount >= this.actionConfig.stakeAmount;
    },

    maxInputValue() {
      return this.isStakeAndLock
        ? this.mimSavingRateInfo?.userInfo.stakeToken.balance || 0n
        : this.mimSavingRateInfo?.userInfo.balances.unlocked || 0n;
    },

    fromPromoLink() {
      return this.$route.query?.promo == "promo";
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

  watch: {
    fromPromoLink(isPromo) {
      if (isPromo) this.actionType = "lock";
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTimestampToUnix,

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
          this.mimSavingRateInfo?.stakingToken.decimals || 18
        );
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
        this.mimSavingRateInfo?.lockingMultiRewardsContract,
        this.actionConfig.lockAmount,
        this.lockingDeadline
      );

      await this.deleteNotification(notificationId);

      if (error) {
        await this.createNotification(error);
      } else {
        this.$emit("updateMimSavingRateInfo");
        await this.createNotification(notification.success);
        this.resetAmounts();
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
        this.mimSavingRateInfo?.lockingMultiRewardsContract,
        this.actionConfig.stakeAmount,
        this.lockingDeadline
      );

      await this.deleteNotification(notificationId);

      if (error) {
        await this.createNotification(error);
      } else {
        this.$emit("updateMimSavingRateInfo");
        await this.createNotification(notification.success);
        this.resetAmounts();
      }
    },

    async actionHandler() {
      if (this.actionValidationData.isDisabled) return false;

      if (!this.account && !this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (this.isUnsupportedChain) {
        switchNetwork(this.mimSavingRateInfo?.chainId);
        return false;
      }

      if (this.isStakeAndLock) {
        await this.stakeAndLockActionHandler();
      } else {
        await this.lockActionHandler();
      }
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
    LockInfo: defineAsyncComponent(() =>
      import("@/components/msr/LockInfo.vue")
    ),
    RowSkeleton: defineAsyncComponent(() =>
      import("@/components/ui/skeletons/RowSkeleton.vue")
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

.description-wrap {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.description {
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  line-height: 26px;
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
  background-position: right 0 bottom 0;
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.notification-message {
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
