<template>
  <div class="position-health">
    <div class="liquidation-price">
      {{ formatUSD(liquidationPrice, collateralDecimals) }}
      <TooltipIcon :width="16" :height="16" tooltip="Price" />
    </div>

    <div class="track-wrap">
      <span> {{ startPrice }}</span>

      <div :class="['price-track', positionHealth.status]">
        <div class="price-indicator"></div>
      </div>

      <span>
        {{ formatUSD(collateralInUsd, collateralDecimals) }}
      </span>
      <TooltipIcon :width="16" :height="16" fill="#878B93" tooltip="Price" />
    </div>
  </div>
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import filters from "@/filters/index.js";
import {
  PERCENT_PRESITION,
  getLiquidationPrice,
  getPositionHealth,
} from "@/helpers/cauldron/utils";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

export default {
  props: {
    cauldron: Object as any,
  },

  computed: {
    collateralDecimals() {
      return this.cauldron.config.collateralInfo.decimals;
    },

    collateralInUsd() {
      return this.cauldron.mainParams.collateralPrice;
    },

    liquidationPrice() {
      const { borrowInfo, collateralInfo } = this.cauldron.userPosition;

      return getLiquidationPrice(
        borrowInfo.userBorrowAmount,
        collateralInfo.userCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    positionHealth() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;

      const { borrowInfo, collateralInfo } = this.cauldron.userPosition;

      const expectedLiquidationPrice = getLiquidationPrice(
        borrowInfo.userBorrowAmount,
        collateralInfo.userCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );

      const { percent, status } = getPositionHealth(
        expectedLiquidationPrice,
        oracleExchangeRate,
        decimals
      );

      if (percent.gt(expandDecimals(100, PERCENT_PRESITION)))
        return { percent: 100, status };

      return { percent: utils.formatUnits(percent, PERCENT_PRESITION), status };
    },

    startPrice() {
      const tokenPrice = Number(
        utils.formatUnits(this.collateralInUsd, this.collateralDecimals)
      );

      const health = Number(this.positionHealth.percent);

      const healthleft = 100 - health;

      const startPercent = health - healthleft <= 0 ? 0 : health - healthleft;

      const leftPrice = (tokenPrice / 100) * startPercent;

      return filters.formatUSD(filters.formatToFixed(leftPrice.toString(), 2));
    },
  },

  watch: {
    positionHealth() {
      this.updatePositionHealth();
    },
  },

  methods: {
    formatUSD(value: BigNumber, decimals: number) {
      return filters.formatUSD(
        filters.formatToFixed(utils.formatUnits(value, decimals), 2)
      );
    },

    updatePositionHealth() {
      if (!+this.positionHealth.percent) {
        document.documentElement.style.setProperty("--position-health", "0%");
      } else if (+this.positionHealth.percent < 50) {
        document.documentElement.style.setProperty("--position-health", "50%");
      } else {
        document.documentElement.style.setProperty(
          "--position-health",
          this.positionHealth.percent + "%"
        );
      }
    },
  },

  mounted() {
    this.updatePositionHealth();
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
:root {
  --position-health: 100%;
}
.position-health {
  max-width: 600px;
  width: 100%;
  padding: 6px 16px;
  border-radius: 12px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.liquidation-price {
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
}

.track-wrap {
  display: grid;
  gap: 5px;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
}

.price-track {
  width: 100%;
  height: 12px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    rgba(53, 109, 55, 0.3) 0%,
    rgba(103, 160, 105, 0.3) 96.59%
  );
}

.price-indicator {
  width: var(--position-health);
  border-radius: 12px;
  height: 12px;
  background: linear-gradient(90deg, #356d37 0%, #67a069 96.59%);
}

.safe {
  background: linear-gradient(
    90deg,
    rgba(53, 109, 55, 0.3) 0%,
    rgba(103, 160, 105, 0.3) 96.59%
  );

  .price-indicator {
    background: linear-gradient(90deg, #356d37 0%, #67a069 96.59%);
  }
}

.medium {
  background: linear-gradient(
    90deg,
    rgba(131, 102, 0, 0.3) 0%,
    rgba(201, 187, 69, 0.3) 96.59%
  );

  .price-indicator {
    background: linear-gradient(90deg, #a78300 0%, #fed84f 100%);
  }
}

.high {
  background: linear-gradient(
    90deg,
    rgba(50, 10, 10, 0.3) 0%,
    rgba(140, 64, 64, 0.3) 100%
  );

  .price-indicator {
    background: linear-gradient(90deg, #4f1717 0%, #8c4040 100%);
  }
}
</style>
