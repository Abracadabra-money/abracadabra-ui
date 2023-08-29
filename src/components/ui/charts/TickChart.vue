<template>
  <canvas id="tick-chart"></canvas>
</template>

<script>
import { markRaw } from "vue";
import Chart from "chart.js/auto";

export default {
  props: {
    chartData: {},
    createChartOptions: {},
  },

  data() {
    return {
      chartInstance: null,
      config: { type: "line" },
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
    const ctx = document.getElementById("tick-chart");
    this.chartInstance = markRaw(new Chart(ctx, this.config));
  },
};
</script>
