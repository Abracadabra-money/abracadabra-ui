<template>
  <div class="leverage-range-wrap">
    <div class="progress-track" :style="{ background: gradientRangeTrack }">
      <span class="progress-value" :style="progressValuePosition">
        {{ leverageStep }}x
      </span>

      <input
        :class="['range']"
        :style="updateTrackPosition"
        type="range"
        v-model="inputValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @input="updateRange"
      />
    </div>
  </div>
</template>

<script lang="ts" scoped>
export default {
  props: {
    value: { type: [Number, String], default: 0 },
    collateralValue: { type: [Number, String], default: "" },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 },
    step: { type: Number, default: 0.01 },
    risk: { type: [String, Boolean], default: "default" },
    disabled: { type: Boolean, default: false },
  },

  data(): any {
    return {
      inputValue: +this.collateralValue,
      colors: {
        safe: { start: "#356D37", end: "#67A069" },
        medium: { start: "#A78300", end: "#FED84F" },
        high: { start: "#4F1717", end: "#8C4040" },
        default: { start: "#0C0F1C", end: "#212555" },
      },
    };
  },

  computed: {
    progressValuePosition() {
      return `left: ${this.gradientPercent}%`;
    },

    leverageStep() {
      return this.value;
    },

    gradientRangeTrack() {
      const risk = this.collateralValue ? this.risk : "default";

      return `linear-gradient(
            90deg,
            ${this.colors[risk].start} 0%,
            ${this.colors[risk].end} ${this.gradientPercent}%,
            #0C0F1C ${this.gradientPercent}%,
            #212555 100%
          )
          `;
    },

    gradientPercent() {
      const max = this.max ? this.max : 1;

      if (this.min > 0) {
        if (this.inputValue === 1) return 0;
        if (this.inputValue === max) return 100;
        const percent = Math.floor(
          (100 / (max - this.min)) * (this.inputValue - this.min)
        );
        return percent < 0 ? 0 : percent;
      }

      return Math.floor(100 * Math.abs(this.inputValue / max));
    },

    updateTrackPosition() {
      return document.documentElement.style.setProperty(
        "--track-position",
        this.gradientPercent + "%"
      );
    },
  },

  methods: {
    updateRange(event: any) {
      const value = event.target.value;
      this.inputValue = +value;

      const arr = String(this.max).split("");
      const index = arr.indexOf(".");
      const max = arr.slice(0, index + 5).join("");

      if (max === value) this.$emit("updateValue", this.max);
      else this.$emit("updateValue", value);
    },
  },
};
</script>

<style lang="scss" scoped>
:root {
  --track-position: 100%;
}

@include range;

.leverage-range-wrap {
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.progress-track {
  display: flex;
  border-radius: 12px;
  height: 16px;
  position: relative;
}

.progress-value {
  width: 20px;
  text-align: center;
  position: absolute;
  top: -150%;
  transform: translateX(-50%);
  font-size: 14px;
  line-height: 150%;
}

.range::-webkit-slider-thumb {
  position: absolute;
  left: var(--track-position);
  width: 22px;
  transform: translateX(-50%);
  z-index: 2;
}
</style>
