<template>
  <div class="chart-block" :class="[chartActive]" v-if="!!chartData">
    <div class="chart-header">
      <h3 class="chart-title">{{ chartConfig.title }}</h3>
      <EstApy :apy="chartConfig.apy" :config="apyConfig" />
    </div>

    <div class="actions-btns">
      <div>
        <template v-if="chartConfig.typeButtons">
          <button
            class="action-btn"
            v-for="typeBtn in chartConfig.typeButtons"
            :class="{ 'active-btn': chartActive === typeBtn }"
            @click="updateChartData(typeBtn, 1)"
            :key="typeBtn"
          >
            {{ typeBtn }}
          </button>
        </template>
      </div>

      <div>
        <button
          class="action-btn"
          v-for="{ time, label } in chartConfig.intervalButtons"
          :class="{ 'active-btn': chatrPeriod === time }"
          @click="updateChartData(chartActive, time)"
          :key="label"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <TickChart :chartData="chartData" :createChartOptions="getChartOptions" />
  </div>

  <div class="loader-wrap" v-else>
    <BaseLoader />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getChartData } from "@/helpers/stake/getChartData";

export default {
  props: {
    chartConfig: { type: Object, required: true },
    apyConfig: { type: Object },
    getChartOptions: { type: Function, required: true },
  },

  data() {
    return {
      chartActive: null,
      chatrPeriod: 1,
      chartData: null,
      updateInterval: null,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),
  },

  methods: {
    async updateChartData(type, period) {
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
    await this.updateChartData(this.chartConfig.type, 1);

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
