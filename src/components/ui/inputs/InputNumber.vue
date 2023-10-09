<template>
  <div class="input-number-wrapper">
    <div class="input-wrapper">
      <input
        class="input-number"
        :class="{ disabled: isDisabled, error: errorAmount }"
        type="number"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        @input="updateInputValue"
      />
      <button class="btn-max" @click="getMax" v-if="+max">max</button>
    </div>
    <p class="error-message" :class="{ visibility: errorAmount }">
      Our holders do not have enough tokens. Enter holders
    </p>
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

  computed: {
    errorAmount() {
      return +this.inputValue > +this.max;
    },
  },

  methods: {
    getMax() {
      this.inputValue = this.max;
      this.$emit("changeInputNumber", this.max);
    },

    updateInputValue({ target }) {
      this.inputValue = target.value;
      this.$emit("changeInputNumber", target.value);
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
}

.input-wrapper {
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
  background-color: rgba(129, 126, 166, 0.2);

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

.disabled {
  cursor: not-allowed;
}

.error {
  border: 1px solid $clrErrorBorder;
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

.error-message {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
  height: 12px;
  opacity: 0;
}

.visibility {
  opacity: 1;
}
</style>
