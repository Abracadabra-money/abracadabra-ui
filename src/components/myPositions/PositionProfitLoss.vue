<template>
  <div class="box-wrap" :class="status">
    <img class="info-icon" src="@/assets/images/tooltip.png" alt="Tooltip" />
    <img class="arrow" :src="`src/assets/images/icons/profit-${status}.svg`" />
    <div class="box-container">
      <p class="box-title">P/L</p>
      <p class="box-value">{{ formatUSD(profit) }}</p>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
export default {
  props: {
    profit: { type: Number },
  },

  computed: {
    status() {
      return this.profit > 0 ? "up" : "loss";
    },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },
  },
};
</script>

<style scoped>
.box-wrap {
  position: relative;
  width: 100%;
  height: 62px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(5px);
  border-radius: 20px;
}

.info-icon {
  position: absolute;
  top: 12.5px;
  left: 10px;
}
.arrow {
  position: absolute;
  top: 19px;
  right: 10px;
}

.box-container {
  padding: 10px 34px;
}

.box-title,
.box-value {
  font-size: 14px;
  line-height: 21px;
}

.box-title {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
}

.box-value {
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
}

.up {
  background: rgba(99, 255, 161, 0.08);
  border: 1px solid rgba(99, 255, 161, 0.6);
}

.loss {
  background: rgba(255, 118, 99, 0.08);
  border: 1px solid rgba(255, 123, 82, 0.6);
}
</style>
