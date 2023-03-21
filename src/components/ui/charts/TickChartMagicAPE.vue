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
    datasets: {
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
                let value = +data[dataIndex];
                if (label === "TVL") return ` ${label} $ ${value.toFixed(4)}`;
                if (label === "PRICE") return ` $ ${value.toFixed(2)} mAPE`;
                if (label === "APE") {
                  return ` ${label}           ${value.toFixed(2)}%`;
                }
                return ` ${label} ${value.toFixed(2)}%`;
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

                if (classes.contains("yield")) {
                  return `${chartValue}%`;
                }

                return `$ ${Number(chartValue).toFixed(2)}`;
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
        datasets: this.datasets,
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
