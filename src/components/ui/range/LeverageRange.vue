<template>
  <div class="leverage-range-wrap">
    <div
      :class="['progress-track', { potion: isPotion }]"
      :style="{ background: gradientRangeTrack }"
    >
      <span class="progress-value" :style="progressValuePosition">
        {{ progressValue }}x
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
    min: { type: Number, default: 1 },
    max: { type: Number, default: 10 },
    step: { type: Number, default: 0.01 },
    risk: { type: [String, Boolean], default: "default" },
    disabled: { type: Boolean, default: false },
    isPotion: { type: Boolean, default: false },
  },

  data(): any {
    return {
      inputValue: this.value,
      colors: {
        safe: { start: "#356D37", end: "#67A069" },
        medium: { start: "#A78300", end: "#FED84F" },
        high: { start: "#4F1717", end: "#8C4040" },
        default: { start: "#0C0F1C", end: "#212555" },
      },
    };
  },

  computed: {
    progressValue() {
      return this.value > this.max ? this.max : this.value;
    },

    progressValuePosition() {
      return `left: ${this.gradientPercent}%`;
    },

    gradientRangeTrack() {
      return `linear-gradient(
            90deg,
            ${this.colors[this.risk].start} 0%,
            ${this.colors[this.risk].end} ${this.gradientPercent}%,
            #0C0F1C ${this.gradientPercent}%,
            #212555 100%
          )
          `;
    },

    gradientPercent() {
      const max = this.max ? this.max : 1;

      if (this.min > 0) {
        if (this.inputValue === 1) return 0;
        if (this.inputValue >= max) return 100;
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

  watch: {
    value(value) {
      this.inputValue = value;
    },
  },

  methods: {
    updateRange(event: any) {
      const value = event.target.value;
      this.$emit("updateValue", Number(value));
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

.potion input[type="range"]::-webkit-slider-thumb {
  margin-top: -8px;
  height: 24px;
  background: url("@/assets/images/potion.svg");
}
</style>
