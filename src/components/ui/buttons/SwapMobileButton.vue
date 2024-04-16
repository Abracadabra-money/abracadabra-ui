<template>
  <button class="toggle-button" @click="$emit('change-view')">
    <span class="toggle-button-icon">
      <component
        :is="componentInfo.component"
        :width="23"
        :height="19"
        fill="#784DFF"
      />
    </span>
    {{ componentInfo.text }}
  </button>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    isClassicHeader: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    componentInfo() {
      if (this.isClassicHeader)
        return { component: "SwapLogoIcon", text: "Swap" };
      return { component: "MimLogoIcon", text: "MIM" };
    },
  },

  components: {
    MimLogoIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/MimLogoIcon.vue")
    ),
    SwapLogoIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/SwapLogoIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.toggle-button {
  background: transparent;
  border: transparent;
  outline: transparent;
  color: #fff;
  text-align: left;
  gap: 6px;
  display: flex;
  align-items: center;
}

.toggle-button-icon {
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.12) 0%,
      rgba(116, 92, 210, 0.12) 100%
    );
  box-shadow: 0px 0px 10.1px 0px rgba(150, 149, 248, 0.19);
}
</style>
