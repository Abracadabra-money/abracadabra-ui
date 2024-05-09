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

    <div
      class="lock-promo"
      @click="$emit('chooseLockAction')"
      v-if="mimSavingRateInfo?.userInfo.balances.unlocked"
    >
      <div class="promo-title">
        <h4 class="promo-message">Lock your Staked MIM for Boosted APR</h4>

        <div class="apr-wrap">
          <span class="apr-message">Boosted APR</span>
          <RowSkeleton v-if="isMimSavingRateInfoLoading" />
          <span class="apr-value" v-else>{{ formatPercent(boostedApr) }}</span>
        </div>
      </div>

      <div class="staking-wrap">
        <div class="currently-staked">
          <div class="title">You Currently Staking</div>

          <RowSkeleton v-if="isMimSavingRateInfoLoading" />
          <div class="token-amount" v-else>
            <BaseTokenIcon
              :icon="mimSavingRateInfo?.stakingToken.icon || mimIcon"
              :name="mimSavingRateInfo?.stakingToken.name || 'MIM'"
              size="32px"
            />
            {{ formatAmount(mimSavingRateInfo?.userInfo.balances.unlocked) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import moment from "moment";
import { formatUnits } from "viem";
import { approveTokenViem } from "@/helpers/approval";
import actions from "@/helpers/mimSavingRate/actions";
import { formatTokenBalance, formatPercent } from "@/helpers/filters";
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

    isUnsupportedChain() {
      return this.chainId === this.mimSavingRateInfo?.chainId;
    },

    isStakeAction() {
      return this.activeTab === "stake";
    },

    titleText() {
      return this.isStakeAction ? "Stake" : "Unstake";
    },

    isTokenApproved() {
      const { approvedAmount } =
        this.mimSavingRateInfo?.userInfo.stakeToken || 0n;
      return approvedAmount >= this.actionConfig.stakeAmount;
    },

    actionMethodName() {
      return this.isStakeAction ? "stake" : "withdraw";
    },

    maxInputValue() {
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

    boostedApr() {
      return (this.mimSavingRateInfo?.baseApr || 0n) * 3;
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

    formatAmount(amount: bigint) {
      return formatTokenBalance(
        formatUnits(amount, this.mimSavingRateInfo?.stakingToken.decimals || 18)
      );
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
      if (!this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.mimSavingRateInfo?.stakingToken.contract,
        this.mimSavingRateInfo?.lockingMultiRewardsContract.address
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
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
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

.row-skeleton {
  background-image: linear-gradient(
    90deg,
    #2d4b966d 0px,
    #745cd27a 60px,
    #2d4b966d 120px
  ) !important;
}

.apr-wrap .row-skeleton {
  height: 24px !important ;
}

.currently-staked .row-skeleton {
  height: 32px !important ;
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
