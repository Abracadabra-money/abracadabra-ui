<template>
  <div class="locked-tokens-card">
    <h4 class="header">Balances of Locked Tokens</h4>

    <div class="total-by-token">
      <div class="token-part" :key="index" v-for="(token, index) in tokensInfo">
        <BaseTokenIcon :name="token.name" :icon="token.icon" size="32px" />
        {{ token.amount }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";

export default {
  props: {
    stakeInfo: { type: Object },
    isLocked: { type: Boolean, default: false },
  },

  computed: {
    lpInfo() {
      return this.stakeInfo?.lpInfo;
    },

    lpToken() {
      return {
        name: this.lpInfo.name,
        icon: this.lpInfo.icon,
        amount: this.formatTokenBalance(
          this.stakeInfo.lpBalance,
          this.lpInfo.decimals
        ),
        amountUsd: formatUSD(
          this.formatTokenBalance(
            this.stakeInfo.lpBalance,
            this.lpInfo.decimals
          ) * this.lpInfo.price
        ),
      };
    },

    // lockedTokens() {
    //   return this.stakeInfo.data.tokensInfo.map(token => {
    //     return {
    //       name: token.config.name,
    //     icon: token.config.icon,
    //     amount: this.formatTokenBalance(
    //       token.userInfo.balances.locked,
    //       token.config.decimals
    //     )
    //     }

    //   }
    // },

    tokensInfo() {
      return this.stakeInfo.data.tokensInfo.map((token) => {
        return {
          name: token.config.name,
          icon: token.config.icon,
          amount: this.formatTokenBalance(
            token.userInfo.balances.locked,
            token.config.decimals
          ),
          amountUsd: formatUSD(
            this.formatTokenBalance(
              token.userInfo.balances.locked,
              token.config.decimals
            ) * token.config.price
          ),
        };
      });
    },

    lpPartsExpected() {
      const lpPartsOut = previewRemoveLiquidity(
        this.stakeInfo.lpBalance,
        this.lpInfo
      );

      return [
        {
          name: this.stakeInfo.tokensInfo[1].config.name,
          icon: this.stakeInfo.tokensInfo[1].config.icon,
          amount: this.formatTokenBalance(
            lpPartsOut.baseAmountOut,
            this.stakeInfo.tokensInfo[1].config.decimals
          ),
        },

        {
          name: this.stakeInfo.tokensInfo[0].config.name,
          icon: this.stakeInfo.tokensInfo[0].config.icon,
          amount: this.formatTokenBalance(
            lpPartsOut.quoteAmountOut,
            this.stakeInfo.tokensInfo[0].config.decimals
          ),
        },
      ];
    },
  },

  methods: {
    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.locked-tokens-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 232px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.header {
  font-size: 24px;
  font-weight: 500;
}

.total-by-token {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-grow: 1;
  width: 100%;
}

.token-part {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .locked-tokens-card {
    height: auto;
  }

  .header {
    font-size: 20px;
  }

  .total-by-token {
    gap: 20px;
  }
}
</style>
