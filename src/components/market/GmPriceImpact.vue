<template>
  <div class="price-impact">
    <div class="title">
      Price impact
      <TooltipIcon :width="20" :height="20" fill="#878B93" tooltip="tooltip" />
    </div>
    <div class="value">$0.04 (0.05%)</div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {};
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.price-impact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.title {
  gap: 4px;
  display: flex;
  align-items: center;
  color: #878b93;
}

.value {
  color: #67a069;
}
</style>
