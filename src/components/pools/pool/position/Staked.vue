<template>
  <div class="staked">
    <PoolCompoundCard :lpToken="lpToken" :tokensList="tokensList" />

    <div class="rewards-wrap">
      <h4 class="title">Staking rewards earned</h4>

      <ul class="rewards-list">
        <li class="list-item">
          <span class="item-title">
            <img
              src="@/assets/images/points-dashboard/blast.png"
              class="reward-icon"
            />
            Points
          </span>

          <span class="item-value">5,311.55</span>
        </li>

        <li class="list-item">
          <span class="item-title">
            <img
              src="@/assets/images/points-dashboard/gold-points.svg"
              class="reward-icon"
            />
            Gold
          </span>

          <span class="item-value">5,311.55</span>
        </li>

        <li class="list-item">
          <span class="item-title">
            <img
              src="@/assets/images/points-dashboard/potion.png"
              class="reward-icon"
            />
            Potion
          </span>

          <span class="item-value">5,311.55</span>
        </li>
      </ul>
    </div>

    <BaseButton primary>See dashborad</BaseButton>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { fetchUserPointsStatistics } from "@/helpers/blast/stake/points";

export default {
  props: {
    pool: { type: Object },
    isProperNetwork: { type: Boolean },
  },

  data() {
    return {
      userPointsStatistics: null,
      activeTab: "deposited",
      tabItems: ["deposited", "staked", "locked"],
    };
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

    disableEarnedButton() {
      return true;
    },
  },

  methods: {
    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    prepBalanceData(tokenValue, priceValue) {
      const usd = formatUSD(tokenValue * priceValue);
      const earned = formatTokenBalance(tokenValue);
      return {
        earned,
        usd,
      };
    },

    selectTab(action) {
      this.activeTab = action;
    },

    onUpdate() {
      this.$emit("updateInfo");
    },

    closePopup() {
      this.$emit("closePopup");
    },
  },

  async created() {
    this.userPointsStatistics = await fetchUserPointsStatistics(this.account);
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
