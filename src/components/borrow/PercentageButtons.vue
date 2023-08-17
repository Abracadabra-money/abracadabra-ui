<template>
  <div class="percentage-buttons-block">
    <button
      class="percent-button"
      :class="{
        active: percent === parcentValue && !isCustomInput,
        disabled: percent > maxParcent || isDisabled,
      }"
      v-for="percent in defaultPercentValues"
      :key="percent"
      @click="setButtonActive(percent)"
    >
      {{ percent }}%
    </button>

    <label
      class="custom-input-wrap"
      :class="customInputClasses"
      @click="setCustomState(true)"
    >
      <input
        class="custom-input"
        v-if="isCustomInput"
        v-model.trim="parcentValue"
        type="number"
        placeholder="XX%"
        @input="updateCustomPercent($event.target.value)"
        :disabled="isDisabled"
      />

      <p v-else>custom</p>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    maxParcent: {
      type: Number,
      require: true,
    },
    isDisabled: {
      type: Boolean,
      require: true,
    },
  },

  data() {
    return {
      defaultPercentValues: [25, 50, 70, 90],
      parcentValue: "",
      isCustomInput: false,
      errorCastomValue: false,
    };
  },

  computed: {
    customInputClasses() {
      return {
        error: this.errorCastomValue,
        active: this.isCustomInput && this.parcentValue,
        disabled: this.isDisabled,
      };
    },
  },

  watch: {
    isDisabled() {
      if (this.isDisabled) this.setCustomState();
    },
  },

  methods: {
    setCustomState(bool = false, value = "") {
      this.isCustomInput = bool;
      this.parcentValue = value;
    },

    setButtonActive(item) {
      this.setCustomState(false, item);
      this.updateCustomPercent(item);
    },

    updateCustomPercent(percent) {
      this.errorCastomValue = +percent > +this.maxParcent ? true : false;
      const percentValue = this.errorCastomValue ? "" : percent;
      if (!isNaN(percent)) this.$emit("onchange", percentValue);
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
  gap: 5px;
}

.percent-button,
.custom-input-wrap {
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
  color: #fff;
}

.custom-input-wrap {
  width: 140px;
}

.disabled {
  pointer-events: none;
  color: grey;
}

.active,
.percent-button:hover {
  background: #55535d;
}

.error {
  border: 1px solid red;
}

.custom-input {
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
