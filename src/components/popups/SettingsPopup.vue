<template>
  <div class="settings-popup">
    <div>
      <p class="title">{{ config.title }}</p>
      <div class="subtitle-wrap">
        <p class="subtitle">{{ config.subtitle }}</p>
        <img
          class="tooltip"
          src="@/assets/images/info.svg"
          alt="info"
          v-tooltip="config.tooltipText"
        />
      </div>

      <div class="input-wrap">
        <input
          class="input"
          v-model="inputValue"
          type="number"
          placeholder="0.0"
        />

        <button
          class="input-btn"
          v-if="+max > 0 && showMax"
          @click="inputValue = max"
          :disabled="disabled"
        >
          max
        </button>
      </div>
    </div>

    <div class="popup-footer">
      <BaseButton primary @click="actionHandler">Save</BaseButton>
      <p class="footer-text">
        <a
          class="bottom-link"
          v-if="config.linkText"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          >{{ config.linkText }}</a
        >
        <span v-if="config.text"> {{ config.text }}</span>
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

    showMax: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      inputValue: this.value,
      tooltipText:
        "Transaction will revert if the leveraged amount changes by this percentage",
    };
  },

  methods: {
    actionHandler() {
      this.$emit("changeSettings", this.inputValue);
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

.input-wrap {
  display: flex;
  align-items: center;
  background: rgba(129, 126, 166, 0.2);
  height: 70px;
  width: 100%;
  font-size: 20px;
  border-radius: 20px;
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
</style>
