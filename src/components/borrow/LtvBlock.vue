<template>
  <div class="ltv-block">
    <span class="ltv-item">
      <Tooltip :tooltip="tooltip" />
      <span> LTV</span>
    </span>
    <span class="ltv-item">{{ ltv }}%</span>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    ltv: {
      type: Number,
      default: 0,
    },
    tooltip: {
      type: String,
      default:
        "Loan to Value: percentage of debt compared to the collateral. The higher it is, the riskier the position",
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
.ltv-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
}

.ltv-item {
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 24px;
}
</style>
