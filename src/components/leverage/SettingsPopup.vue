<template>
  <div class="settings-popup">
    <div>
      <p class="title">Settings</p>
      <div class="subtitle-wrap">
        <p class="subtitle">Slippage tolerance</p>
        <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
      </div>
      <input
        v-model="slippage"
        type="number"
        placeholder="Auto 1.0%"
        class="settings-input"
      />
      <div class="subtitle-wrap">
        <p class="subtitle">Transaction deadline</p>
        <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
      </div>
      <input
        v-model="deadline"
        type="text"
        placeholder="minutes"
        class="settings-input"
      />
    </div>
    <DefaultButton primary @click="actionHandler">Save</DefaultButton>
  </div>
</template>

<script>
const DefaultButton = () => import("@/components/main/DefaultButton");

export default {
  data() {
    return {
      slippage: "",
      deadline: "",
    };
  },

  methods: {
    actionHandler() {
      this.$emit("saveSettings", this.slippage);
    },
  },

  components: {
    DefaultButton,
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
  height: 100%;
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
