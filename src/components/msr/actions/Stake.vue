<template>
  <div class="action">
    <Tabs
      class="tabs"
      :name="activeTab"
      :items="tabItems"
      @select="changeTab"
    />

    <h2 class="action-title">Stake MIM</h2>

    <BaseTokenInput
      :value="inputValue"
      :name="mimSavingRateInfo.stakingToken.name"
      :decimals="mimSavingRateInfo.stakingToken.decimals"
      :icon="mimSavingRateInfo.stakingToken.icon"
      :max="maxInputValue"
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

    <div class="decorative-layer back">
      <div class="decorative-layer middle">
        <div class="lock-promo">
          <div class="staking-info">
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

            <p class="promo-text">Lock your MIM and Boost your APR to 150%</p>
          </div>

          <BaseButton
            primary
            :disabled="lockValidationData.isDisabled"
            @click="lockActionHandler"
          >
            {{ lockValidationData.btnText }}
          </BaseButton>
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
  emits: ["updateMimSavingRateInfo"],

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
        this.actionConfig,
        false
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
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  padding: 24px;
  border-radius: 0px 0px 20px 20px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.22) 0%,
    rgba(116, 92, 210, 0.22) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-weight: 500;
}

.staking-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.currently-staked,
.promo-text {
  width: 50%;
}

.currently-staked {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 18px;
}

.token-amount {
  display: flex;
  align-items: center;
  font-size: 28px;
}

.promo-text {
  width: 200px;
  text-align: right;
  font-size: 16px;
}

.decorative-layer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0px 0px 20px 20px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.22) 0%,
    rgba(116, 92, 210, 0.22) 100%
  );
}

.middle {
  height: 236px;
}

.back {
  height: 264px;
}
</style>
