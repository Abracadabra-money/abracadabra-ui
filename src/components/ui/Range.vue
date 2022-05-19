<template>
  <div>
    <div class="leverage-actions">
      <div class="leverage-header">
        <button v-if="tooltipText" class="info-btn">
          <img
            class="info-icon"
            src="@/assets/images/info.svg"
            v-tooltip="tooltipText"
            alt="info"
          />
        </button>
        <h4>{{ title }}</h4>
        <div class="range-subtitle">{{ subtitle }}</div>
      </div>
      <div class="range-status" :class="risk" v-if="collateralValue">
        {{ risk }}
      </div>
    </div>

    <transition name="fade">
      <div class="range-wrap" :style="{ background: gradientRangeTrack }">
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
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: [Number, String], default: 0 },
    collateralValue: { type: [Number, String], default: "" },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 },
    step: { type: Number, default: 1 },
    risk: { type: [String, Boolean], default: "default" },
    title: { type: String, default: "Leverage up" },
    tooltipText: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    parallelRange: { type: [Number, String], default: "" },
  },
  data() {
    return {
      colors: {
        safe: "#63CAF8",
        medium: "#FFB800",
        high: "#FE1842",
        default: "rgba(255, 255, 255, 0.3)",
      },
    };
  },
  computed: {
    gradientRangeTrack() {
      let risk = this.collateralValue ? this.risk : "default";

      return `linear-gradient(
            90deg,
            ${this.colors[risk]} 0%,
            ${this.colors[risk]} ${this.gradientPercent}%,
            rgba(255, 255, 255, 0.1) ${this.gradientPercent}%,
            rgba(255, 255, 255, 0.1) 100%
          )
          `;
    },

    gradientPercent() {
      let max = 1;
      if (this.max) {
        max = this.max;
      }

      if (this.min > 0) {
        if (+this.range === 1) {
          return 0;
        }

        if (+this.range === max) {
          return 100;
        }

        return Math.floor((100 / (max - this.min)) * (+this.range - this.min));
      }

      if (this.parallelRange === "0") return 0;

      return Math.floor(100 * Math.abs(+this.range / max));
    },

    range: {
      get() {
        return this.value;
      },
      set(value) {
        let arr = String(this.max).split("");
        let index = arr.indexOf(".");
        let max = arr.slice(0, index + 5).join("");

        if (max === value) {
          this.$emit("input", this.max);
        } else {
          this.$emit("input", value);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
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

.range-status {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  border: none;
  border-radius: 32px;
  width: 60px;
  height: 30px;
  line-height: 0;
  &.safe {
    background: #63caf8;
  }

  &.medium {
    background: #ffb800;
  }

  &.high {
    background: #fe1842;
  }
}

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
