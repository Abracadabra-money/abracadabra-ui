<template>
  <a class="base-link" :href="href" :target="target" rel="noopener noreferrer">
    <span class="inner-wrap">
      <img class="degenbox-icon" :src="icon" alt="Degenbox icon" />
      {{ text }}
      <ArrowTopRight />
    </span>
  </a>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { useImage } from "@/helpers/useImage";

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
    icon: {
      type: String,
      default: useImage("assets/images/degenbox.png"),
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
  background: #1a1f3d;
  color: #7088cc;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.36px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #191f2f;
    box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.13);
    color: #86a2f1;
  }
}

.degenbox-icon {
  width: 16px;
  height: 16px;
}
</style>
