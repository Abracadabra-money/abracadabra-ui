<template>
  <div class="staked">
    <PoolCompoundCard :lpToken="lpToken" :tokensList="tokensList" />

    <div class="rewards-wrap">
      <h4 class="title">Staking rewards earned</h4>

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

    <BaseButton primary @click="goToDashboard()">See dashborad</BaseButton>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    pool: { type: Object },
    userPointsStatistics: { type: Object },
  },

  computed: {
    lpToken() {
      return {
        name: this.pool.name,
        icon: this.pool.icon,
        amount: this.formatTokenBalance(
          this.pool.lockInfo.balances.unlocked || 0n,
          this.pool.decimals
        ),
        amountUsd: this.formatUSD(
          this.formatTokenBalance(
            this.pool.lockInfo.balances.unlocked || 0n,
            this.pool.decimals
          ) * this.pool.price
        ),
      };
    },

    tokensList() {
      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.pool.lockInfo.balances.unlocked || 0n,
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
          value: formatTokenBalance(
            this.userPointsStatistics?.liquidityPoints?.lp?.finalized || 0
          ),
        },
        {
          title: "Gold",
          icon: useImage("assets/images/points-dashboard/gold-points.svg"),
          value: formatTokenBalance(
            this.userPointsStatistics?.developerPoints?.lp?.finalized || 0
          ),
        },
        {
          title: "Potion",
          icon: useImage("assets/images/points-dashboard/potion.png"),
          value: "0.0",
        },
      ];
    },
  },

  methods: {
    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    goToDashboard() {
      this.$router.push({
        name: "PointsDashboard",
      });
    },
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    PoolCompoundCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/PoolCompoundCard.vue")
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
