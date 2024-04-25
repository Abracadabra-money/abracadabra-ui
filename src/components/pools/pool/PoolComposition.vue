<template>
  <div class="pool-composition-wrap">
    <div class="pool-composition-header">
      <h3 class="title">Pool composition</h3>
    </div>

    <div class="pool-composition">
      <div class="pair-tokens">
        <div
          :class="['token-info', tokenPart.type]"
          :key="index"
          v-for="(tokenPart, index) in tokenParts"
        >
          <BaseTokenIcon :name="tokenPart.name" :icon="tokenPart.icon" />
          <div class="token-part-values">
            <span class="percent">{{ tokenPart.percent }}</span>
            <span class="amount">{{ tokenPart.amount }}</span>
          </div>
        </div>
      </div>

      <div class="scale-wrap">
        <div
          class="base scale"
          :style="`${formatScaleWidth(tokenParts[0].percent)}
          background:${baseToken.config.mainColor}`"
        >
          <BaseTokenIcon
            class="scale-token-icon"
            :name="tokenParts[0].name"
            :icon="tokenParts[0].icon"
            size="18px"
          />
        </div>

        <div
          class="quote scale"
          :style="`${formatScaleWidth(tokenParts[1].percent)} 
          background:${quoteToken.config.mainColor}`"
        >
          <BaseTokenIcon
            class="scale-token-icon"
            :name="tokenParts[1].name"
            :icon="tokenParts[1].icon"
            size="18px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type Prop } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance, formatPercent } from "@/helpers/filters";
import type { PoolInfo, TokenConfig } from "@/configs/pools/types";

type CompositionTokenInfo = {
  config: TokenConfig;
  reserve: number;
  price: number;
  value: number;
};

type PartToken = {
  name: string;
  icon: string;
  type: string;
  amount: string | number;
  percent: string;
};

export default {
  props: {
    pool: Object as Prop<PoolInfo>,
  },

  computed: {
    tvl(): number {
      return this.baseToken.value + this.quoteToken.value;
    },

    baseToken(): CompositionTokenInfo {
      const baseTokenReserve = Number(
        formatUnits(
          this.pool!.vaultReserve[0],
          this.pool!.tokens.baseToken.config.decimals
        )
      );
      const baseTokenPrice = this.pool!.tokens.baseToken.price;
      const baseTokenValue = baseTokenReserve * baseTokenPrice;

      return {
        config: this.pool!.tokens.baseToken.config,
        reserve: baseTokenReserve,
        price: baseTokenPrice,
        value: baseTokenValue,
      };
    },

    quoteToken(): CompositionTokenInfo {
      const quoteTokenReserve = Number(
        formatUnits(
          this.pool!.vaultReserve[1],
          this.pool!.tokens.quoteToken.config.decimals
        )
      );
      const quoteTokenPrice = this.pool!.tokens.quoteToken.price;
      const quoteTokenValue = quoteTokenReserve * quoteTokenPrice;

      return {
        config: this.pool!.tokens.quoteToken.config,
        reserve: quoteTokenReserve,
        price: quoteTokenPrice,
        value: quoteTokenValue,
      };
    },

    tokenParts(): PartToken[] {
      const tokenParts: PartToken[] = [
        {
          name: this.baseToken.config.name,
          icon: this.baseToken.config.icon,
          type: "base",
          amount: formatTokenBalance(this.baseToken.reserve),
          percent: formatPercent(
            this.calculatePercentage(this.baseToken.value, this.tvl)
          ),
        },
        {
          name: this.quoteToken.config.name,
          icon: this.quoteToken.config.icon,
          type: "quote",
          amount: formatTokenBalance(this.quoteToken.reserve),
          percent: formatPercent(
            this.calculatePercentage(this.quoteToken.value, this.tvl)
          ),
        },
      ].filter((e) => e.name && e.amount);

      return tokenParts.length ? tokenParts : [];
    },
  },

  methods: {
    formatScaleWidth(percentWidth: string): string {
      return `width: calc( ${percentWidth} - 2px );`;
    },

    formatTokenBalance(value: bigint, decimals: number): string | number {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    calculatePercentage(part: number, total: number): number {
      return (part * 100) / total;
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-composition-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.pool-composition-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.tvl {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
}

.pool-composition {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.pair-tokens {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.token-info {
  display: flex;
  align-items: center;
}

.quote {
  flex-direction: row-reverse;
}

.token-part-values {
  display: flex;
  flex-direction: column;
}

.base .token-part-values {
  align-items: flex-start;
  margin-left: 10px;
}

.quote .token-part-values {
  align-items: flex-end;
  margin-right: 10px;
}

.percent {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
}

.amount {
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
}

.scale-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 24px;
  border-radius: 10px;
}

.scale-token-icon,
.token-icon {
  margin-right: 0 !important;
}

.scale {
  display: flex;
  align-items: center;
  height: 100%;
}

.scale.base {
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  border-radius: 10px 0 0 10px;
}

.scale.quote {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  border-radius: 0 10px 10px 0;
}

.filled-amount {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.pool-composition-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 20px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}

.info-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  width: 50%;
}

.info-tag-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.divider {
  width: 1px;
  height: 29px;
  background: rgba(255, 255, 255, 0.72);
  margin: 0 13px;
}
</style>
