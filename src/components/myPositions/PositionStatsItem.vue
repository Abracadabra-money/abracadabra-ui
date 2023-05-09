<template>
  <div class="stats-wrap" :class="[liquidationStatus, profitStatus]">
    <img
      class="tooltip-icon"
      src="@/assets/images/tooltip.png"
      v-tooltip="tooltip"
      alt="Tooltip"
    />

    <span
      class="liquidation-status"
      :class="liquidationStatus"
      v-if="liquidationStatus"
    >
      {{ liquidationStatus }}
    </span>

    <img
      class="profit-icon"
      :src="`src/assets/images/icons/profit-${profitStatus}.svg`"
      v-if="profitStatus"
    />

    <div class="description">
      <p class="title">{{ title }}</p>
      <p class="value">{{ value }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    value: { type: String, default: "0.0" },
    liquidationStatus: { type: String },
    profitStatus: { type: String },
    tooltip: { type: String, default: "Tooltip" },
  },
};
</script>

<style lang="scss" scoped>
.stats-wrap {
  position: relative;
  width: 100%;
  height: 62px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(5px);
  border-radius: 20px;
}

.safe {
  background: rgba(99, 202, 248, 0.06);
  border: 1px solid rgba(99, 202, 248, 0.6);
}
.medium {
  background: rgba(255, 184, 0, 0.06);
  border: 1px solid rgba(255, 184, 0, 0.6);
}
.high {
  background: rgba(254, 24, 66, 0.06);
  border: 1px solid rgba(254, 24, 66, 0.6);
}

.up {
  background: rgba(99, 255, 161, 0.08);
  border: 1px solid rgba(99, 255, 161, 0.6);
}

.loss {
  background: rgba(255, 118, 99, 0.08);
  border: 1px solid rgba(255, 123, 82, 0.6);
}

.tooltip-icon {
  position: absolute;
  top: 12px;
  left: 10px;
  max-width: 13px;
}

.liquidation-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 9px;
  border-radius: 32px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  text-transform: capitalize;

  &.safe {
    background: #63caf8;
  }

  &.medium {
    background: #ffb800;
  }

  &.high {
    background: #fe1842;
  }
}

.profit-icon {
  position: absolute;
  top: 19px;
  right: 10px;
}

.description {
  padding: 10px 34px;
}

.title,
.value {
  font-size: 14px;
  line-height: 21px;
}

.title {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
}

.value {
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
}
</style>
