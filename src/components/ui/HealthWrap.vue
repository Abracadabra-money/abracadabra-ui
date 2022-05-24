<template>
  <div class="health-wrap" :style="{ backgroundColor }">
    <slot />
  </div>
</template>

<script>
export default {
  name: "HealthWrap",
  props: {
    isSafe: { type: Boolean, default: false },
    isMedium: { type: Boolean, default: false },
    isHigh: { type: Boolean, default: false },
  },
  data: () => ({
    colors: {
      safe: "rgba(99, 202, 248, 0.06)",
      medium: "rgba(255, 184, 0, 0.06)",
      high: "rgba(254, 24, 66, 0.06)",
      none: "rgba(255, 255, 255, 0.06)",
    },
  }),
  computed: {
    backgroundColor() {
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
.health-wrap {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
</style>
