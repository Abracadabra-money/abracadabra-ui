<template>
  <div class="swap-info">
    <div class="swap-info-item">
      <div class="info-title">Current price</div>
      <CurrentPrice
        :fromToken="actionConfig?.fromToken"
        :toToken="actionConfig?.toToken"
      />
    </div>
    <div class="swap-info-item" v-if="showPriceImpact">
      <div class="info-title">Price Impact</div>
      <div class="info-value" v-if="isSelectedTokens">{{ priceImpact }}</div>
      <div class="info-value" v-else>-</div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Minimum received</div>
      <div class="info-value" v-if="isSelectedTokens">
        {{ minimumReceived }} {{ actionConfig?.toToken?.config.name }}
      </div>
      <div class="info-value" v-else>-</div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Network Fee</div>
      <div class="info-value" v-if="networkFee">
        <FeeIcon /> {{ formatUSD(networkFee) }}
      </div>
      <div v-else>-</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  formatPercent,
  formatTokenBalance,
  formatUSD,
} from "@/helpers/filters";
import { formatUnits } from "viem";
import { defineAsyncComponent, type Prop } from "vue";
import type { TokenPrice } from "@/helpers/prices/defiLlama";
import type { ActionConfig } from "@/helpers/pools/swap/getSwapInfo";

export default {
  props: {
    minAmount: BigInt as Prop<bigint>,
    actionConfig: Object as Prop<ActionConfig>,
    prices: {
      type: Array<TokenPrice>,
      default: () => [],
    },
    networkFee: { type: Number, default: 0 },
    showPriceImpact: { type: Boolean, default: true },
  },

  computed: {
    isSelectedTokens() {
      if (!this.actionConfig) return false;
      const { fromToken, toToken } = this.actionConfig;
      const { name: toTokenName } = toToken.config;
      const { name: fromTokenName } = fromToken.config;
      return ![toTokenName, fromTokenName].includes("Select Token");
    },

    minimumReceived() {
      return formatTokenBalance(
        formatUnits(
          this.minAmount || 0n,
          this.actionConfig?.toToken?.config.decimals || 18
        )
      );
    },

    priceImpact() {
      const { fromToken, toToken, fromInputValue, toInputValue }: any =
        this.actionConfig;

      const fromTokenPrice =
        this.prices.find(
          (price) => price.address === fromToken?.config.contract.address
        )?.price || 0;

      const toTokenPrice =
        this.prices.find(
          (price) => price.address === toToken?.config.contract.address
        )?.price || 0;

      const fromTokenAmountUsd =
        fromTokenPrice *
        +formatUnits(fromInputValue, toToken?.config.decimals || 18);

      const toTokenAmountUsd =
        toTokenPrice *
        +formatUnits(toInputValue || 0n, toToken?.config.decimals || 18);

      const priceImpact = toTokenAmountUsd / fromTokenAmountUsd;

      if (!priceImpact) return formatPercent(priceImpact);

      const sign = priceImpact > 1 ? "+" : "-";

      const percent = Math.abs(1 - priceImpact) * 100;

      return `${sign}${formatPercent(percent)}`;
    },
  },

  methods: {
    formatUSD,
  },

  components: {
    CurrentPrice: defineAsyncComponent(
      () => import("@/components/pools/CurrentPrice.vue")
    ),
    FeeIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/FeeIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.swap-info {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.swap-info-item {
  display: flex;
  justify-content: space-between;
  color: #878b93;
  line-height: normal;
  flex-wrap: wrap;
}

.info-value {
  font-weight: 500;
  gap: 4px;
  display: flex;
  align-items: center;
}

.info-price {
  color: #575c62;
}
</style>
