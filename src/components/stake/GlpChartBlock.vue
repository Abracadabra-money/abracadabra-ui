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

    <TickChart :labels="chartData.labels" :tickUpper="chartData.tickUpper" />
  </div>

  <div class="loader-wrap" v-else>
    <BaseLoader />
  </div>
</template>

<script>
import moment from "moment";
import { defineAsyncComponent } from "vue";
import { getMagicGlpChartData } from "@/helpers/subgraph/magicGlp/getMagicGlpChartData";
export default {
  props: {
    chainId: { type: Number, required: true },
    apy: { type: Number, default: 0 },
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
    async createChartData() {
      const chartData = { labels: [], tickUpper: [] };

      const response = await getMagicGlpChartData(this.chainId, this.activeBtn);

      response.forEach((element) => {
        chartData.labels.push(moment.unix(element.timestamp).format("DD.MM"));
        chartData.tickUpper.push(element.glpApy * (1 - this.feePercent));
      });

      this.chartData = chartData;
    },

    async changeChartTime(time) {
      this.activeBtn = time;
      await this.createChartData();
    },
  },

  async created() {
    await this.createChartData();

    this.updateInterval = setInterval(async () => {
      await this.createChartData();
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
    max-width: 88vw;
    margin: 0 auto;
  }

  .chart-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
