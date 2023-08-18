<template>
  <div class="chart-block" :class="[chartActive]" v-if="!!chartData">
    <div class="chart-header">
      <h3 class="chart-title">Statistics</h3>
      <EstApy :apy="apy.toFixed(2)" :config="apyConfig" />
    </div>

    <div class="actions-btns">
      <div>
        <button
          class="action-btn"
          v-for="typeBtn in typeButtons"
          :class="{ 'active-btn': chartActive === typeBtn }"
          @click="updateChartData(typeBtn, 1)"
          :key="typeBtn"
        >
          {{ typeBtn }}
        </button>
      </div>

      <div>
        <button
          class="action-btn"
          v-for="period in intervalButtons"
          :class="{ 'active-btn': chatrPeriod === period }"
          @click="updateChartData(chartActive, period)"
          :key="period"
        >
          {{ period }}m
        </button>
      </div>
    </div>

    <TickChart
      :chartData="chartData"
      :createChartOptions="createChartOptions"
    />
  </div>

  <div class="loader-wrap" v-else>
    <BaseLoader />
  </div>
</template>

<script>
import moment from "moment";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { getTvl } from "@/helpers/stake/magicApe/subgraph/getTvl";
import { getYield } from "@/helpers/stake/magicApe/subgraph/getYield";
import { getPrice } from "@/helpers/stake/magicApe/subgraph/getPrice";

export default {
  props: {
    apy: {},
  },

  data() {
    return {
      chartActive: "Yield",
      typeButtons: ["Yield", "TVL", "Price"],
      intervalButtons: [1, 3, 6],
      chatrPeriod: 1,
      chartData: null,
      updateInterval: null,
    };
  },

  computed: {
    apyConfig() {
      return {
        icon: useImage("assets/images/ape/apr.png"),
        color: "#c0c53f",
      };
    },
  },

  methods: {
    async updateChartData(type = "Yield", period = 1) {
      this.chartActive = type;
      this.chatrPeriod = period;

      if (type === "Yield") {
        this.createDoubleChartDataset(await getYield(period));
      }

      if (type === "TVL") {
        this.createChartDataset(await getTvl(period), type);
      }

      if (type === "Price") {
        this.createChartDataset(await getPrice(period), type);
      }
    },

    createChartDataset(data, type) {
      const reverseData = data.reverse();
      const chartData = { labels: [], tickUpper: [] };

      reverseData.forEach((element) => {
        chartData.labels.push(moment(element.date).format("DD.MM"));
        chartData.tickUpper.push(element[type.toLowerCase()]);
      });

      const dataset = {
        label: this.chartActive.toUpperCase(),
        data: chartData.tickUpper,
        borderColor: "#c0c53f",
        pointBackgroundColor: "#c0c53f",
        pointBorderColor: "#c0c53f",
        pointRadius: 0,
        borderWidth: 2,
      };

      this.chartData = {
        labels: chartData.labels,
        datasets: [dataset],
      };
    },

    createDoubleChartDataset(data) {
      const reverseData = data.reverse();
      const chartData = { labels: [], tickUpper1: [], tickUpper2: [] };

      reverseData.forEach((element) => {
        chartData.labels.push(moment(element.date).format("DD.MM"));
        chartData.tickUpper1.push(element.apy);
        chartData.tickUpper2.push(element.apr);
      });

      const dataset1 = {
        label: "MagicAPE",
        data: chartData.tickUpper1,
        borderColor: "#c0c53f",
        pointBackgroundColor: "#c0c53f",
        pointBorderColor: "#c0c53f",
        pointRadius: 0,
        borderWidth: 4,
      };

      const dataset2 = {
        label: "APE",
        data: chartData.tickUpper2,
        borderColor: "#495B7C",
        pointBackgroundColor: "#495B7C",
        pointBorderColor: "#495B7C",
        pointRadius: 0,
        borderWidth: 2,
      };

      this.chartData = {
        labels: chartData.labels,
        datasets: [dataset1, dataset2],
      };
    },

    createChartOptions() {
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
  },

  async created() {
    await this.updateChartData(this.chartActive, this.chatrPeriod);

    this.updateInterval = setInterval(async () => {
      await this.updateChartData(this.chartActive, this.chatrPeriod);
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    EstApy: defineAsyncComponent(() => import("@/components/stake/EstApy.vue")),
    TickChart: defineAsyncComponent(() =>
      import("@/components/ui/charts/TickChart.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.chart-block {
  width: 100%;
  padding: 16px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-weight: 600;
  font-size: 18px;
}

.actions-btns {
  display: flex;
  justify-content: space-between;
  // margin-bottom: 20px;
}

.action-btn {
  max-width: 60px;
  min-width: 32px;
  background: #2a2835;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12px;
  line-height: 150%;
  color: #fff;
  cursor: pointer;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }
}

.active-btn {
  background: #343141;
}

@media (max-width: 600px) {
  .chart-block {
    padding: 10px 5px;
  }

  .chart-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
