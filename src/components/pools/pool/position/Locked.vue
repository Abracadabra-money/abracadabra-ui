<template>
  <div class="locked">
    <FounderBoostCard :lpToken="lpToken" :tokensList="tokensList" />

    <ul class="locks-list">
      <UserLock v-for="(lock, index) in 10" :key="index" />
    </ul>

    <BaseButton primary>See dashbord</BaseButton>
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
    FounderBoostCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/FounderBoostCard.vue")
    ),
    UserLock: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/UserLock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.locked {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.locks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 122px;
  padding-right: 10px;
  margin-right: -18px;
  list-style: none;
  overflow: auto;
}
</style>
