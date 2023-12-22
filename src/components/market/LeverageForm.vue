<template>
  <LeverageRange
    :value="multiplier"
    :max="10.999999"
    :min="0"
    :step="0.1"
    :risk="'medium'"
    :collateralValue="1"
    :disabled="false"
    tooltipText="Allows users to leverage their position. Read more about this in the documents!"
    @updateValue="updateMultiplier"
  />

  <div class="dynamic-fee">
    <div class="dynamic-fee-title">
      Dynamic Opening Fee
      <TooltipIcon
        :width="20"
        :height="20"
        fill="#878B93"
        tooltip="Dynamic Opening Fee"
      />
    </div>
    <div class="dynamic-fee-value">$8.88 / 0.13%</div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      multiplier: 0,
    };
  },

  methods: {
    updateMultiplier(value: any) {
      this.multiplier = value;
    },
  },

  components: {
    LeverageRange: defineAsyncComponent(
      () => import("@/components/ui/range/LeverageRange.vue")
    ),
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>
