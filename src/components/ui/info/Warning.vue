<template>
  <div class="warning-wrap">
    <img
      class="warning-image"
      :styles="warningImageStyles"
      src="@/assets/images/pools/pool-creation/warning-cross.svg"
      alt="Warning"
      v-if="mark === WarningIcon.Cross"
    />
    <ExclamationMarkIcon
      :size="markSize"
      color="rgba(254, 216, 79, 1)"
      v-if="mark === WarningIcon.Exclamation"
    />
    <p class="warning-text">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

enum WarningIcon {
  Cross = "cross",
  Exclamation = "exclamation",
}
export default {
  props: {
    mark: {
      type: String,
      default: WarningIcon.Cross,
    },
    markSize: { type: String, default: "28" },
  },

  data() {
    return {
      WarningIcon,
    };
  },

  computed: {
    warningImageStyles() {
      return `
      height: ${this.markSize};
      width: ${this.markSize};
      `;
    },
  },

  components: {
    ExclamationMarkIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ExclamationMarkIcon.vue")
    ),
  },
};
</script>
<style lang="scss" scoped>
.warning-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #fed84f;
  background: linear-gradient(
      0deg,
      rgba(195, 152, 24, 0.1) 0%,
      rgba(195, 152, 24, 0.1) 100%
    ),
    rgba(16, 22, 34, 0.4);

  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.warning-text {
  font-size: 14px;
  font-weight: 400;
}
</style>
