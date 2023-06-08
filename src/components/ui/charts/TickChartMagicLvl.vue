<template>
  <div class="tick-chart">
    <canvas :id="name"></canvas>
  </div>
</template>

<script>
import { markRaw } from "vue";
import Chart from "chart.js/auto";

export default {
  props: {
    labels: {
      type: Array,
      required: true,
    },
    datasets: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      name: "tick-chart",
      config: {
        type: "line",
      },
      chart: null,
    };
  },
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
                if (+value < 1) return ` ${label} ${value.toFixed(6)}%`;
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
                if (+value < 1) return `% ${Number(value).toFixed(6)}`;
                return `% ${Number(value).toFixed(2)}`;
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
    this.chart = markRaw(new Chart(ctx, this.config));
  },
};
</script>

<style lang="scss" scoped>
.tick-chart {
  color: #fff;
}
</style>
