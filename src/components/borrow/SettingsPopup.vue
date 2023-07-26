<template>
  <div class="settings-popup">
    <div>
      <p class="title">Settings</p>
      <div class="subtitle-wrap">
        <p class="subtitle">Slippage tolerance</p>
        <img
          class="info-icon"
          src="@/assets/images/info.svg"
          alt="info"
          v-tooltip="tooltipText"
        />
      </div>
      <input
        v-model="inputValue"
        type="number"
        :placeholder="`Auto ${slippage}%`"
        class="settings-input"
      />
    </div>
    <BaseButton primary @click="actionHandler">Save</BaseButton>
  </div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  props: {
    slippage: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      inputValue: this.slippage,
      tooltipText:
        "Transaction will revert if the leveraged amount changes by this percentage",
    };
  },

  methods: {
    actionHandler() {
      this.$emit("saveSettings", this.inputValue);
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
  height: 430px;
  width: 380px;

  max-width: 100%;
  padding: 10px 10px 0 10px;
}
.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 23px;
}
.subtitle-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  .subtitle {
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
  }
}

.info-icon {
  cursor: pointer;
}

.settings-input {
  background-color: rgba(255, 255, 255, 0.1);
  height: 50px;
  text-align: center;
  width: 100%;
  font-size: 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  margin-top: 6px;
  color: white;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
