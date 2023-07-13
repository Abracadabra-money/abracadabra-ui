<template>
  <div class="percentage-buttons-block">
    <div
      class="percent-item"
      :class="{
        active: percentValue == currentPercentValue && collateralValue,
        disabled: percentValue > maxValue || !collateralValue,
      }"
      v-for="(percentValue, idx) in defaultPercentValues"
      :key="idx"
      @click="setItemActive(percentValue)"
    >
      <p>{{ percentValue }}%</p>
    </div>
    <label
      class="percent-item custom"
      :class="customPercentClass"
      @click="setCustomState(true)"
    >
      <input
        v-if="isCustom"
        v-model.trim="customValue"
        type="number"
        placeholder="XX%"
        @input="setCustomPercent($event.target.value)"
        :disabled="!collateralValue"
      />
      <p v-else>custom</p>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    maxValue: {
      type: Number,
      require: true,
    },
    collateralValue: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      defaultPercentValues: [25, 50, 70, 90],
      isCustom: false,
      customValue: "",
      inputError: false,
      currentPercentValue: null,
    };
  },
  computed: {
    customPercentClass() {
      return {
        error: this.inputError,
        active:
          this.customValue == this.currentPercentValue &&
          this.currentPercentValue !== "",
        disabled: !this.collateralValue,
      };
    },
  },
  watch: {
    collateralValue() {
      if (!this.collateralValue) {
        this.isCustom = false;
        this.currentPercentValue = null;
      }
    },
  },

  methods: {
    setCustomPercent(percent) {
      this.inputError = false;

      if (!percent) this.emitValue("");

      if (percent < 0 || percent > this.maxValue) {
        this.inputError = true;
        this.emitValue("");
      }

      if (percent > 0 && percent <= this.maxValue) this.emitValue(percent);
    },

    setCustomState(bool) {
      this.isCustom = bool;
      if (bool) this.emitValue("");
    },

    setItemActive(item) {
      this.inputError = false;
      this.isCustom = false;
      this.customValue = "";
      this.emitValue(item);
    },

    emitValue(value) {
      this.currentPercentValue = value;
      if (!isNaN(value)) this.$emit("onchange", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.percentage-buttons-block {
  width: 100%;
  max-width: 490px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
}

.percent-item {
  background: #373541;
  border-radius: 20px;
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border 0.3s ease;
  margin-right: 5px;
}

.percent-item.custom {
  width: 140px;
  margin-right: 0;
}

.percent-item.disabled {
  pointer-events: none;
  color: grey;
}

.percent-item.active,
.percent-item:hover {
  background: #55535d;
}

.percent-item.error {
  border: 1px solid red;
}

.percent-item input {
  background-color: transparent;
  border: none;
  height: 100%;
  text-align: center;
  color: #fff;
  outline: none;
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
  min-width: 50px;
}
</style>
