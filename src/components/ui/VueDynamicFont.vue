<template>
  <span :style="finalStyle" ref="spanRef">{{ content }}</span>
</template>

<script lang="ts">
import { nextTick } from "vue";

function getNodeWidth(node: HTMLElement | null): number {
  if (!node) return 0;
  const rect = node.getBoundingClientRect();
  return rect.width || 0;
}

export default {
  props: {
    content: {
      type: [String, Number],
      default: "0.0",
    },
    smooth: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      state: {
        scale: 1,
      },
      retryDelayMillisecond: 300,
      maxRetryTimes: 5,
      retryTimmer: null as ReturnType<typeof setTimeout> | null,
      timesOfRetryGetWidth: 0,
    };
  },

  computed: {
    finalStyle() {
      const transformValue = `scale(${this.state.scale}, ${this.state.scale})`;
      const animateStyle = this.smooth ? { transition: "transform 400ms" } : {};
      return {
        display: "inline-block",
        whiteSpace: "nowrap",
        transformOrigin: "0 50%",
        transform: transformValue,
        ...animateStyle,
      };
    },
  },

  watch: {
    content(newValue, oldValue) {
      if (newValue !== oldValue) {
        nextTick(this.fixWidth);
      }
    },
  },

  methods: {
    getMaxWidth() {
      const childrens = (this.$refs.spanRef as HTMLElement)?.parentElement
        ?.children;

      if (childrens && childrens.length > 1) {
        const difference = getNodeWidth(childrens[0] as HTMLElement);
        return (
          getNodeWidth((this.$refs.spanRef as HTMLElement)?.parentElement) -
          difference
        );
      }

      return getNodeWidth((this.$refs.spanRef as HTMLElement)?.parentElement);
    },

    getCurrentWidth() {
      return getNodeWidth(this.$refs.spanRef as HTMLElement | null);
    },

    setRetryTimmer() {
      if (this.retryTimmer) {
        clearTimeout(this.retryTimmer);
        this.retryTimmer = null as ReturnType<typeof setTimeout> | null;
      }
      if (this.timesOfRetryGetWidth <= this.maxRetryTimes) {
        this.retryTimmer = setTimeout(
          this.fixWidth,
          this.retryDelayMillisecond
        );
      }
    },

    fixWidth() {
      const maxWidth = this.getMaxWidth();
      const currentWidth = this.getCurrentWidth();

      if (currentWidth <= 0) {
        this.setRetryTimmer();
      } else {
        this.timesOfRetryGetWidth = 0;
        if (currentWidth > maxWidth) {
          this.state.scale = maxWidth / currentWidth;
        } else {
          this.state.scale = 1;
        }
      }
    },
  },

  mounted() {
    if (this.content) {
      nextTick(this.fixWidth);
    }
  },
};
</script>

<style lang="scss" scoped></style>
