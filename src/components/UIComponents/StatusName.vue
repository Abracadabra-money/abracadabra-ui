<template>
  <div class="range-status" :style="{ backgroundColor, border }">
    {{ statusName }}
  </div>
</template>

<script>
export default {
  name: "StatusName",
  props: {
    isSafe: { type: Boolean, default: false },
    isMedium: { type: Boolean, default: false },
    isHigh: { type: Boolean, default: false },
    bordered: { type: Boolean, default: false },
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
    backgroundColor() {
      return !this.bordered ? this.gradientColor : "transparent";
    },
    border() {
      return this.bordered ? `solid 1px ${this.gradientColor}` : "none";
    },
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
    statusName() {
      return this.isSafe
        ? "Safe"
        : this.isMedium
        ? "Medium"
        : this.isHigh
        ? "High"
        : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.range-status {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  border: none;
  border-radius: 32px;
  width: 60px;
  height: 30px;
  line-height: 0;
}
</style>
