<template>
  <div>
    <div class="val-input" :class="{ 'val-input-error': error }">
      <button
        @click="$emit('openTokensList')"
        :disabled="!isChooseToken"
        class="value-type value-btn"
      >
        <BaseTokenIcon :icon="icon" type="select" :name="name" />
        <span class="token-name">
          {{ poolName }}
        </span>
        <img
          v-if="isChooseToken"
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
        v-if="+max > 0 && showMax"
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
const BaseTokenIcon = () => import("@/components/baseComponents/BaseTokenIcon");

export default {
  props: {
    showMax: {
      type: Boolean,
      default: true,
    },
    max: {
      type: [Number, String],
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
    isChooseToken: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
    },
    name: {
      type: String,
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
    poolName() {
      if (this.name) return this.name;
      return "Select to";
    },
  },
  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.val-input {
  display: flex;
  align-items: center;
  background: rgba(129, 126, 166, 0.2);
  border-radius: 20px;
  flex-wrap: wrap;
  padding: 8px 10px 0 10px;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: border-color 0.1s, box-shadow 0.1s;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.1);
  }
}

.val-input-error,
.val-input-error:focus-within {
  border-color: $clrErrorBorder;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.value-type {
  justify-content: space-between;
  flex: 1 1 100%;
  padding-left: 5px;
}
.value-btn {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.04);
  border: none;
  color: white;
  cursor: pointer;
  height: 32px;
  border-radius: 10px;

  &:disabled {
    cursor: default;
  }
}
.text-field {
  background: transparent;
  border: none;
  font-weight: 400;
  font-size: 18px;
  color: white;
  box-sizing: content-box;
  height: 48px;
  width: calc(100% - 50px);
  text-align: left;

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
  flex: 0 0 50px;
  border-radius: 20px;
}

.token-name {
  flex: 1 1 auto;
  text-align: left;
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

@media (min-width: 1024px) {
  .val-input {
    flex-wrap: nowrap;
    padding: 0 10px;
  }

  .value-type {
    flex: 1 1 180px;
    padding-left: 10px;
    max-width: 180px;
  }

  .value-btn {
    border-radius: 20px;
    height: 60px;
  }
  .max-btn {
    flex: 0 0 80px;
  }
  .text-field {
    height: 70px;
    text-align: center;
    width: calc(100% - (148px + 80px));
    font-size: 20px;
  }
}

</style>
