<template>
  <div class="deposited">
    <p class="position-title">Your Magic LP</p>

    <div class="card-wrap">
      <PoolCompoundCard
        :lpToken="lpToken"
        :tokensList="tokensList"
        v-if="isUserPositionOpen"
      />

      <NoPositionCard v-else />
    </div>

    <div class="staking-apr" v-if="isPoolHasReward">
      <p class="title">
        <img
          src="@/assets/images/pools/pool/staking-apr-image.svg"
          class="staking-apr-image"
        />
        Staking APR
      </p>

      <div class="reward-items">
        <img
          :src="reward.token.icon"
          alt=""
          class="reward-icon"
          v-for="(reward, index) in poolRewards"
          :key="index"
        />
        <p class="apr">{{ apr }}</p>
      </div>
    </div>

    <div class="staking-rewards" v-if="isPoolHasRewardPoints">
      <p class="title">Staking Rewards</p>
      <ElixirReward isGradient isTitleText/>
    </div>

    <BaseButton primary v-if="hasFarm" @click="goToFarm">
      Go to Farm
    </BaseButton>
  </div>
</template>

<script>
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  formatUSD,
  formatTokenBalance,
  formatPercent,
} from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";

export default {
  props: {
    pool: { type: Object },
    isUserPositionOpen: { type: Boolean, default: false },
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

    isPoolHasReward() {
      return !!this.pool.config.rewardTokens?.length;
    },

    isPoolHasRewardPoints() {
      const { isElixirPotions } = this.pool.config.settings;
      return isElixirPotions;
    },

    poolRewards() {
      if (!this.isPoolHasReward) return;
      return this.pool.config.rewardTokens.map((token, index) => ({
        token,
        apr: this.pool.poolAPR?.tokensApr[index].apr ?? 0,
      }));
    },

    apr() {
      if (!this.pool?.poolAPR) return "0.0%";
      return formatPercent(this.pool.poolAPR.totalApr);
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

    hasFarm() {
      return !!this.pool.stakeContract;
    },
  },

  methods: {
    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    goToFarm() {
      this.$router.push({
        name: "PoolFarm",
        params: { poolChainId: this.pool.chainId, id: this.pool.id },
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
    NoPositionCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/NoPositionCard.vue")
    ),
    ElixirReward: defineAsyncComponent(() =>
      import("@/components/pools/pool/ElixirReward.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.position-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
}

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

.card-wrap {
  padding: 20px 12px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.staking-apr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.staking-rewards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.reward-items {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reward-icon {
  border-radius: 8px;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.reward-icon:not(:first-child) {
  margin-left: -12px;
}

.reward-name {
  font-size: 18px;
}

.apr {
  font-size: 23px;
  font-weight: 600;
  text-shadow: 0px 0px 16px #ab5de8;
}
</style>
