<template>
  <div class="empty-state-wrap" :style="orientationStyles">
    <img
      class="icon"
      :style="iconSizeStyles"
      src="@/assets/images/not-found.png"
    />
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    iconWidth: { type: [Number, String], default: 167.349 },
    iconHeight: { type: [Number, String], default: 136 },
    column: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false },
  },

  computed: {
    orientationStyles() {
      const direction = this.column ? "column" : "row";
      const inversion = this.reverse ? "-reverse" : "";
      return `
            flex-direction: ${direction + inversion}
            `;
    },

    iconSizeStyles() {
      return `
            max-width: ${this.iconWidth}px;
            max-height: ${this.iconHeight}px;
            `;
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-state-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px;
}

.icon {
  width: 100%;
}
</style>
