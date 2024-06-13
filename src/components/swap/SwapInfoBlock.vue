<template>
  <div class="swap-info">
    <div class="swap-info-item">
      <div class="item-head">
        <img
          class="info-icon"
          src="@/assets/images/swap/price-impact-icon.png"
          alt="Price impact icon"
        />
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
        <img
          class="info-icon"
          src="@/assets/images/swap/slippage-icon.png"
          alt="Slippage icon"
        />
        <h4 class="info-title">Slippage</h4>
      </div>
      <div class="info-value">{{ swapSlippage }}%</div>
    </div>

    <div class="swap-info-item">
      <div class="item-head">
        <img
          class="info-icon"
          src="@/assets/images/swap/fees-icon.png"
          alt="Fees icon"
        />
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

  computed: {
    isWarning() {
      return +this.priceImpact >= 15;
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

.info-icon {
  width: 40px;
  height: 40px;
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

  .info-value {
    font-size: 18px;
  }
}
</style>
