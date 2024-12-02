<template>
  <div class="staked">
    <p class="position-title">Your Staked Magic LP</p>

    <div class="card-wrap">
      <PoolCompoundCard
        :lpToken="lpToken"
        :tokensList="tokensList"
        v-if="isUserPositionOpen"
      />

      <NoPositionCard v-else />
    </div>

    <RewardsWrap :pool="pool" v-if="earnedBalance || rewardPointsType" />

    <BaseButton
      v-if="showButton"
      primary
      @click="actionHandler"
      :disabled="isButtonDisabled"
    >
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script>
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { RewardPointsTypes } from "@/configs/pools/types";

export default {
  emits: ["updatePoolInfo"],
  props: {
    pool: { type: Object },
    isUserPositionOpen: { type: Boolean },
  },

  data() {
    return {
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),
    showButton() {
      return this.hasStakeLogic &&
        (this.isUserPositionOpen || this.earnedBalance) &&
        !this.rewardPointsType && !this.pool.settings.isDeprecated
    },
    hasLockLogic() {
      return !!this.pool.lockInfo;
    },
    hasStakeLogic() {
      return !!this.pool.stakeInfo;
    },
    rewardPointsType() {
      return this.pool.config.settings.rewardPointsType;
    },
    stakedBalance() {
      if (this.hasLockLogic) return this.pool.lockInfo.balances.unlocked;
      return this.pool.stakeInfo.balance;
    },
    earnedBalance() {
      if (!this.hasStakeLogic) return 0n;

      return !!this.pool.stakeInfo.earnedInfo.find((item) => item.earned > 0n);
    },
    isProperNetwork() {
      return this.chainId == this.pool.chainId;
    },
    isButtonDisabled() {
      if (!this.isProperNetwork) return false;
      if (!this.account) return false;

      if (this.isActionProcessing || this.earnedBalance == 0n) return true;

      return false;
    },
    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.isActionProcessing) return "Processing...";
      return "Claim";
    },
    lpToken() {
      return {
        name: this.pool.name,
        icon: this.pool.icon,
        amount: this.formatTokenBalance(
          this.stakedBalance || 0n,
          this.pool.decimals
        ),
        amountUsd: this.formatUSD(
          formatUnits(this.stakedBalance || 0n, this.pool.decimals) *
            this.pool.price
        ),
      };
    },

    tokensList() {
      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.stakedBalance || 0n,
        this.pool
      );

      const tokensList = [
        {
          name: this.pool.tokens.baseToken.config.name,
          icon: this.pool.tokens.baseToken.config.icon,
          amount: this.formatTokenBalance(
            previewRemoveLiquidityResult.baseAmountOut,
            this.pool.tokens.baseToken.config.decimals
          ),
          amountUsd: this.formatUSD(
            formatUnits(
              previewRemoveLiquidityResult.baseAmountOut,
              this.pool.tokens.baseToken.config.decimals
            ) * this.pool.tokens.baseToken.price
          ),
        },
        {
          name: this.pool.tokens.quoteToken.config.name,
          icon: this.pool.tokens.quoteToken.config.icon,
          amount: this.formatTokenBalance(
            previewRemoveLiquidityResult.quoteAmountOut,
            this.pool.tokens.quoteToken.config.decimals
          ),
          amountUsd: this.formatUSD(
            formatUnits(
              previewRemoveLiquidityResult.quoteAmountOut,
              this.pool.tokens.quoteToken.config.decimals
            ) * this.pool.tokens.quoteToken.price
          ),
        },
      ].filter((e) => e.name && e.amount);

      return tokensList.length ? tokensList : false;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(this.pool.chainId);

      await this.claim();
      this.$emit("updatePoolInfo");
    },
    async claim() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const contract = this.pool.stakeContract;

      try {
        const { request } = await simulateContractHelper({
          address: contract.address,
          abi: contract.abi,
          functionName: "getRewards",
        });

        const hash = await writeContractHelper(request);

        await waitForTransactionReceiptHelper({
          hash,
        });

        this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        console.log("stake lp err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    PoolCompoundCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/PoolCompoundCard.vue")
    ),
    NoPositionCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/NoPositionCard.vue")
    ),
    RewardsWrap: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/RewardsWrap.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.staked {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.position-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
}

.card-wrap {
  padding: 20px 12px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.rewards-wrap {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 31px;
}

.title {
  font-weight: 500;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  list-style: none;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reward-icon {
  width: 24px;
}

.item-value {
  font-size: 16px;
  font-weight: 400;
}
</style>
