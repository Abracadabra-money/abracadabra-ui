<template>
  <div class="spell-power-claim-block">
    <div class="btn-wrap">
      <h3 class="title">Claimable</h3>

      <button
        :class="['claim-btn', { disabled: isActionDisabled }]"
        :disabled="isActionDisabled"
        @click="actionHandler"
      >
        {{ actionButtonText }}
      </button>
    </div>

    <div class="reward-info" v-if="bSpellInfo">
      <div
        class="row"
        v-for="tokenInfo in bSpellInfo.rewardTokensInfo"
        :key="tokenInfo.name"
      >
        <div class="token-info">
          <img class="token-icon" :src="tokenInfo.icon" alt="" />
          <span class="token-name">{{ tokenInfo.name }}</span>
        </div>
        <div class="token-amounts">
          <span class="token-amount">{{ getRewardAmount(tokenInfo) }}</span>
          <span class="token-amount-usd">{{
            getRewardAmountUsd(tokenInfo)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import type { BSpellInfo } from "@/helpers/bSpell/types";
import { mapActions, mapGetters, mapMutations } from "vuex";
import ErrorHandler from "@/helpers/errorHandler/ErrorHandler";
import notification from "@/helpers/notification/notification";
import { getRewards } from "@/helpers/bSpell/actions/getRewards";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { openConnectPopup } from "@/helpers/connect/utils";

export default {
  emits: ["updateBSpellInfo"],

  props: {
    bSpellInfo: {
      type: Object as PropType<BSpellInfo | null>,
      required: true,
    },

    selectedNetwork: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.selectedNetwork;
    },

    isClaimReward() {
      if (!this.bSpellInfo) return 0;

      return this.bSpellInfo.rewardTokensInfo?.reduce((acc, tokenInfo) => {
        const rewardAmount = Number(
          formatUnits(tokenInfo.rewardAmount, tokenInfo.decimals)
        );
        acc = acc + rewardAmount;
        return acc;
      }, 0);
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      return "Claim";
    },

    isActionDisabled() {
      if (!this.bSpellInfo) return true;
      if (!this.bSpellInfo.stakeInfo) return true;
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.isClaimReward) return true;
      return false;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    getRewardAmount(tokenInfo: any) {
      return formatTokenBalance(
        formatUnits(tokenInfo.rewardAmount, tokenInfo.decimals)
      );
    },

    getRewardAmountUsd(tokenInfo: any) {
      return formatUSD(
        Number(formatUnits(tokenInfo.rewardAmount, tokenInfo.decimals)) *
          tokenInfo.price
      );
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) return openConnectPopup();

      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedNetwork);
        return false;
      }

      await this.claimHandler();
    },

    async claimHandler() {
      try {
        const notificationId = await this.createNotification(
          notification.pending
        );

        await getRewards(this.bSpellInfo!.stakeInfo!.contract);
        this.$emit("updateBSpellInfo");

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        ErrorHandler.handleError(error as Error);
      }
    },
  },
};
</script>

<style scoped>
.spell-power-claim-block {
  padding: 14px 20px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.29) 0%,
    rgba(0, 80, 156, 0.29) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  background: url("@/assets/images/bSpell/claim-bg.png") no-repeat;
  background-size: cover;
}

.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.claim-btn {
  cursor: pointer;
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  padding: 9px;
  min-width: 90px;
  border-radius: 10px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reward-info {
  gap: 4px;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-info {
  gap: 8px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;
}

.token-name {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.token-amounts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.token-amount {
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.token-amount-usd {
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 16px;
  }

  .btn-wrap {
    margin-bottom: 8px;
  }

  .token-name {
    font-size: 14px;
  }
}
</style>
