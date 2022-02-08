<template>
  <div>
    <div class="val-input" :class="{ 'val-input-error': error }">
      <button
        :disabled="disabled || values.length <= 1"
        class="value-type value-btn"
      >
        <img
          v-if="selectedToken"
          class="token-icon"
          :src="selectedToken.icon"
          alt="token"
        />
        <span v-if="selectedToken" class="token-name">
          {{ selectedToken.name }}
        </span>
        <img
          v-if="values.length > 1"
          class="token-arrow"
          src="@/assets/images/arrow.svg"
          alt="arrow"
        />
      </button>

      <input
        v-model="currentValue"
        :disabled="disabled"
        class="text-field"
        :class="{ 'no-max-show': !(max && showMax) }"
        type="number"
        step="any"
        placeholder="0.0"
      />
      <button
        v-if="max && showMax"
        @click="currentValue = max"
        :disabled="disabled"
        class="value-btn max-btn"
      >
        max
      </button>
    </div>
    <p class="value-error">
      <span v-if="error">{{ error }}</span>
      <span v-else>&nbsp;</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    showMax: {
      type: Boolean,
      default: true,
    },
    max: {
      type: Number,
      default: 0,
    },
    values: {
      type: Array,
      default: () => [],
    },
    tokenIndex: {
      type: Number,
      default: 0,
    },
    value: {
      type: [Number, String],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    selectedToken() {
      return this.values[this.tokenIndex];
    },
  },
};
</script>

<style lang="scss" scoped>
.val-input {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 0 10px;
  outline: 1px rgba(255, 255, 255, 0) solid;
  outline-offset: -1px;
  transition: outline-color 0.1s, box-shadow 0.1s;

  &:focus-within {
    outline-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.1);
  }
}

.val-input-error,
.val-input-error:focus-within {
  outline-color: $clrErrorBorder;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.value-type {
  justify-content: space-between;
  flex: 1 1 148px;
}
.value-btn {
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.04);
  height: 60px;
  border: none;
  color: white;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
}
.text-field {
  background: transparent;
  height: 70px;
  border: none;
  font-weight: 400;
  font-size: 20px;
  text-align: center;
  color: white;
  width: calc(100% - (148px + 80px));
  box-sizing: content-box;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}

.no-max-show {
  padding-right: 80px;
}

.max-btn {
  justify-content: center;
  flex: 0 0 80px;
}

.token-icon {
  height: 32px;
  min-width: 32px;
  margin-left: 10px;
}
.token-name {
  flex: 1 1 auto;
  text-align: left;
  margin-left: 10px;
}
.token-arrow {
  margin-right: 12px;
  width: 11px;
}

.value-error {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}
</style>
