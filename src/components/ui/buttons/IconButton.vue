<template>
  <component
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="button-wrap"
    :is="tagName"
    :href="href"
    :target="href"
  >
    <span
      class="inner-wrap"
      :style="`width: ${width}px; height: ${height}px; padding: ${padding};`"
    >
      <WalletIcon v-if="wallet" :fill="svgFill"/>
      <LinkIcon v-else-if="link" :fill="svgFill"/>
      <SetingIcon v-else-if="seting" :fill="svgFill"/>
    </span>
  </component>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    wallet: {
      type: Boolean,
      default: false,
    },
    link: {
      type: Boolean,
      default: false,
    },
    seting: {
      type: Boolean,
      default: false,
    },
    tagName: {
      type: String,
      default: "button",
    },
    href: {
      type: String,
      default: "",
    },
    target: {
      type: String,
      default: "_blank",
    },
    height: {
      type: Number,
      default: 30,
    },
    width: {
      type: Number,
      default: 32,
    },
    padding: {
      type: String,
      default: "6px 8px",
    },
  },

  data() {
    return {
      hover: false,
      svgFillColor: "#7088CC",
      svgHoverFillColor: "#86A2F1",
    };
  },

  computed: {
    svgFill() {
      if (this.hover) return this.svgHoverFillColor;

      return this.svgFillColor;
    },
  },

  components: {
    WalletIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/WalletIcon.vue")
    ),
    LinkIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/LinkIcon.vue")
    ),
    SetingIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SetingIcon.vue")
    ),
  },

  methods: {
    onHover() {},
  },
};
</script>

<style lang="scss" scoped>
.button-wrap {
  padding: 1px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  border-radius: 8px;
  border: transparent;
  outline: transparent;
  cursor: pointer;
}

.inner-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 8px;
  background: #1a1f3d;
  height: 28px;
  width: 32px;
  transition: all 0.3s ease;

  &:hover {
    background: #191f2f;
    box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.13);
  }
}
</style>
