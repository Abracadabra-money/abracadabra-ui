<template>
  <div class="wrapper" :class="positionRisk">
    <div>
      <span class="title">Liquidation price</span>
      <span class="value">{{ formatLiquidationPrice }}</span>
    </div>
    <div class="position-status" :class="positionStatus">
      {{ positionRisk }}
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
export default {
  props: {
    positionRisk: {
      type: String,
    },
    liquidationPrice: {
      type: [Number, String],
    },
  },

  computed: {
    formatLiquidationPrice() {
      return filters.formatExactPrice(this.liquidationPrice);
    },

    positionStatus() {
      return `status-${this.positionRisk}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding: 6px 10px;
}

.value {
  font-weight: 700;
  margin-left: 14px;
}

.position-status {
  text-align: center;
  font-size: 12px;
  padding: 8px 0;
  line-height: 12px;
  border-radius: 32px;
  width: 60px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:first-letter {
    text-transform: uppercase !important;
  }
}

.safe {
  background: rgba(99, 202, 248, 0.06);
}
.status-safe {
  border-color: #63caf8;
}

.medium {
  background: rgba(255, 184, 0, 0.06);
}
.status-medium {
  border-color: #ffb800;
}

.high {
  background: rgba(254, 24, 66, 0.06);
}
.status-high {
  border-color: #fe1842;
}
</style>
