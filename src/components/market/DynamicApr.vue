<template>
  <div class="dynamic-apr">
    <div class="title">
      Leverage APR
      <TooltipIcon
        :width="20"
        :height="20"
        fill="#878B93"
        tooltip="Annualised Percentage Return Range given by the leveraged collateral."
      />
    </div>
    <div class="value">{{ openingApr }}%</div>
  </div>
</template>

<script lang="ts">
import { formatToFixed } from "@/helpers/filters";
import { defineAsyncComponent, type PropType } from "vue";

export default {
  props: {
    aprInfo: {
      type: Object as PropType<{ value: number; multiplier: number }>,
      required: true,
    },
    multiplier: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    openingApr() {
      return formatToFixed(this.aprInfo.value * this.multiplier, 2);
    },
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.dynamic-apr {
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
  text-transform: uppercase;
}
</style>
