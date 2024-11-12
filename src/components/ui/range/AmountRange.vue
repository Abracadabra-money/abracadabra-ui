<template>
  <div class="leverage-range-wrap">
    <div
      :class="['progress-track', { potion: isPotion }]"
      :style="{ background: gradientRangeTrack }"
    >
      <span
        class="progress-value"
        :style="progressValuePosition"
        v-if="!isAmountExceedMax"
      >
        {{ inputValue }}
      </span>

      <input
        name="amountRange"
        :class="['range']"
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
import { BigNumber, utils } from "ethers";
import { formatToFixed } from "@/helpers/filters";

export default {
  emits: ["updateAmount"],
  props: {
    amount: { type: BigNumber, default: BigNumber.from(0) },
    maxAmount: { type: BigNumber, default: BigNumber.from(0) },
    decimals: { type: Number, default: 18 },
    rangePrecision: { type: Number, default: 4 },
    min: { type: Number, default: 0 },
    risk: { type: [String, Boolean], default: "default" },
    disabled: { type: Boolean, default: false },
    isPotion: { type: Boolean, default: false },
  },
  data(): any {
    return {
      inputValue: this.getFormattedAmount(this.amount),
      colors: {
        safe: { start: "#356D37", end: "#67A069" },
        medium: { start: "#A78300", end: "#FED84F" },
        high: { start: "#4F1717", end: "#8C4040" },
        default: { start: "#0C0F1C", end: "#212555" },
        disabled: { start: "#727375", end: "#323639" },
      },

      // NOTICE: tumbler icon
      // imageUrl: "url('/src/assets/images/market/mim.svg')",
    };
  },

  computed: {
    max() {
      return this.getFormattedAmount(this.maxAmount);
    },

    step() {
      return 1 / Math.pow(10, this.rangePrecision);
    },

    progressValuePosition() {
      return `left: ${this.gradientPercent}%`;
    },

    gradientRangeTrack() {
      const color = this.isAmountExceedMax ? "disabled" : this.risk;
      return `linear-gradient(
              90deg,
             ${this.colors[color].start} 0%,
              ${this.colors[color].end} ${this.gradientPercent}%,
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

    tumbPosition() {
      return `${this.gradientPercent <= 100 ? this.gradientPercent : 100}%`;
    },

    isAmountExceedMax() {
      return this.amount.gt(this.maxAmount);
    },
  },

  watch: {
    amount(value: BigNumber) {
      this.inputValue = this.getFormattedAmount(value);
    },
  },

  methods: {
    getFormattedAmount(amount: BigNumber) {
      const parsedAmount = utils.formatUnits(amount, this.decimals);
      return Number(this.formatToFixed(parsedAmount, this.rangePrecision));
    },
    formatToFixed(amount: any, decimals = 4) {
      return formatToFixed(amount, decimals); //cut string
    },
    updateRange(event: any) {
      const parsedValue = utils.parseUnits(
        String(event.target.value),
        this.decimals
      );

      this.$emit("updateAmount", parsedValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@include range;

// input[type="range"]::-webkit-slider-thumb {
//   background: v-bind(imageUrl);
//   background-position: center center;
//   background-size: contain;
//   height: 22px;
//   width: 22px;
// }

.leverage-range-wrap {
  height: 56px;
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
  width: 40px;
  text-align: center;
  position: absolute;
  top: -150%;
  transform: translateX(-50%);
  font-size: 14px;
  line-height: 150%;
}

.range::-webkit-slider-thumb {
  position: absolute;
  left: v-bind(tumbPosition);
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
