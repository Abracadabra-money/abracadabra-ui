<template>
  <div class="deleverage">
    <div class="deleverage-range">
      <div class="settings-wrap">
        <button @click="openSettingsPopup" class="settings-btn">
          <img src="@/assets/images/settings.png" alt="settings" />
        </button>
      </div>

      <Range
        v-model="repayAmount"
        title="Choose the amount of MIM you want to repay"
        coefficient="$xxx.xx"
      />
    </div>

    <div class="deleverage-range">
      <div class="settings-wrap">
        <button @click="openSettingsPopup" class="settings-btn">
          <img src="@/assets/images/settings.png" alt="settings" />
        </button>
      </div>

      <Range
        v-model="removeAmount"
        title="Choose the amount of collateral you want to remove"
        coefficient="$xxx.xx"
      />
    </div>

    <div class="btns-wrap">
      <DefaultButton primary>Approve</DefaultButton>
      <DefaultButton>Deleverage</DefaultButton>
    </div>
    <DefaultButton>Close Position</DefaultButton>
    <SettingsPopup
      :isOpen="isOpenSettingsPopup"
      @closePopup="closeSettingsPopup"
    />
  </div>
</template>

<script>
const DefaultButton = () => import("@/components/main/DefaultButton");
const SettingsPopup = () => import("@/components/myPosition/SettingsPopup");
const Range = () => import("@/components/UIComponents/Range");

export default {
  data() {
    return {
      isOpenSettingsPopup: false,
      removeAmount: 0,
      repayAmount: 0,
    };
  },

  methods: {
    openSettingsPopup() {
      this.isOpenSettingsPopup = true;
    },

    closeSettingsPopup() {
      this.isOpenSettingsPopup = false;
    },
  },

  components: {
    DefaultButton,
    SettingsPopup,
    Range,
  },
};
</script>

<style lang="scss" scoped>
.deleverage {
  max-width: 550px;
  width: 100%;
  margin: 0 auto;
  padding-top: 20px;
}

.deleverage-range {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 25px;
  padding-bottom: 30px;
}

.settings-wrap {
  text-align: right;
}

.settings-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.btns-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}
</style>
