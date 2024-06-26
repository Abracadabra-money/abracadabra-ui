<template>
  <div class="deposited">
    <PoolCompoundCard :lpToken="lpToken" :tokensList="tokensList" />

    <template v-if="pointsStatistics.global">
      <div class="rewards-wrap">
        <h4 class="title">
          Stake your LP tokens
          <Tooltip
            tooltip="Your potential hourly rewards are displayed based on staking all of your LP tokens"
            :width="20"
            :height="20"
          />
        </h4>

        <ul class="rewards-list">
          <li
            class="list-item"
            v-for="(reward, index) in rewardsList"
            :key="index"
          >
            <span class="item-title">
              <img :src="reward.icon" class="reward-icon" />
              {{ reward.title }}
            </span>

            <RowSkeleton v-if="isRewardsCalculating" />
            <span class="item-value" v-else>{{ reward.value }} per hour</span>
          </li>
        </ul>
      </div>
    </template>

    <div class="reward-wrap" v-if="isPoolHasReward && reward">
      <p class="title">Staking Rewards</p>
      <div class="reward-item">
        <img :src="reward.icon" alt="" class="reward-icon" />
        <p class="reward-name">{{ reward.name }}</p>
      </div>
    </div>

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
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatUnits } from "viem";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { getRewardsPerHour } from "@/helpers/pools/getRewardsPerHour";
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { approveTokenViem } from "@/helpers/approval";
import notification from "@/helpers/notification/notification";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    pool: { type: Object },
    pointsStatistics: { type: Object },
  },

  data() {
    return {
      rewardsPerHour: {
        pointsReward: 0,
        goldReward: 0,
      },
      isActionProcessing: false,
      isRewardsCalculating: false,
      rewards: {
        2222: {
          1: {
            icon: useImage("assets/images/networks/kava.png"),
            name: "wKAVA",
          },
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isPoolHasReward() {
      return (
        this.rewards[this.pool.chainId] &&
        this.rewards[this.pool.chainId][this.pool.id]
      );
    },
    reward() {
      if (!this.isPoolHasReward) return;
      return this.rewards[this.pool.chainId][this.pool.id];
    },

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
      if (!this.isAllowed) return "Approve";

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

    rewardsList() {
      return [
        {
          title: "Points",
          icon: useImage("assets/images/points-dashboard/blast.png"),
          value: formatTokenBalance(this.rewardsPerHour.pointsReward || 0),
        },
        {
          title: "Gold",
          icon: useImage("assets/images/points-dashboard/gold-points.svg"),
          value: formatTokenBalance(this.rewardsPerHour.goldReward || 0),
        },
        {
          title: "Potion",
          icon: useImage("assets/images/points-dashboard/potion.png"),
          value: "0.0",
        },
      ];
    },
  },

  watch: {
    pointsStatistics: {
      async handler() {
        this.isRewardsCalculating = true;
        await this.getRewardsPerHour();
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUSD,

    async getRewardsPerHour() {
      if (!this.pointsStatistics.global) return;

      const deposit =
        Number(formatUnits(this.pool.userInfo.balance, this.pool.decimals)) *
        this.pool.price;

      this.rewardsPerHour = await getRewardsPerHour(
        this.pool,
        this.pointsStatistics.global,
        deposit
      );

      this.isRewardsCalculating = false;
    },

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

  async created() {
    if (!this.pointsStatistics.global) return;

    this.isRewardsCalculating = true;
    await this.getRewardsPerHour();
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    PoolCompoundCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/PoolCompoundCard.vue")
    ),
    RowSkeleton: defineAsyncComponent(() =>
      import("@/components/ui/skeletons/RowSkeleton.vue")
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
      border-radius: 50%;
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
