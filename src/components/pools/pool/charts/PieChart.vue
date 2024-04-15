<template>
  <div class="chart">
    <v-chart
      :option="option"
      :autoresize="true"
      @mouseover="hideTitle"
      @mouseout="showTitle"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { use } from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

use([
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  PieChart,
  CanvasRenderer,
]);
const props = defineProps({
  option: Object,
});

const option = ref(props.option);

const showTitle = () => {
  option.value!.title.show = true;
};

const hideTitle = () => {
  option.value!.title.show = false;
};

watch(props, () => {
  createOption();
});

const createOption = () => {
  option.value = props.option;
};

onMounted(() => {
  createOption();
});
</script>

<style scoped lang="scss">
.chart {
  max-width: 100%;
  max-height: 100%;
  height: 252px;
  width: 252px;
  margin: auto;
}

@media screen and (max-width: 1024px) {
}
</style>
