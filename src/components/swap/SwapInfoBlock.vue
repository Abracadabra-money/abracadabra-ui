<template>
  <div class="swap-info">
    <div class="swap-info-item">
      <div class="item-head">
        <div class="info-icon-wrap">
          <img
            class="info-icon"
            @mouseenter="showPriceImpactTooltip = true"
            @mouseleave="showPriceImpactTooltip = false"
            src="@/assets/images/swap/price-impact-icon.png"
            alt="Price impact icon"
          />

          <div class="item-tooltip" v-if="showPriceImpactTooltip">
            <p>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint.
            </p>
          </div>
        </div>
        <h4 class="info-title">Price impact</h4>
      </div>
      <div
        :class="['info-value', 'price-impact-value', { warning: isWarning }]"
      >
        {{ priceImpact }}%
      </div>
    </div>

    <div class="swap-info-item">
      <div class="item-head">
        <div class="info-icon-wrap">
          <img
            class="info-icon"
            src="@/assets/images/swap/slippage-icon.png"
            alt="Slippage icon"
            @mouseenter="showSlippageTooltip = true"
            @mouseleave="showSlippageTooltip = false"
          />

          <div class="item-tooltip" v-if="showSlippageTooltip">
            <p class="item-tooltip-text">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint.
            </p>

            <p>Minimum Received</p>
            <p>{{ minimumReceived }}</p>
          </div>
        </div>
        <h4 class="info-title">Slippage</h4>
      </div>
      <div class="info-value">{{ swapSlippage }}%</div>
    </div>

    <div class="swap-info-item">
      <div class="item-head">
        <div class="info-icon-wrap">
          <img
            class="info-icon"
            @mouseenter="showFeesTooltip = true"
            @mouseleave="showFeesTooltip = false"
            src="@/assets/images/swap/fees-icon.png"
            alt="Fees icon"
          />

          <div class="item-tooltip" v-if="showFeesTooltip">
            <p class="item-tooltip-text">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint.
            </p>
            <p class="item-tooltip-text">Gas cost:</p>
            <p class="item-tooltip-text">
              Pool fee: {{ feesByCategory.poolFee }}
            </p>
            <p>Protocol comission: {{ feesByCategory.protocolComission }}</p>
          </div>
        </div>
        <h4 class="info-title">Fees</h4>
      </div>
      <div class="info-value">{{ swapFees }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Prop } from "vue";
import { formatUnits } from "viem";
import { formatUSD } from "@/helpers/filters";
import type { ActionConfig, RouteInfo } from "@/helpers/pools/swap/getSwapInfo";

export default {
  props: {
    swapInfo: Object as Prop<any>,
    actionConfig: Object as Prop<ActionConfig>,
    priceImpact: { type: [String, Number], default: 0 },
  },

  data() {
    return {
      showFeesTooltip: false,
      showSlippageTooltip: false,
      showPriceImpactTooltip: false,
    };
  },

  computed: {
    isWarning() {
      return +this.priceImpact >= 15;
    },

    feesByCategory() {
      if (!this.swapInfo.routes.length)
        return {
          gasCost: 0,
          poolFee: 0,
          protocolComission: 0,
        };

      const routeInfo: RouteInfo =
        this.swapInfo.routes[this.swapInfo.routes.length - 1];

      const toTokenPrice = this.actionConfig!.toToken.price;
      const toTokenDecimals = this.actionConfig!.toToken.config.decimals;

      return {
        gasCost: 0,
        poolFee: formatUSD(
          Number(formatUnits(routeInfo.lpFee, toTokenDecimals)) * toTokenPrice
        ),
        protocolComission: formatUSD(
          Number(formatUnits(routeInfo.mtFee, toTokenDecimals)) * toTokenPrice
        ),
      };
    },

    swapFees() {
      if (!this.swapInfo.routes.length) return 0;

      const routeInfo: RouteInfo =
        this.swapInfo.routes[this.swapInfo.routes.length - 1];

      return formatUSD(
        +formatUnits(
          routeInfo.lpFee + routeInfo.mtFee,
          this.actionConfig!.toToken.config.decimals
        ) * this.actionConfig!.toToken.price
      );
    },

    swapSlippage() {
      return formatUnits(this.actionConfig!.slippage, 2);
    },

    minimumReceived() {
      const amount = formatUnits(
        this.swapInfo.outputAmountWithSlippage,
        this.actionConfig!.toToken.config.decimals
      );
      const tokenName =
        this.actionConfig!.toToken.config.name === "Select Token"
          ? ""
          : this.actionConfig!.toToken.config.name;

      return `${amount} ${tokenName}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.swap-info {
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.swap-info-item {
  width: 100%;
  gap: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.item-head {
  gap: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.item-tooltip {
  min-width: 306px;
  width: 100%;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
}

.item-tooltip-text {
  margin-bottom: 12px;
}

.info-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.info-value {
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.price-impact-value {
  color: #67a069;
}

.warning {
  color: #8c4040;
}

@media screen and (max-width: 600px) {
  .swap-info {
    flex-direction: column;
  }

  .swap-info-item {
    flex-direction: row;
    justify-content: space-between;
  }

  .item-head {
    flex-direction: row;
  }

  .info-icon {
    width: 24px;
    height: 24px;
  }

  .item-tooltip {
    left: 0;
    transform: none;
  }

  .info-value {
    font-size: 18px;
  }
}
</style>
