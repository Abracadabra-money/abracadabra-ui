<template>
  <div class="leverage-range">
    <div class="range-track" :style="{ background: gradientRangeTrack }">
      <div class="leverage-x" :style="`right: ${95 - gradientPercent}%`">
        {{ gradientPercent }}X
      </div>

      <input
        type="range"
        v-model="range"
        :min="min"
        :max="max"
        :step="step"
        :class="risk"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    value: { type: [Number, String], default: 0 },
    collateralValue: { type: [Number, String], default: "" },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 },
    step: { type: Number, default: 1 },
    risk: { type: [String, Boolean], default: "default" },
    disabled: { type: Boolean, default: false },
  },

  data(): any {
    return {
      colors: {
        safe: { start: "#356D37", end: "#67A069" },
        medium: { start: "#A78300", end: "#FED84F" },
        high: { start: "#4F1717", end: "#8C4040" },
        default: { start: "#0C0F1C", end: "#212555" },
      },
    };
  },
  computed: {
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
      let max = 1;
      if (this.max) max = this.max;

      if (this.min > 0) {
        if (+this.range === 1) return 0;
        if (+this.range === max) return 100;
        return Math.floor((100 / (max - this.min)) * (+this.range - this.min));
      }

      return Math.floor(100 * Math.abs(+this.range / max));
    },

    range: {
      get() {
        return this.value;
      },
      set(value: string) {
        const arr = String(this.max).split("");
        const index = arr.indexOf(".");
        const max = arr.slice(0, index + 5).join("");

        if (max === value) this.$emit("updateValue", this.max);
        else this.$emit("updateValue", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@include range;

.leverage-range {
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.range-track {
  display: flex;
  border-radius: 12px;
  height: 16px;
  position: relative;
}

.leverage-x {
  top: -100%;
  position: absolute;
  transform: translateY(-50%);
}
</style>
