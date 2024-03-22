<template>
  <div :class="['deposit-card', 'pool', { locked: isLocked }]">
    <div class="label">Founder Boost</div>

    <div class="pool-info">
      <TokenChainIcon
        class="pool-icon"
        :icon="lpToken.icon"
        :name="lpToken.name"
        :chainId="81457"
        size="44px"
      />
      <div class="pool-text">
        <p class="pool-name">{{ lpToken.name }} Pool</p>
        <p class="values-description">Receive 20% of total ecosystem points</p>
      </div>
    </div>

    <div class="total-by-token">
      <div
        class="token-part"
        :key="index"
        v-for="(token, index) in lpPartsExpected"
      >
        <BaseTokenIcon :name="token.name" :icon="token.icon" size="32px" />
        $
        {{ token.amount }}
      </div>
    </div>

    <div class="divider"></div>

    <div class="lp-balance">
      <span class="token-name">
        <BaseTokenIcon :name="lpToken.name" :icon="lpToken.icon" size="32px" />
        MLP
      </span>
      <div class="token-amount">
        <span class="value">{{ lpToken.amount }}</span>
        <span class="usd">{{ lpToken.amountUsd }}</span>
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

    stakeType() {
      return this.isLocked ? "locked" : "unlocked";
    },

    labelText() {
      return this.isLocked ? "Founder" : "LP’er";
    },
  },

  methods: {
    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    TokenChainIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/TokenChainIcon.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposit-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #8b8b03;
  border-radius: 16px;
  padding: 21px 12px 16px 12px;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  backdrop-filter: blur(12.5px);
  color: white;
  transition: all 0.5s ease-in-out;
}

.locked {
  background: linear-gradient(
      104deg,
      rgba(251, 253, 3, 0.21) 0%,
      rgba(251, 253, 3, 0.21) 28.64%,
      rgba(254, 255, 172, 0.21) 52.14%,
      rgba(253, 255, 0, 0.21) 70.64%,
      rgba(253, 255, 0, 0.21) 100%
    ),
    linear-gradient(
      146deg,
      rgba(35, 0, 0, 0.07) 0%,
      rgba(156, 0, 0, 0.07) 101.49%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
}

.label {
  position: absolute;
  top: -1px;
  left: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 117px;
  height: 25px;
  border-radius: 16px 0 8px 0px;
  background: #fcfd02;
  color: #000;
  font-size: 12px;
  font-weight: 500;
}

.pool-info {
  display: flex;
  align-items: center;
  margin: 12px 0 16px 0;
}

.pool-text {
  text-align: start;
}

.pool-name {
  font-size: 20px;
}

.values-description {
  font-size: 16px;
}

.total-by-token {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.token-part {
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 32px;
  flex-grow: 1;
}

.lp-balance {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-name {
  display: flex;
  align-items: center;
}

.token-amount {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.value {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: -8px;
}

.usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.divider {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0) 0.01%,
    rgba(255, 255, 255, 0.12) 46.96%,
    rgba(255, 255, 255, 0) 100%
  );
  width: 100%;
  height: 1px;
  margin: 12px auto 4px auto;
}

@media screen and (max-width: 600px) {
  .pool-name {
    font-size: 18px;
    margin-top: 4px;
    margin-bottom: -4px;
  }

  .values-description {
    font-size: 14px;
  }

  .token-part {
    font-size: 18px;
  }
}
</style>
