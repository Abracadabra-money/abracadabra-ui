<template>
  <div class="tick-chart">
    <canvas :id="name"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  props: {
    labels: {
      type: Array,
      required: true,
    },
    tickUpper: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    name: "tick-chart",
    config: {
      type: "line",
    },
    chart: null,
  }),
  watch: {
    labels() {
      const data = this.createDataObject();

      this.chart.data = data;
      this.chart.update();
    },
  },
  methods: {
    updateChart() {},
    createOptionsObject() {
      return {
        responsive: true,
        // borderColor: "#2BD2F7",
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
          },
          legend: {
            display: false,
          },
          title: {
            color: "#fff",
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#ababab",
              font: {
                size: 10,
                weight: "light",
              },
            },
          },
          x: {
            ticks: {
              color: "#ababab",
              font: {
                size: 10,
                weight: "light",
              },
            },
          },
        },
      };
    },
    createDataObject() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: "APR",
            data: this.tickUpper,
            borderColor: "#73b6f6 ",
            pointBackgroundColor: "#73b6f6",
            pointBorderColor: "#73b6f6",
            pointRadius: 0,
            borderWidth: 2,
          },
          // {
          //   label: "Current Tick",
          //   data: this.currentTick,
          //   borderColor: "#0E54F8",
          //   pointBackgroundColor: "#0E54F8",
          //   pointBorderColor: "#0E54F8",
          //   pointRadius: 0,
          //   borderWidth: 0.5,
          // },
          // {
          //   label: "Tick Lower",
          //   data: this.tickLower,
          //   borderColor: "#ff94ce",
          //   pointBackgroundColor: "#ff94ce",
          //   pointBorderColor: "#ff94ce",
          //   pointRadius: 0,
          //   borderWidth: 0.5,
          // },
        ],
      };
    },
  },
  mounted() {
    const data = this.createDataObject();

    const options = this.createOptionsObject();

    this.config.data = data;
    this.config.options = options;

    const ctx = document.getElementById(this.name);
    this.chart = new Chart(ctx, this.config);
  },
};
</script>

<style lang="scss" scoped>
.tick-chart {
  color: #fff;
}
</style>
