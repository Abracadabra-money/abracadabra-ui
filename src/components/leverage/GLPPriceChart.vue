<template>
  <div class="chart-container">
    <PriceChart
      :type="chartType"
      :data="data"
      :autosize="true"
      :chart-options="chartOptions"
      :series-options="seriesOptions"
      ref="lwChart"
    />
    <button type="button" @click="changeColors">Set Random Colors</button>
    <button type="button" @click="changeType">Change Chart Type</button>
    <button type="button" @click="changeData">Change Data</button>
  </div>
</template>

<script>
import { ref } from "vue";
import PriceChart from "../ui/PriceChart.vue";

const colorsTypeMap = {
  area: [
    ["topColor", 0.4],
    ["bottomColor", 0],
    ["lineColor", 1],
  ],
  bar: [
    ["upColor", 1],
    ["downColor", 1],
  ],
  baseline: [
    ["topFillColor1", 0.28],
    ["topFillColor2", 0.05],
    ["topLineColor", 1],
    ["bottomFillColor1", 0.28],
    ["bottomFillColor2", 0.05],
    ["bottomLineColor", 1],
  ],
  candlestick: [
    ["upColor", 1],
    ["downColor", 1],
    ["borderUpColor", 1],
    ["borderDownColor", 1],
    ["wickUpColor", 1],
    ["wickDownColor", 1],
  ],
  histogram: [["color", 1]],
  line: [["color", 1]],
};

export default {
  computed: {
    chartType() {
      return ref("line");
    },
    chartOptions() {
      return ref({});
    },
    lwChart() {
      return ref();
    },
    data() {
      return ref(this.generateSampleData(false));
    },
    seriesOptions() {
      return ref({
        color: "rgb(45, 77, 205)",
      });
    }
  },
  methods: {
    randomShade() {
      return Math.round(Math.random() * 255);
    },
    randomColor (alpha = 1) {
      return `rgba(${this.randomShade()}, ${this.randomShade()}, ${this.randomShade()}, ${alpha})`;
    },
    changeColors() {
      const options = {};
      const colorsToSet = colorsTypeMap[this.chartType.value];
      colorsToSet.forEach((c) => {
        options[c[0]] = this.randomColor(c[1]);
      });
      this.seriesOptions.value = options;
    },
    generateSampleData(ohlc) {
      const randomFactor = 25 + Math.random() * 25;
      function samplePoint(i) {
        return (
          i *
            (0.5 +
              Math.sin(i / 10) * 0.2 +
              Math.sin(i / 20) * 0.4 +
              Math.sin(i / randomFactor) * 0.8 +
              Math.sin(i / 500) * 0.5) +
          200
        );
      }

      const res = [];
      let date = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
      const numberOfPoints = ohlc ? 100 : 500;
      for (var i = 0; i < numberOfPoints; ++i) {
        const time = date.getTime() / 1000;
        const value = samplePoint(i);
        if (ohlc) {
          const randomRanges = [
            -1 * Math.random(),
            Math.random(),
            Math.random(),
          ].map((i) => i * 10);
          const sign = Math.sin(Math.random() - 0.5);
          res.push({
            time,
            low: value + randomRanges[0],
            high: value + randomRanges[1],
            open: value + sign * randomRanges[2],
            close: samplePoint(i + 1),
          });
        } else {
          res.push({
            time,
            value,
          });
        }

        date.setUTCDate(date.getUTCDate() + 1);
      }

      return res;
    },
    changeData() {
      const candlestickTypeData = ["candlestick", "bar"].includes(
        this.chartType.value
      );
      const newData = this.generateSampleData(candlestickTypeData);
      this.data.value = newData;
      if (this.chartType.value === "baseline") {
        const average =
          newData.reduce((s, c) => {
            return s + c.value;
          }, 0) / newData.length;
        this.seriesOptions.value = {
          baseValue: { type: "price", price: average }
        };
      }
    },
    changeType() {
      const types = [
        "line",
        "area",
        "baseline",
        "histogram",
        "candlestick",
        "bar",
      ].filter((t) => t !== this.chartType.value);
      const randIndex = Math.round(Math.random() * (types.length - 1));
      this.chartType.value = types[randIndex];
      this.changeData();

      this.lwChart.value.fitContent();
    },
  },
  components: {
    PriceChart,
  },
};
</script>

<style scoped>
.chart-container {
  height: calc(100% - 3.2em);
}
</style>
