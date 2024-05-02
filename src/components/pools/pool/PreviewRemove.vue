<template>
  <div class="info-block">
    <div class="tag">
      <span class="title">
        <RadioButton
          :active="isBase"
          @click="$emit('chooseToken', true)"
          v-if="isSingleSide"
        />
        <BaseTokenIcon
          :name="pool.tokens.baseToken.config.name"
          :icon="pool.tokens.baseToken.config.icon"
          size="32px"
        />
        {{ pool.tokens.baseToken.config.name }}
      </span>

      <div class="token-amount">
        <span class="value">
          {{ formattedTokenExpecteds.base.value }}
        </span>
        <span class="usd">
          {{ formattedTokenExpecteds.base.usd }}
        </span>
      </div>
    </div>

    <div class="tag">
      <span class="title">
        <RadioButton
          :active="!isBase"
          @click="$emit('chooseToken', false)"
          v-if="isSingleSide"
        />
        <BaseTokenIcon
          :name="pool.tokens.quoteToken.config.name"
          :icon="pool.tokens.quoteToken.config.icon"
          size="32px"
        />
        {{ pool.tokens.quoteToken.config.name }}
      </span>

      <div class="token-amount">
        <span class="value">
          {{ formattedTokenExpecteds.quote.value }}
        </span>
        <span class="usd">
          {{ formattedTokenExpecteds.quote.usd }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import type { PoolInfo } from "@/configs/pools/types";
import type { PreviewRemoveLiquidityResult } from "@/components/pools/pool/actions/Remove.vue";

type FormattedTokenExpected = {
  value: string | number;
  usd: string;
};

type FormattedTokenExpecteds = {
  base: FormattedTokenExpected;
  quote: FormattedTokenExpected;
};

export default {
  props: {
    pool: { type: Object as PropType<PoolInfo>, required: true },
    previewRemoveLiquidityResult: {
      type: Object as PropType<PreviewRemoveLiquidityResult>,
      required: true,
    },
    isBase: { type: Boolean },
    isSingleSide: { type: Boolean },
  },

  emits: ["chooseToken"],

  data() {
    return {
      inputAmount: 0n,
      inputValue: "",
      isActionProcessing: false,
    };
  },

  computed: {
    formattedTokenExpecteds(): FormattedTokenExpecteds {
      if (!this.previewRemoveLiquidityResult)
        return {
          base: { value: "0.0", usd: "$ 0.0" },
          quote: { value: "0.0", usd: "$ 0.0" },
        };

      const formattedBaseValue = Number(
        formatUnits(
          this.previewRemoveLiquidityResult.baseAmountOut,
          this.pool.tokens.baseToken.config.decimals
        )
      );
      const formattedQuoteValue = Number(
        formatUnits(
          this.previewRemoveLiquidityResult.quoteAmountOut,
          this.pool.tokens.quoteToken.config.decimals
        )
      );

      const baseValueUsdEquivalent =
        formattedBaseValue * this.pool.tokens.baseToken.price;
      const quoteValueUsdEquivalent =
        formattedQuoteValue * this.pool.tokens.quoteToken.price;

      return {
        base: {
          value: formatTokenBalance(formattedBaseValue),
          usd: formatUSD(baseValueUsdEquivalent),
        },
        quote: {
          value: formatTokenBalance(formattedQuoteValue),
          usd: formatUSD(quoteValueUsdEquivalent),
        },
      };
    },
  },

  methods: {
    formatTokenBalance(value: bigint, decimals: number) {
      return formatTokenBalance(formatUnits(value, decimals));
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    RadioButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/RadioButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.info-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
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

.value,
.title {
  display: flex;
  align-items: center;
}

.title {
  gap: 8px;
}

.value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.apr {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 16px;
  font-weight: 600;
}

.usd-equivalent {
  color: #575c62;
  font-size: 16px;
  font-weight: 400;
}

.token-icon {
  margin-right: 0;
}
</style>
