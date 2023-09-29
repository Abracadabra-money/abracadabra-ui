<template>
  <div class="input-number-wrapper">
    <input
      class="input-number"
      :class="{ disabled: isDisabled }"
      type="number"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      @input="(event) => $emit('changeInputNumber', event.target.value)"
    />
    <button class="btn-max" @click="getMax" v-if="+max">max</button>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "1000",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      inputValue: "",
    };
  },

  watch: {
    max() {
      if (this.inputValue) this.inputValue = "";
    },
  },

  methods: {
    getMax() {
      this.inputValue = this.max;
      this.$emit("changeInputNumber", this.max);
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
input[type="number"]:hover,
input[type="number"]:focus {
  -moz-appearance: number-input;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-number-wrapper {
  width: 100%;
  position: relative;
}

.input-number {
  height: 50px;
  text-align: center;
  border-radius: 20px;
  border: none;
  outline: none;
  color: white;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

.disabled {
  cursor: not-allowed;
}

.btn-max {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  height: 32px;
  border-radius: 10px;
  padding: 10px;
}
</style>
