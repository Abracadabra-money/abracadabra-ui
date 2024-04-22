<template>
  <router-link class="swap-link" :to="{ name: goToPage }">
    <component :is="iconComponent" :width="23" :height="19" fill="#784DFF" />
    <span>{{ linkText }}</span>
  </router-link>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    isClassicHeader: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    goToPage() {
      if (this.isClassicHeader) return "MimSwap";
      return "Home";
    },

    iconComponent() {
      if (this.isClassicHeader) return "SwapLogoIcon";
      return "MimLogoIcon";
    },

    linkText() {
      if (this.isClassicHeader) return "Swap";
      return "MIM";
    },
  },

  components: {
    MimLogoIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/MimLogoIcon.vue")
    ),
    SwapLogoIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SwapLogoIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.swap-link {
  min-width: 100px;
  padding: 12px;
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
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
