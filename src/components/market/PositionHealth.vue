<template>
  <div class="position-health">
    <div class="position-percent">
      {{ formatPercent(positionHealth.percent) }}
    </div>

    <div class="track-wrap">
      <img class="magician-icon" src="@/assets/images/magician.png" alt="" />

      <div :class="['price-track', positionHealth.status]">
        <img class="track-icon" src="@/assets/images/potion.png" alt="" />
        <div class="price-indicator"></div>
      </div>

      <span> 100% </span>
    </div>
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
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
  },

  watch: {
    positionHealth() {
      this.updatePositionHealth();
    },
  },

  methods: {
    formatPercent(value: any) {
      return filters.formatPercent(filters.formatToFixed(100 - value, 2));
    },

    updatePositionHealth() {
      console.log("this.positionHealth.percent", this.positionHealth.percent);

      if (!+this.positionHealth.percent) {
        document.documentElement.style.setProperty("--position-health", "100%");
      } else if (+this.positionHealth.percent >= 100) {
        document.documentElement.style.setProperty("--position-health", "0%");
      } else {
        document.documentElement.style.setProperty(
          "--position-health",
          100 - +this.positionHealth.percent + "%"
        );
      }
    },
  },

  mounted() {
    this.updatePositionHealth();
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

.position-percent {
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
}

.track-wrap {
  position: relative;
  display: grid;
  gap: 12px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
}

.magician-icon {
  width: 20px;
  height: 20px;
}

.track-icon {
  width: 22px;
  height: 22px;
  position: absolute;
  top: 0;
  left: var(--position-health);
  transform: translate(-50%, -25%);
}

.price-track {
  position: relative;
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
