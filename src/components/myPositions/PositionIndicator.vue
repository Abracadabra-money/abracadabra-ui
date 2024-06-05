<template>
  <li :class="['indicator', positionRisk]">
    <span class="title">
      <slot></slot>
      <Tooltip :tooltip="tooltip" :fill="tooltipColor" />
    </span>
    <span class="value">{{ formattedValue }}</span>
  </li>
</template>

<script lang="ts">
import { formatUSD } from "@/helpers/filters";
import Tooltip from "@/components/ui/icons/Tooltip.vue";

export default {
  props: {
    value: { type: [Number, String], required: true },
    positionRisk: { type: String, default: "" },
    tooltip: { type: String },
  },

  computed: {
    formattedValue() {
      return formatUSD(this.value);
    },

    tooltipColor() {
      switch (this.positionRisk) {
        case "safe":
          return "#67A069";

        case "medium":
          return "#DDC237";

        case "high":
          return "#8C4040";

        default:
          return "#fff";
      }
    },
  },

  components: {
    Tooltip,
  },
};
</script>

<style lang="scss" scoped>
.indicator,
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
}

.title {
  gap: 4px;
}

.safe {
  color: #67a069;
}

.medium {
  color: #ddc237;
}

.high {
  color: #8c4040;
}

@media screen and (max-width: 700px) {
  .title,
  .value {
    font-size: 14px;
  }
}
</style>
