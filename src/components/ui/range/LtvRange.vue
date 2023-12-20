<template>
  <div>
    <div class="ltv-range-wrap">
      <div class="base-track">
        <div class="progress-track" :style="{ background: gradientRangeTrack }">
          <div class="progress-value" :style="progressValuePosition">
            {{ progressPercent }}
          </div>
          <input
            :class="['range', risk]"
            :style="updateTrackPosition"
            type="range"
            v-model="inputValue"
            :min="min"
            :max="max"
            :step="step"
            :disabled="disabled"
            @input="updateRange"
          />
          <span class="progress-percent-max">80%</span>
        </div>
        <span class="tooltipLtv"
          >LTV <TooltipIcon :width="13" :height="13" tooltip="LTV"
        /></span>
        <span class="tooltipMcr"
          >MRC
          <TooltipIcon :width="13" :height="13" fill="#878B93" tooltip="MRC"
        /></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
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

    progressPercent() {
      return `${Math.round((80 / 100) * this.gradientPercent)}%`;
    },

    gradientRangeTrack() {
      // todo risk
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
        // todo
        if (this.inputValue === 1) return 0;
        if (this.inputValue === max) return 100;
        return Math.floor(
          (100 / (max - this.min)) * (this.inputValue - this.min)
        );
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

  mounted() {},

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss">
:root {
  --track-position: 100%;
}

@include range;

.ltv-range-wrap {
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.base-track {
  position: relative;
  border-radius: 12px;
  height: 16px;
  background: linear-gradient(
    291deg,
    #102649 -26%,
    #0c0f1c 41%,
    #131728 63%,
    #212555 124%
  );
  box-shadow: 0px 0px 6.8px 0px rgba(125, 109, 201, 0.18);
}

.progress-track {
  max-width: 80%;
  display: flex;
  align-items: center;
  border-radius: 12px 0 0 12px;
  height: 16px;
  position: relative;
}

.progress-value {
  width: 20px;
  text-align: center;
  position: absolute;
  top: -130%;
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

.safe,
.medium,
.high {
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background: #67a069;
    border-radius: 2px;
  }
}

.medium {
  &::after {
    background: #ddc237;
  }
}

.high {
  &::after {
    background: #8c4040;
  }
}

.progress-percent-max {
  position: absolute;
  right: 0;
  transform: translateX(130%);
  color: #878b93;
  font-size: 14px;
  line-height: 16px;
}

.tooltipLtv,
.tooltipMcr {
  position: absolute;
  right: 50%;
  bottom: 0;
  transform: translate(50%, 120%);
  display: flex;
  gap: 2px;
  align-items: center;
  font-size: 12px;
  line-height: 150%;
}

.tooltipMcr {
  right: 18%;
  color: #878b93;
}
</style>
