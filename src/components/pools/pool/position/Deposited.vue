<template>
  <div class="deposited">
    <PoolCompoundCard :lpToken="lpToken" :tokensList="tokensList" />

    <div class="rewards-wrap">
      <h4 class="title">Stake your LP tokens</h4>

      <h5 class="subtitle-wrap">
        <span class="subtitle">Rewards</span>
        <span class="pool-rate">
          Pool Rate
          <Tooltip tooltip="tooltip" :width="20" :height="20" />
        </span>
      </h5>

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

          <span class="item-value">{{ reward.value }}</span>
        </li>
      </ul>
    </div>

    <BaseButton primary @click="actionHandler" :disabled="isButtonDisabled">
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
    userPointsStatistics: { type: Object },
  },

  data() {
    return {
      rewardsPerHour: {
        pointsReward: 0,
        goldReward: 0,
      },
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isAllowed() {
      return this.pool.lockInfo.allowance >= this.pool.userInfo.balance;
    },

    isValid() {
      return !!this.pool.userInfo.balance;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";

      if (this.isActionProcessing) return "Processing...";
      if (!this.isAllowed) return "Approve";

      return "Stake now";
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
          this.formatTokenBalance(
            this.pool.userInfo.balance,
            this.pool.decimals
          ) * this.pool.price
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
            this.formatTokenBalance(
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
            this.formatTokenBalance(
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
          value: "Coming soon",
        },
      ];
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

      this.rewardsPerHour = await getRewardsPerHour(this.pool, deposit);
    },

    async approveHandler() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      try {
        await approveTokenViem(
          this.pool.contract,
          this.pool.lockContract.address
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
        const { request } = await simulateContractHelper({
          address: this.pool.lockContract.address,
          abi: this.pool.lockContract.abi,
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
        this.resetInput();
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

    onUpdate() {
      this.$emit("updateInfo");
    },
  },

  async updated() {
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
  },
};
</script>

<style lang="scss" scoped>
.deposited {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subtitle-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtitle {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.45px;
}

.pool-rate {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.rewards-wrap {
  display: flex;
  flex-direction: column;
  gap: 7px;
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
