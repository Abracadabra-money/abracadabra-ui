<template>
  <div class="apr-efficiency">
    <EfficiencyIndicator
      :aprEfficiency="aprEfficiency"
      :userApr="userApr"
      :baseApr="baseApr"
      :boostedApr="boostedApr"
      :isDeposit="isDeposit"
      :isMimSavingRateInfoLoading="isMimSavingRateInfoLoading"
    />

    <div class="efficiency-info">
      <div class="efficiency-title">
        APR Efficiency
        <Tooltip :width="20" :height="20" />
      </div>

      <p class="efficiency-description">{{ efficiencyDescription }}</p>

      <BaseButton
        @click="actionHandler"
        :disabled="actionValidationData.isDisabled"
      >
        {{ actionValidationData.btnText }}
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatUnits } from "viem";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";
import { validateAction } from "@/helpers/mimSavingRate/validators";
import actions from "@/helpers/mimSavingRate/actions";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { approveTokenViem } from "@/helpers/approval";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import moment from "moment";

export default {
  emits: ["updateMimSavingRateInfo"],

  props: {
    mimSavingRateInfo: {
      type: Object as PropType<MimSavingRateInfo | null>,
      required: true,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return {
      actionConfig: {
        stakeAmount: this.mimSavingRateInfo?.userInfo?.unlocked || 0n,
        //todo: temporary untill understand how it should work properly
        lockingDeadline: moment().unix() + Number(300n),
      },
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    efficiencyDescription() {
      return "Lock your Staked MIM for 3 months to get maximum APR Efficiency ";
    },

    baseApr() {
      return this.mimSavingRateInfo?.baseApr || 0;
    },

    boostedApr() {
      return this.baseApr * 3;
    },

    isDeposit() {
      if (this.isMimSavingRateInfoLoading) return false;
      const { unlocked, locked } = this.mimSavingRateInfo!.userInfo.balances;
      return unlocked > 0n || locked > 0n;
    },

    userApr() {
      if (this.isMimSavingRateInfoLoading) return 0;

      const { unlocked, locked } = this.mimSavingRateInfo!.userInfo.balances;
      const decimals = this.mimSavingRateInfo!.stakingToken.decimals;

      const formattedStaked = Number(formatUnits(unlocked, decimals));
      const formattedLocked = Number(formatUnits(locked, decimals));

      return (
        (formattedStaked * this.baseApr + formattedLocked * this.boostedApr) /
          (formattedStaked + formattedLocked) || 0
      );
    },

    aprEfficiency() {
      if (this.isMimSavingRateInfoLoading) return 0;

      return (this.userApr * 100) / (this.boostedApr - this.baseApr) || 0;
    },

    isUnsupportedChain(): boolean {
      return (
        this.chainId != (this.mimSavingRateInfo?.chainId || ARBITRUM_CHAIN_ID)
      );
    },

    isTokenApproved(): boolean {
      if (!this.mimSavingRateInfo) return false;
      const { approvedAmount } =
        this.mimSavingRateInfo?.userInfo?.stakeToken || 0n;

      return approvedAmount >= this.actionConfig.stakeAmount;
    },

    actionValidationData() {
      if (!this.mimSavingRateInfo)
        return {
          isAllowed: false,
          isDisabled: true,
          btnText: "Lock unavailable",
        };
      return validateAction(
        this.mimSavingRateInfo,
        "lock",
        this.chainId,
        this.actionConfig,
        this.isActionProcessing
      );
    },
  },

  watch: {
    mimSavingRateInfo: {
      handler(value) {
        this.actionConfig.stakeAmount = value?.userInfo?.unlocked || 0n;
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

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
      }
      {
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

      const { error }: any = await actions.lock(
        this.mimSavingRateInfo!.lockingMultiRewardsContract,
        this.actionConfig
      );

      await this.deleteNotification(notificationId);

      if (error) {
        await this.createNotification(error);
      } else {
        this.$emit("updateMimSavingRateInfo");
        await this.createNotification(notification.success);
      }
      this.isActionProcessing = false;
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    EfficiencyIndicator: defineAsyncComponent(
      () => import("@/components/msr/apr-efficiency/EfficiencyIndicator.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.title-tooltip {
  display: flex;
  align-items: center;
}

.apr-efficiency {
  @include block-wrap;
  display: flex;
  justify-content: space-between;
  gap: 21px;
}

.efficiency-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.efficiency-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.efficiency-description {
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

.default-button {
  padding: 9px 24px !important;
  height: 39px !important;
  border-radius: 10px !important;
}

@media (max-width: 500px) {
  .apr-efficiency {
    flex-direction: column;
    padding: 0;
    border-radius: 0;
    border: none;
    background: none;
    box-shadow: none;
    backdrop-filter: none;
  }
}
</style>
