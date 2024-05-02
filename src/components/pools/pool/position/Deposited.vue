<template>
  <div class="deposited">
    <PoolCompoundCard :lpToken="lpToken" :tokensList="tokensList" />

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

    <BaseButton primary @click="actionHandler" :disabled="isButtonDisabled">
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
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
import type { PoolInfo } from "@/configs/pools/types";
import type { PointsStatistics } from "@/helpers/blast/stake/points";
import type {
  PoolPositionTokenInfo,
  RewardItemInfo,
} from "@/components/pools/pool/position/PoolPosition.vue";

export default {
  props: {
    pool: { type: Object as PropType<PoolInfo>, required: true },
    pointsStatistics: {
      type: Object as PropType<{
        user: PointsStatistics;
        global: PointsStatistics;
      }>,
      required: true,
    },
  },

  data() {
    return {
      rewardsPerHour: {
        pointsReward: 0,
        goldReward: 0,
      },
      isActionProcessing: false,
      isRewardsCalculating: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isAllowed(): boolean {
      if (!this.pool.lockInfo) return false;
      return this.pool.lockInfo.allowance >= this.pool.userInfo.balance;
    },

    isValid(): boolean {
      return !!this.pool.userInfo.balance;
    },

    buttonText(): string {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";

      if (this.isActionProcessing) return "Processing...";
      if (!this.isAllowed) return "Approve";

      return "Stake now";
    },

    isProperNetwork(): boolean {
      return this.chainId == this.pool.chainId;
    },

    isButtonDisabled(): boolean {
      return (
        (!this.isValid || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    lpToken(): PoolPositionTokenInfo {
      return {
        name: this.pool.name,
        icon: this.pool.icon,
        amount: this.formatTokenBalance(
          this.pool.userInfo.balance,
          this.pool.decimals
        ),
        amountUsd: this.formatUSD(
          Number(formatUnits(this.pool.userInfo.balance, this.pool.decimals)) *
            this.pool.price
        ),
      };
    },

    tokensList(): PoolPositionTokenInfo[] {
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
            Number(
              formatUnits(
                previewRemoveLiquidityResult.baseAmountOut,
                this.pool.tokens.baseToken.config.decimals
              )
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
            Number(
              formatUnits(
                previewRemoveLiquidityResult.quoteAmountOut,
                this.pool.tokens.quoteToken.config.decimals
              )
            ) * this.pool.tokens.quoteToken.price
          ),
        },
      ].filter((e) => e.name && e.amount);

      return tokensList.length ? tokensList : [];
    },

    rewardsList(): RewardItemInfo[] {
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

      try {
        if (!this.pool || !this.pool.lockContract)
          throw new Error("Current pool doesnt have lock contract");

        await approveTokenViem(
          this.pool.contract,
          this.pool.lockContract.address,
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

      try {
        if (!this.pool || !this.pool.lockContract)
          throw new Error("Current pool doesnt have lock contract");

        const { request }: any = await simulateContractHelper({
          address: this.pool.lockContract.address,
          abi: this.pool.lockContract.abi,
          functionName: "stake",
          args: [this.pool.userInfo.balance],
        });

        const hash = await writeContractHelper(request);

        await waitForTransactionReceiptHelper({
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
      if (!this.isProperNetwork) return switchNetwork(this.pool!.chainId);
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isAllowed) return await this.approveHandler();

      await this.stakeHandler();

      await this.$emit("updatePoolInfo");
    },

    formatTokenBalance(value: bigint, decimals: number): string | number {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  async created() {
    this.isRewardsCalculating = true;
    await this.getRewardsPerHour();
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    PoolCompoundCard: defineAsyncComponent(
      () =>
        import("@/components/pools/pool/position/cards/PoolCompoundCard.vue")
    ),
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
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
