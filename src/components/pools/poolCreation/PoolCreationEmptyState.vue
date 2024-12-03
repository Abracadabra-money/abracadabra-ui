<template>
  <div class="empty-state-wrap" :style="orientationStyles">
    <img class="icon" :style="iconSizeStyles" :src="image" />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { EmptyStateTypes } from "@/constants/pools/poolCreation";
import type { PropType } from "vue";
import emptyTypeImage from "@/assets/images/pools/pool-creation/emptyPoolType.png";
import emptyPairImage from "@/assets/images/pools/pool-creation/emptyPair.png";

export default {
  props: {
    iconWidth: { type: [Number, String], default: 150 },
    iconHeight: { type: [Number, String], default: 150 },
    column: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false },
    type: {
      type: String as unknown as PropType<EmptyStateTypes>,
      default: EmptyStateTypes.PoolType,
    },
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

    image() {
      return this.type === EmptyStateTypes.PoolType
        ? emptyTypeImage
        : emptyPairImage;
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
