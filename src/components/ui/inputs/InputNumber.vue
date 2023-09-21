<template>
  <input
    class="input-number"
    :class="{ disabled: isDisabled }"
    type="number"
    :placeholder="placeholder"
    :disabled="isDisabled"
    @input="(event) => $emit('changeInputNumber', event.target.value)"
  />
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
</style>
