<template>
  <div class="chart-block" v-if="!!chartData">
    <div class="chart-header">
      <h3 class="chart-title">APY Chart</h3>
      <EstApy :apy="apy" />
    </div>

    <div class="interval-btns">
      <button
        class="interval-button"
        v-for="data in chartButtons"
        :class="{ 'active-btn': activeBtn === data.time }"
        @click="changeChartTime(data.time)"
        :key="data.label"
      >
        {{ data.label }}
      </button>
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
import { defineAsyncComponent } from "vue";
import { getChartData } from "@/helpers/stake/magicGlp/subgraph/getChartData/";
export default {
  props: {
    chainId: { type: Number, required: true },
    apy: { type: String, default: "0" },
    feePercent: { type: Number, default: 0 },
  },

  data() {
    return {
      chartData: null,
      chartButtons: [
        { label: "1m", time: 1 },
        { label: "3m", time: 3 },
        { label: "6m", time: 6 },
        { label: "1y", time: 12 },
      ],
      activeBtn: 1,
      updateInterval: null,
    };
  },

  methods: {
    async changeChartTime(time) {
      this.activeBtn = time;
      this.chartData = await getChartData(
        this.chainId,
        this.activeBtn,
        this.feePercent
      );
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
                return ` ${label} ${data[dataIndex].toFixed(2)}%`;
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
                return `${value}%`;
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
    this.chartData = await getChartData(
      this.chainId,
      this.activeBtn,
      this.feePercent
    );

    this.updateInterval = setInterval(async () => {
      this.chartData = await getChartData(
        this.chainId,
        this.activeBtn,
        this.feePercent
      );
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    EstApy: defineAsyncComponent(() => import("@/components/stake/EstApy.vue")),
    TickChart: defineAsyncComponent(() =>
      import("@/components/ui/charts/TickChart.vue")
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

.interval-btns {
  display: flex;
  justify-content: flex-end;
}

.interval-button {
  width: 32px;
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

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
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
