<template>
  <div class="tick-chart">
    <canvas :id="name"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  props: {
    label: {
      type: String,
      required: true,
      default: "APR",
    },
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
        plugins: {
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context) {
                const { dataset, dataIndex } = context;
                const { label, data } = dataset;
                if (label === "APY" || label === "APR")
                  return ` ${label} ${data[dataIndex].toFixed(2)}%`;
                if (label === "TVL")
                  return ` ${label} ${data[dataIndex].toFixed(4)}$`;
                if (label === "PRICE")
                  return ` ${label} ${data[dataIndex].toFixed(2)}$`;
              },
            },
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
              color: "rgba(255, 255, 255, 0.5)",
              font: {
                size: 10,
                weight: "light",
              },
              callback: function (value) {
                const classes =
                  this.$context.scale.ctx.canvas.offsetParent.classList;

                const chartValue = value < 1 ? value.toFixed(4) : value;

                if (classes.contains("apy") || classes.contains("apr")) {
                  return `${chartValue}%`;
                }

                return `${chartValue}$`;
              },
            },
          },
          x: {
            ticks: {
              color: "rgba(255, 255, 255, 0.5)",
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
            label: this.label,
            data: this.tickUpper,
            borderColor: "#73b6f6 ",
            pointBackgroundColor: "#73b6f6",
            pointBorderColor: "#73b6f6",
            pointRadius: 0,
            borderWidth: 2,
          },
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
