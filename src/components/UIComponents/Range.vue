<template>
  <div>
    <div class="leverage-actions">
      <div class="leverage-header">
        <button v-if="tooltipText" class="info-btn">
          <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
        </button>
        <h4>{{ title }}</h4>
        <div class="range-subtitle">{{ subtitle }}</div>
      </div>

      <StatusName :isSafe="isSafe" :isMedium="isMedium" :isHigh="isHigh" />
    </div>

    <div
      class="range-wrap"
      :style="{
        background: `linear-gradient(
            90deg,
            ${gradientColor} 0%,
            ${gradientColor} ${gradientPercent}%,
            rgba(255, 255, 255, 0.1) ${gradientPercent}%,
            rgba(255, 255, 255, 0.1) 100%
          )
          `,
      }"
    >
      <input v-model="range" type="range" :min="min" :max="max" :step="step" />
    </div>
    <p class="coefficient">
      <template v-if="coefficient"> {{ coefficient }}</template>
      <template v-else>&nbsp;</template>
    </p>
  </div>
</template>

<script>
const StatusName = () => import("@/components/UIComponents/StatusName");

export default {
  name: "Range",
  components: { StatusName },
  props: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    value: { type: [Number, String], default: 0 },
    title: { type: String, default: "Leverage up" },
    subtitle: { type: String, default: "" },
    coefficient: { type: String, default: "" },
    tooltipText: { type: String, default: "" },

    isSafe: { type: Boolean, default: true },
    isMedium: { type: Boolean, default: false },
    isHigh: { type: Boolean, default: false },
  },
  data: () => ({
    colors: {
      safe: "#63CAF8",
      medium: "#FFB800",
      high: "#FE1842",
      none: "rgba(255, 255, 255, 0.3)",
    },
  }),
  computed: {
    gradientPercent() {
      return Math.floor(100 * Math.abs(+this.range / (this.max - this.min)));
    },
    gradientColor() {
      const { safe, medium, high, none } = this.colors;
      return this.isSafe
        ? safe
        : this.isMedium
        ? medium
        : this.isHigh
        ? high
        : none;
    },
    statusName() {
      return this.isSafe
        ? "Safe"
        : this.isMedium
        ? "Medium"
        : this.isHigh
        ? "High"
        : null;
    },
    range: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.range-wrap {
  display: flex;
  border-radius: 20px;
  height: 8px;
  overflow: visible;
}

/********** Range Input Styles **********/
/*Range Reset*/
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
}

/* Removes default focus */
input[type="range"]:focus {
  outline: none;
}

/***** Chrome, Safari, Opera and Edge Chromium styles *****/
/* slider track */
input[type="range"]::-webkit-slider-runnable-track {
  //background: rgba(255, 255, 255, 0.1);
  background: transparent;
  border-radius: 20px;
  height: 8px;
}

/* slider thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  margin-top: -4px; /* Centers thumb on the track */
  border-radius: 20px;
  -webkit-box-shadow: 0 0 0 1px #ffffff;
  box-shadow: 0 0 0 1px #ffffff;

  /*custom styles*/
  background-color: #181235;
  height: 16px;
  width: 16px;
}

/******** Firefox styles ********/
/* slider track */
input[type="range"]::-moz-range-track {
  //background: rgba(255, 255, 255, 0.1);
  background: transparent;
  border-radius: 20px;
  height: 8px;
}

/* slider thumb */
input[type="range"]::-moz-range-thumb {
  border-radius: 20px;
  border: none;
  box-shadow: 0 0 0 1px #ffffff;
  -moz-box-shadow: 0 0 0 1px #ffffff;
  /*custom styles*/
  background-color: #181235;
  height: 16px;
  width: 16px;
}

.leverage-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  height: 30px;
  .info-btn {
    background-color: transparent;
    cursor: pointer;
    border: none;
    margin-right: 10px;
    width: 24px;
    height: 24px;

    .info-icon {
      width: 24px;
      height: 24px;
    }
  }
}

.leverage-header {
  display: flex;
  align-items: center;
}

.range-subtitle {
  margin-left: 10px;
}

.coefficient {
  text-align: right;
  margin-top: 9px;
}
</style>
