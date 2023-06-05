<template>
  <div class="settings-popup">
    <div>
      <p class="title">Advanced settings</p>
      <div class="subtitle-wrap">
        <p class="subtitle">Gas on destination chain</p>
        <img
          class="tooltip"
          src="@/assets/images/info.svg"
          alt="info"
          v-tooltip="
            'The default amount allows you to perform a couple of transactions (e.g. Approve + Swap). Once you approve the transfer in your wallet, the transaction gas amount will be higher than a regular transaction as this includes the selected amount of destination gas to be sent.'
          "
        />
      </div>

      <div class="btns-wrap">
        <button class="setting-btn" @click="updateInputValue(0)">None</button>
        <button class="setting-btn" @click="updateInputValue(defaultValue)">
          Default
        </button>
      </div>

      <div class="input-wrap">
        <img class="input-icon" :src="config.icon" alt="Icon" />
        <input
          class="input"
          v-model="inputValue"
          type="text"
          placeholder="0.0"
        />

        <button
          class="input-btn"
          @click="updateInputValue(max)"
          :disabled="disabled"
        >
          max
        </button>
      </div>
      <p class="value-error">
        <span v-if="error">{{ error }}</span>
        <span v-else>&nbsp;</span>
      </p>
    </div>

    <div class="popup-footer">
      <BaseButton primary @click="actionHandler" :disabled="isDisabledBtn"
        >Save</BaseButton
      >
      <p class="footer-text">
        <a
          class="bottom-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          >Learn more</a
        >
        <span>about MIM being an Omnichain Fungible Tokens</span>
      </p>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  props: {
    value: {
      type: [Number, String],
      default: "",
    },
    config: {
      type: Object,
      required: true,
    },
    max: {
      type: [Number, String],
      default: 0,
    },
    defaultValue: {
      type: String,
      default: "0",
    },
  },

  data() {
    return {
      inputValue: this.value,
    };
  },

  computed: {
    isDisabledBtn() {
      if (!this.inputValue.toString().length) return true;
      return !!this.error;
    },

    error() {
      if (+this.inputValue > +this.max) {
        this.$emit("errorSettings", true);
        return `Error max value ${this.max}`;
      }
      if (
        +this.config.gasCost > +this.config.nativeTokenBalance &&
        this.inputValue
      ) {
        this.$emit("errorSettings", true);
        return `Not enough gas ${
          +this.config.gasCost - +this.config.nativeTokenBalance
        } ${this.config.nativeSymbol} needed`;
      }
      this.$emit("errorSettings", false);
      return false;
    },
  },

  watch: {
    inputValue(value, oldValue) {
      if (+this.inputValue <= +this.max)
        this.$emit("changeSettings", this.inputValue);
      if (isNaN(value)) {
        this.inputValue = oldValue;
        return false;
      }
    },
  },

  methods: {
    isDisableBtn() {
      return !!this.error;
    },

    actionHandler() {
      if (this.error || !this.inputValue.toString().length) return false;
      this.$emit("changeSettings", this.inputValue);
      this.$emit("closeSettings");
    },

    updateInputValue(value) {
      this.inputValue = value;
    },
  },

  components: {
    BaseButton,
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

.settings-popup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 480px;
  max-width: 400px;
  width: 100%;
  padding: 10px 10px 14px;
}

.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 150%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.subtitle-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.tooltip {
  cursor: pointer;
}

.btns-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
}

.setting-btn {
  text-decoration: none;
  width: 84px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  align-items: center;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: transparent;
  width: 50%;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s ease-in;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.input-wrap {
  display: flex;
  align-items: center;
  background: rgba(129, 126, 166, 0.2);
  height: 70px;
  width: 100%;
  font-size: 20px;
  border-radius: 20px;
}

.input-icon {
  max-width: 30px;
  margin-left: 15px;
  border-radius: 100%;
}

.input {
  width: 100%;
  padding: 0 15px;
  border: none;
  outline: none;
  color: #fff;
  background: transparent;
}

.settings-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-btn {
  height: 60px;
  max-width: 80px;
  width: 100%;
  text-align: center;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: none;
  color: #fff;
  cursor: pointer;
}

.input-btn:disabled {
  cursor: default;
}

.popup-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-text {
  font-size: 18px;
  line-height: 150%;
  text-align: center;
  letter-spacing: 0.025em;
}

.bottom-link {
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-right: 5px;
}

.value-error {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}
</style>
