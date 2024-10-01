<template>
  <div class="deposited">
    <PoolCompoundCard :lpToken="lpToken" :tokensList="tokensList" />

    <RewardsCard :isPosition="true" :pool="pool" />

    <BaseButton
      v-if="hasLockLogic || hasStakeLogic"
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
import { approveTokenViem } from "@/helpers/approval";
import { mapActions, mapGetters, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export default {
  props: {
    pool: { type: Object },
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

    hasLockLogic() {
      return !!this.pool.lockInfo;
    },
    hasStakeLogic() {
      return !!this.pool.stakeInfo;
    },
    isAllowed() {
      if (!this.hasLockLogic && !this.hasStakeLogic) return false;

      if (this.hasLockLogic)
        return this.pool.lockInfo.allowance >= this.pool.userInfo.balance;
      return this.pool.stakeInfo.allowance >= this.pool.userInfo.balance;
    },

    isValid() {
      return !!this.pool.userInfo.balance;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";

      if (this.isActionProcessing) return "Processing...";
      if (!this.isAllowed) return "Approve for Staking";

      return "Stake all";
    },

    isProperNetwork() {
      return this.chainId == this.pool.chainId;
    },

    isButtonDisabled() {
      return (
        (!this.isValid || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    lpToken() {
      return {
        name: this.pool.name,
        icon: this.pool.icon,
        amount: this.formatTokenBalance(
          this.pool.userInfo.balance,
          this.pool.decimals
        ),
        amountUsd: this.formatUSD(
          formatUnits(this.pool.userInfo.balance, this.pool.decimals) *
            this.pool.price
        ),
      };
    },

    tokensList() {
      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.pool.userInfo.balance,
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

    async approveHandler() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const contract = this.hasLockLogic
        ? this.pool.lockContract
        : this.pool.stakeContract;

      try {
        await approveTokenViem(
          this.pool.contract,
          contract.address,
          this.pool.userInfo.balance
        );
        await this.$emit("updatePoolInfo");

        await this.deleteNotification(notificationId);
      } catch (error) {
        console.log("approve err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async stakeHandler() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const contract = this.hasLockLogic
        ? this.pool.lockContract
        : this.pool.stakeContract;

      try {
        const { request } = await simulateContractHelper({
          address: contract.address,
          abi: contract.abi,
          functionName: "stake",
          args: [this.pool.userInfo.balance],
        });

        const hash = await writeContractHelper(request);

        const { result, error } = await waitForTransactionReceiptHelper({
          hash,
        });

        await this.$emit("updatePoolInfo");

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        console.log("stake lp err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async actionHandler() {
      if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(this.pool.chainId);
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isAllowed) return await this.approveHandler();

      await this.stakeHandler();

      await this.$emit("updatePoolInfo");
    },

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    PoolCompoundCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/PoolCompoundCard.vue")
    ),
    RewardsCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/RewardsCard.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.reward-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #fff;
  }
  .reward-item {
    display: flex;
    align-items: center;
    gap: 4px;

    .reward-icon {
      // border-radius: 50%;
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .reward-name {
      font-size: 16px;
    }
  }
}

.deposited {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
}

.rewards-wrap {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 31px;
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

.row-skeleton {
  height: 13px !important;
  background-image: linear-gradient(
    90deg,
    rgb(23, 30, 59) 0px,
    rgb(36, 43, 67) 60px,
    rgb(23, 30, 59) 120px
  ) !important;
}
</style>
