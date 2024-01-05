<template>
  <a class="base-link" :href="href" :target="target" rel="noopener noreferrer">
    <span class="inner-wrap">
      <img
        class="degenbox-icon"
        src="@/assets/images/degenbox.png"
        alt="Degenbox icon"
      />
      {{ text }}
      <ArrowTopRight />
    </span>
  </a>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    href: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "Base link",
    },
  },

  components: {
    ArrowTopRight: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowTopRightIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.base-link {
  padding: 1px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  border-radius: 8px;
}

.inner-wrap {
  height: 30px;
  padding: 5px 8px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #303557;
  color: #7088cc;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.36px;
  cursor: pointer;
}

.degenbox-icon {
  width: 16px;
  height: 16px;
}
</style>
