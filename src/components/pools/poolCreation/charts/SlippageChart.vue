<template>
  <div class="chart">
    <v-chart :option="option" :autoresize="true" />
  </div>
</template>

<script setup lang="ts">
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { computed, type Prop, ref } from "vue";
import { K_VALUE_DECIMALS } from "@/constants/pools/poolCreation";
import { parseUnits } from "viem";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

const props = defineProps({
  kValue: BigInt as Prop<bigint>,
});

const chartData = computed(() => {
  switch (props.kValue) {
    case parseUnits("0.0001", K_VALUE_DECIMALS):
      return [0, 0.001, 0.01, 1, 0.01, 0.001, 0];
    case parseUnits("0.00025", K_VALUE_DECIMALS):
      return [0, 0.0025, 0.025, 1, 0.025, 0.0025, 0];
    case parseUnits("0.002", K_VALUE_DECIMALS):
      return [0, 0.02, 0.2, 1, 0.2, 0.02, 0];
    default:
      return [0, 0.01, 0.1, 1, 0.1, 0.01, 0];
  }
});

const option = computed(() => {
  return {
    xAxis: {
      type: "category",
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: [
      {
        data: chartData.value,
        type: "line",
        areaStyle: {},
      },
    ],
  };
});
</script>

<style lang="scss" scoped>
.chart {
  height: 325.44px;
  position: relative;
}
</style>
