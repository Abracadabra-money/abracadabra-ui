<template>
  <div class="chart-block">
    <template v-if="!!chartData">
      <div class="row">
        <h3 class="title">
          <img class="token-icon" :src="chartConfig.icon" alt="Token icon" />
          {{ chartConfig.title }}
        </h3>

        <Tabs
          v-if="chartConfig.typeButtons"
          :name="chartActive"
          :items="chartConfig.typeButtons"
          width="262px"
          @select="updateChart"
        />
      </div>

      <div class="btns-wrap">
        <TimeFrame
          :timesFrame="chartConfig.intervalButtons"
          @updateTimeFrame="onUpdateTimeFrame"
        />
      </div>

      <TickChart :chartData="chartData" :createChartOptions="getChartOptions" />
    </template>

    <BaseLoader v-else medium text="Loading chart." />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { getChartData } from "@/helpers/stake/getChartData";

export default {
  props: {
    chainId: { type: Number, required: true },
    chartConfig: { type: Object, required: true },
    getChartOptions: { type: Function, required: true },
  },

  data() {
    return {
      chartActive: null as any,
      chatrPeriod: 1,
      chartData: null as any,
      updateInterval: null as any,
      chartDataPerYear: null as any,
    };
  },

  methods: {
    async onUpdateTimeFrame(period: number) {
      await this.updateChart(this.chartActive, period);
    },

    async updateChart(chartType: any, period = 1) {
      if (chartType === "magicGlpTvl") {
        this.updateMagicGlpData(chartType, period);
      } else this.updateChartData(chartType, period);
    },

    async updateMagicGlpData(type: string, period: number) {
      this.chartActive = type;
      this.chatrPeriod = period;

      if (!this.chartDataPerYear) {
        this.chartDataPerYear = await getChartData(
          type,
          12,
          this.chainId,
          this.chartConfig.feePercent
        );
      }

      const { datasets, labels }: any = this.chartDataPerYear;

      this.chartData = {
        labels: [...labels].splice(labels?.length - period * 30),
        datasets: [
          {
            borderColor: "#73b6f6 ",
            borderWidth: 2,
            data: [...datasets[0].data].splice(
              datasets[0].data?.length - period * 30
            ),
            label: "APY",
            pointBackgroundColor: "#73b6f6",
            pointBorderColor: "#73b6f6",
            pointRadius: 0,
          },
        ],
      };
    },

    async updateChartData(type: any, period: number) {
      this.chartActive = type;
      this.chatrPeriod = period;

      this.chartData = await getChartData(
        type,
        period,
        this.chainId,
        this.chartConfig.feePercent
      );
    },
  },

  async created() {
    await this.updateChart(this.chartConfig.type, 1);

    this.updateInterval = setInterval(async () => {
      await this.updateChart(this.chartActive, this.chatrPeriod);
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    TimeFrame: defineAsyncComponent(
      () => import("@/components/ui/buttons/TimeFrame.vue")
    ),
    TickChart: defineAsyncComponent(
      () => import("@/components/ui/charts/TickChart.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.chart-block {
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  min-height: 480px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.5px;
}

.token-icon {
  width: 28px;
  height: 28px;
}

.btns-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .chart-block {
    padding: 20px 10px;
    min-height: 290px;
  }

  .row {
    gap: 16px;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
