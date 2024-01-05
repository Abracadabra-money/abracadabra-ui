<template>
  <component class="button-wrap" :is="tagName" :href="href" :target="href">
    <span
      class="inner-wrap"
      :style="`width: ${width}px; height: ${height}px; padding: ${padding};`"
    >
      <WalletIcon v-if="wallet" />
      <LinkIcon v-else-if="link" />
      <SetingIcon v-else-if="seting" />
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
  padding: 6px 8px;
  border-radius: 8px;
  background: #303557;
  height: 30px;
  width: 32px;
}
</style>
