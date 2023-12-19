<template>
  <component class="button-wrap" :is="tagName" :href="href" :target="href">
    <span class="inner-wrap">
      <WalletIcon v-if="wallet" />
      <LinkIcon v-else-if="link" />
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
  },

  components: {
    WalletIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/WalletIcon.vue")
    ),
    LinkIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/LinkIcon.vue")
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
