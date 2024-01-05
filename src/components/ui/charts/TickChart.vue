<template>
  <canvas id="tick-chart"></canvas>
</template>

<script lang="ts">
import { markRaw } from "vue";
import Chart from "chart.js/auto";

export default {
  props: {
    chartData: { type: Object as any },
    createChartOptions: {
      type: Function as any,
    },
  },

  data() {
    return {
      chartInstance: null as any,
      config: { type: "line" } as any,
    };
  },

  watch: {
    chartData() {
      this.chartInstance.data = this.chartData;
      this.chartInstance.update();
    },
  },

  mounted() {
    this.config.data = this.chartData;
    this.config.options = this.createChartOptions();
    const ctx: any = document.getElementById("tick-chart");
    this.chartInstance = markRaw(new Chart(ctx, this.config));
  },
};
</script>
