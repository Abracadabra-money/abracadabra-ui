<template>
  <div class="info-blocks">
    <div class="info-block lp">
      <div class="tag">
        <div class="pool-info">
          <BaseTokenIcon :name="pool.name" :icon="pool.icon" size="32px" />
          <div>
            <div class="pool-name">{{ pool.name }}</div>
            <div class="pool-slippage">Slippage included</div>
          </div>
        </div>

        <div class="token-amount">
          <span class="value"> {{ lpInfo.value }} </span>
          <span class="usd"> {{ lpInfo.usd }} </span>
        </div>
      </div>

      <div class="line"></div>

      <!-- <div class="row">
        <div class="row-info">
          Price Impact
          <span :class="['status', status]">{{ status }}</span>
        </div>
        <div class="row-value">
          {{ formatPercent(priceImpact) }}
        </div>
      </div> -->

      <div class="row" v-for="refund in refundAmounts" :key="refund.icon">
        <div class="row-info">
          Refund <Tooltip :tooltip="'This amount will be sent back to your wallet due to unbalanced liqudity provision'" />
        </div>
        <div class="row-value">
          <BaseTokenIcon :name="pool.name" :icon="refund.icon" size="24px" />
          {{ refund.amount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import { formatPercent, formatUSD } from "@/helpers/filters";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";

export default {
  props: {
    pool: { type: Object as any },
    slippage: { type: BigInt as any, required: true },
    expectedOptimal: { type: Object as any },
    isExpectedOptimalCalculating: {
      type: Boolean,
      required: true,
    },
    baseInputAmount: {
      type: BigInt as any,
      default: 0n,
    },
    quoteInputAmount: {
      type: BigInt as any,
      default: 0n,
    },
  },

  data() {
    return {
      localPriceImpact: 0,
    };
  },

  computed: {
    lpInfo() {
      if (this.isExpectedOptimalCalculating) return { value: "-", usd: "-" };

      return {
        value: formatTokenBalance(this.formattedLpTokenExpected.value),
        usd: formatUSD(this.formattedLpTokenExpected.usd),
      };
    },

    formattedLpTokenExpected() {
      const minimumShares = applySlippageToMinOutBigInt(
        this.slippage,
        this.expectedOptimal.shares
      );

      const formattedLpTokenValue = Number(
        formatUnits(minimumShares, this.pool.decimals)
      );

      const lpTokenValueUsdEquivalent = formattedLpTokenValue * this.pool.price;

      return {
        value: formattedLpTokenValue,
        usd: lpTokenValueUsdEquivalent,
      };
    },

    status() {
      if (this.priceImpact >= 10) return "high";
      if (this.priceImpact >= 5) return "medium";
      return "safe";
    },

    refundAmounts() {
      if (!this.baseInputAmount && !this.quoteInputAmount)
        return [{ icon: "", amount: formatTokenBalance(0) }];

      const refundAmounts = [];

      if (this.expectedOptimal.baseRefundAmount) {
        refundAmounts.push({
          type: "base",
          icon: this.pool.config.baseToken.icon,
          amount: formatTokenBalance(
            formatUnits(
              this.expectedOptimal.baseRefundAmount,
              this.pool.tokens.baseToken.config.decimals
            )
          ),
        });
      }

      if (this.expectedOptimal.quoteRefundAmount) {
        refundAmounts.push({
          type: "quote",
          icon: this.pool.config.quoteToken.icon,
          amount: formatTokenBalance(
            formatUnits(
              this.expectedOptimal.quoteRefundAmount,
              this.pool.tokens.quoteToken.config.decimals
            )
          ),
        });
      }

      return refundAmounts.length
        ? refundAmounts
        : [{ icon: "", amount: formatTokenBalance(0) }];
    },

    priceImpact() {
      if (!this.baseInputAmount && !this.quoteInputAmount) return 0;

      if (this.isExpectedOptimalCalculating) return this.localPriceImpact;

      const priceImpact = this.formattedLpTokenExpected.usd
        ? ((this.tokensAmountWithSlippage -
            this.tokensCashback -
            this.formattedLpTokenExpected.usd) /
            this.formattedLpTokenExpected.usd) *
          100
        : 0;

      this.updatedLocalPriceImpact(priceImpact);

      return priceImpact;
    },

    tokensCashback() {
      const baseTokenPrice = this.pool.tokens.baseToken.price;
      const baseTokenDecimals = this.pool.tokens.baseToken.config.decimals;

      const quoteTokenPrice = this.pool.tokens.quoteToken.price;
      const quoteTokenDecimals = this.pool.tokens.quoteToken.config.decimals;

      const cashbackBaseToken = this.expectedOptimal.baseRefundAmount
        ? +formatUnits(
            this.expectedOptimal.baseRefundAmount,
            baseTokenDecimals
          ) * baseTokenPrice
        : 0;

      const cashbackQuoteToken = this.expectedOptimal.quoteRefundAmount
        ? +formatUnits(
            this.expectedOptimal.quoteRefundAmount,
            quoteTokenDecimals
          ) * quoteTokenPrice
        : 0;

      return cashbackBaseToken + cashbackQuoteToken;
    },

    tokensAmountWithSlippage() {
      const baseTokenPrice = this.pool.tokens.baseToken.price;
      const baseTokenDecimals = this.pool.tokens.baseToken.config.decimals;

      const quoteTokenPrice = this.pool.tokens.quoteToken.price;
      const quoteTokenDecimals = this.pool.tokens.quoteToken.config.decimals;

      const slippageForBaseToken = applySlippageToMinOutBigInt(
        this.slippage,
        this.baseInputAmount
      );

      const slippageForQuoteToken = applySlippageToMinOutBigInt(
        this.slippage,
        this.quoteInputAmount
      );

      return (
        Number(formatUnits(slippageForBaseToken, baseTokenDecimals)) *
          baseTokenPrice +
        Number(formatUnits(slippageForQuoteToken, quoteTokenDecimals)) *
          quoteTokenPrice
      );
    },
  },

  methods: {
    formatUSD,
    formatPercent,
    formatTokenBalance,

    updatedLocalPriceImpact(value: number) {
      this.localPriceImpact = value;
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.info-blocks {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #878b93;
  font-size: 16px;
  font-weight: 500;
}

.token-amount {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.value {
  display: flex;
  align-items: center;
}

.pool-info {
  display: flex;
  align-items: center;
}

.pool-name {
  color: #fff;
}

.pool-slippage {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.line {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 46.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #878b93;
  font-weight: 500;
}

.status {
  color: #fff;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 12px;
  background: #67a069;

  &::first-letter {
    text-transform: uppercase;
  }
}

.row-info,
.row-value {
  gap: 8px;
  display: flex;
  align-items: center;
}

.medium {
  background: #ffb800;
}

.high {
  background: #fe1842;
}
</style>
