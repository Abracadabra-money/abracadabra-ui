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
      :name="mimSavingRateInfo.stakingToken.name"
      :decimals="mimSavingRateInfo.stakingToken.decimals"
      :icon="mimSavingRateInfo.stakingToken.icon"
      :max="maxInputValue"
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

    <div
      class="lock-promo"
      @click="$emit('chooseLockAction')"
      v-if="mimSavingRateInfo.userInfo.balances.unlocked"
    >
      <div class="promo-title">
        <h4 class="promo-message">Lock your Staked MIM for Boosted APR</h4>

        <div class="apr-wrap">
          <span class="apr-message">Boosted APR</span>
          <span class="apr-value">150%</span>
        </div>
      </div>

      <div class="staking-wrap">
        <div class="currently-staked">
          <div class="title">You Currently Staking</div>
          <div class="token-amount">
            <BaseTokenIcon
              :icon="mimSavingRateInfo.stakingToken.icon"
              name="MIM"
              size="32px"
            />
            {{ formatAmount(mimSavingRateInfo.userInfo.balances.unlocked) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/mimSavingRate/actions";
import { formatTokenBalance } from "@/helpers/filters";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { validateAction } from "@/helpers/mimSavingRate/validators";

type ActiveTab = "stake" | "unstake";
type TabItems = string[];
type InputValue = string | bigint;
type ActionConfig = {
  stakeAmount: bigint;
  withdrawAmount: bigint;
  lockAmount: bigint;
};

const ACTION_LOCK = "lock";

export default {
  emits: ["chooseLockAction", "updateMimSavingRateInfo"],

  props: {
    mimSavingRateInfo: { type: Object, required: true },
  },

  data() {
    return {
      activeTab: "stake" as ActiveTab,
      tabItems: ["stake", "unstake"] as TabItems,
      inputValue: "" as InputValue,
      actionConfig: {
        stakeAmount: 0n,
        withdrawAmount: 0n,
        lockAmount: this.mimSavingRateInfo.userInfo.unlocked,
      } as ActionConfig,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.mimSavingRateInfo.chainId;
    },

    isStakeAction() {
      return this.activeTab === "stake";
    },

    titleText() {
      return this.isStakeAction ? "Stake" : "Unstake";
    },

    isTokenApproved() {
      const { approvedAmount } = this.mimSavingRateInfo.userInfo.stakeToken;
      return approvedAmount >= this.actionConfig.stakeAmount;
    },

    actionMethodName() {
      return this.isStakeAction ? "stake" : "withdraw";
    },

    maxInputValue() {
      const { balance } = this.mimSavingRateInfo.userInfo.stakeToken;
      const { unlocked } = this.mimSavingRateInfo.userInfo;

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

    lockValidationData() {
      return validateAction(
        this.mimSavingRateInfo,
        ACTION_LOCK,
        this.chainId,
        this.actionConfig
      );
    },
  },

  watch: {
    mimSavingRateInfo() {
      this.actionConfig.lockAmount = this.mimSavingRateInfo.userInfo.unlocked;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    resetAmounts() {
      this.inputValue = "";

      this.actionConfig = {
        stakeAmount: 0n,
        withdrawAmount: 0n,
        lockAmount: this.mimSavingRateInfo.userInfo.unlocked,
      };
    },

    changeTab(action: ActiveTab) {
      this.resetAmounts();
      this.activeTab = action;
    },

    formatAmount(amount: bigint) {
      return formatTokenBalance(
        formatUnits(amount, this.mimSavingRateInfo.stakingToken.decimals)
      );
    },

    onUpdateStakeValue(value: bigint) {
      this.inputValue = !value
        ? ""
        : formatUnits(value, this.mimSavingRateInfo.stakingToken.decimals);

      if (this.isStakeAction) {
        this.actionConfig.stakeAmount = value;
      } else {
        this.actionConfig.withdrawAmount = value;
      }
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.mimSavingRateInfo.stakingToken.contract,
        this.mimSavingRateInfo.lockingMultiRewardsContract.address
      );

      if (approve) this.$emit("updateMimSavingRateInfo");

      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
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

      if (!this.isTokenApproved) {
        await this.approveTokenHandler();
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await actions[this.actionMethodName](
        this.mimSavingRateInfo.lockingMultiRewardsContract,
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

    async lockActionHandler() {
      if (this.lockValidationData.isDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) {
        return switchNetwork(this.mimSavingRateInfo.chainId);
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await actions.lock(
        this.mimSavingRateInfo.lockingMultiRewardsContract,
        this.actionConfig.lockAmount
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
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  width: min-content;
}

.lock-promo {
  display: flex;
  flex-direction: column;
  gap: 21px;
  margin-top: auto;
  padding: 16px;
  border-radius: 16px;
  background: url("../../../assets/images/msr/mim-bg-image.png"),
    linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.34) 0%,
      rgba(116, 92, 210, 0.34) 100%
    );
  background-repeat: no-repeat;
  background-position: right 0 bottom 0;
  box-shadow: 0px 4px 29.8px 0px rgba(0, 0, 0, 0.42) inset;
  backdrop-filter: blur(50px);
  cursor: pointer;
}

.currently-staked,
.promo-text {
  width: 50%;
}

.promo-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 42px;
}

.promo-message {
  max-width: 241px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
}

.apr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 90px;
}

.apr-message {
  font-size: 14px;
  font-weight: 500;
}

.apr-value {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 32px;
  font-weight: 500;
}

.staking-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.currently-staked {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  font-size: 18px;
  width: 175px;
}

.title {
  font-size: 14px;
  font-weight: 500;
}

.token-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 38px;
}

.default-button {
  margin-top: 0 !important;
}

.promo-text {
  width: 200px;
  text-align: right;
  font-size: 16px;
}

.lock-action-button {
  margin-top: auto;
  width: auto !important;
}

@media (max-width: 500px) {
  .lock-promo {
    margin-top: 0;
  }

  .apr-value {
    font-size: 28px;
  }

  .promo-message {
    font-size: 18px;
  }

  .token-amount {
    font-size: 32px;
  }
}
</style>
