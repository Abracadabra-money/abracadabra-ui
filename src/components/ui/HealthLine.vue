<template>
  <div class="health-line">
    <div
      class="health-value"
      :style="{ width: `${percent}%`, backgroundColor: gradientColor }"
    >
      &nbsp;
    </div>
  </div>
</template>

<script>
export default {
  name: "HealthLine",
  props: {
    isSafe: { type: Boolean, default: false },
    isMedium: { type: Boolean, default: false },
    isHigh: { type: Boolean, default: false },
    percent: { type: [Number, String], default: 0 },
  },
  data: () => ({
    colors: {
      safe: "#63CAF8",
      medium: "#FFB800",
      high: "#FE1842",
      none: "rgba(255, 255, 255, 0.3)",
    },
  }),
  computed: {
    gradientColor() {
      const { safe, medium, high, none } = this.colors;
      return this.isSafe
        ? safe
        : this.isMedium
        ? medium
        : this.isHigh
        ? high
        : none;
    },
  },
};
</script>

<style lang="scss" scoped>
.health-line {
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.health-value {
  border-radius: 20px;
  height: 100%;
}
</style>
