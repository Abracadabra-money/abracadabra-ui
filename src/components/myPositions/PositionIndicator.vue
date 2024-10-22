<template>
  <li :class="['indicator', positionRisk]">
    <span class="title">
      <slot></slot>
      <Tooltip v-if="tooltip" :tooltip="tooltip" :fill="tooltipColor" />
    </span>
    <span :class="['value', { 'text-gradient': tokenFormat }]">{{
      tokenFormat ? formatedTokenValue : formattedValue
    }}</span>
  </li>
</template>

<script lang="ts">
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import Tooltip from "@/components/ui/icons/Tooltip.vue";

export default {
  props: {
    value: { type: [Number, String], required: true },
    positionRisk: { type: String, default: "" },
    tooltip: { type: String },
    tokenFormat: { type: Boolean, default: false },
  },

  computed: {
    formattedValue() {
      return formatUSD(this.value);
    },

    formatedTokenValue() {
      return formatTokenBalance(this.value);
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

.text-gradient {
  background: linear-gradient(
    270deg,
    #ffe47c 0%,
    #ff43c3 53.78%,
    #8150d6 102.24%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media screen and (max-width: 700px) {
  .title,
  .value {
    font-size: 14px;
  }
}
</style>
