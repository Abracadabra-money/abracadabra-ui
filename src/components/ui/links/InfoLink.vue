<template>
  <div class="info-link-wrap">
    <Tooltip :tooltip="tooltip" />
    <a class="info-link" :href="href" target="_blank">{{ text }}</a>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    tooltip: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "Link",
    },
    href: {
      type: String,
      default: "#",
    },
  },

  components: {
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.info-link-wrap {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 12px 0;
}

.info-link {
  color: #fff;
  margin-left: 5px;
}

.info-link:hover {
  text-decoration: underline;
}
</style>
