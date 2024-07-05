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
import { ref } from "vue";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

// defineProps({
//   option: {
//     type: Object as any,
//   },
// });

const option = ref({
  xAxis: {
    type: "category",
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    splitLine: {
      show: false,
    },
  },
  series: [
    {
      data: [0, 0.01, 0.1, 1, 0.1, 0.01, 0],
      type: "line",
      areaStyle: {},
    },
  ],
});
</script>

<style lang="scss" scoped>
.chart {
  height: 325.44px;
  position: relative;
}
</style>
