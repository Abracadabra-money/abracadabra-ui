<template>
  <div
    class="range-wrap"
    :style="{
      background: `linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.3) ${gradientPercent}%,
            rgba(255, 255, 255, 0.1) ${gradientPercent}%,
            rgba(255, 255, 255, 0.1) 100%
          )
          `,
    }"
  >
    <input v-model="range" type="range" :min="min" :max="max" :step="step" />
  </div>
</template>

<script>
export default {
  name: "Range",
  props: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    value: { type: [Number, String], default: 0 },
  },
  computed: {
    gradientPercent() {
      return Math.floor(100 * Math.abs(+this.range / (this.max - this.min)));
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
</style>
