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

    <BaseButton primary>Stake now</BaseButton>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    pool: { type: Object },
    userPointsStatistics: { type: Object },
    isProperNetwork: { type: Boolean },
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    chainIcon() {
      return getChainConfig(this.selectedpool.chainId).icon;
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
          value: formatTokenBalance(
            this.userPointsStatistics?.liquidityPoints?.total?.pending || 0
          ),
        },
        {
          title: "Gold",
          icon: useImage("assets/images/points-dashboard/gold-points.svg"),
          value: formatTokenBalance(
            this.userPointsStatistics?.developerPoints?.total?.pending || 0
          ),
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
    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
    onUpdate() {
      this.$emit("updateInfo");
    },
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
