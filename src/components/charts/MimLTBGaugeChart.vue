<template>
  <div class="wrap">
    <v-chart class="chart" :option="option" :autoresize="true" />
  </div>
</template>

<script lang="ts">
import { use } from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";

use([GaugeChart, CanvasRenderer]);

export default {
  props: {
    chartData: {},
  },

  data(): any {
    return {
      option: null,
    };
  },

  watch: {
    chartData() {
      this.option = this.createChartOption();
    },
  },

  methods: {
    createChartOption() {
      return {
        backgroundColor: "transparent",
        series: [
          {
            type: "gauge",
            center: ["50%", "80%"],
            radius: "110%",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: this.chartData.max,
            splitNumber: 1,
            progress: {
              show: true,
              roundCap: true,
              width: 30,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 30,
              },
            },
            axisTick: {
              splitNumber: 1,
              lineStyle: {
                width: 0,
              },
            },
            splitLine: {
              distance: 0,
              lineStyle: {
                width: 0,
              },
            },
            axisLabel: {
              distance: 30,
              color: "#999",
              fontSize: 20,
            },
            detail: {
              valueAnimation: true,
              width: "50%",
              lineHeight: 46,
              borderRadius: 8,
              offsetCenter: [0, -30],
              fontSize: 35,
              fontWeight: "bolder",
              formatter: (value: any) => {
                return value;
              },
              color: "white",
            },
            data: this.chartData.data,
          },
        ],
      };
    },
  },

  async mounted() {
    this.option = this.createChartOption(this.chartData);
  },

  provide: {
    [THEME_KEY as keyof typeof THEME_KEY]: "dark",
  },

  components: {
    VChart,
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
