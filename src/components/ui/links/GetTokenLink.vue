<template>
  <a
    class="get-token-link"
    :href="href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <img class="icon" v-if="icon" :src="icon" alt="Degenbox icon" />
    <BasketIcon v-else />
    {{ text }}
    <ArrowTopRight :width="14" :height="14" fill="#7088CC" />
  </a>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    href: { type: String, required: true },
    text: { type: String, required: true },
    icon: { type: String },
  },

  components: {
    BasketIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/BasketIcon.vue")
    ),
    ArrowTopRight: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowTopRightIcon.vue")
    ),
  },
};
</script>

<style>
.get-token-link {
  border-radius: 12px;
  border: 1px solid #7088cc;
  box-shadow: 0px 4px 9px 0px rgba(134, 92, 230, 0.08);
  padding: 4px 12px;
  color: #fff;
  gap: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  line-height: 150%;
}

.icon {
  width: 20px;
}
</style>
