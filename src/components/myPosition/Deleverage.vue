<template>
  <div class="deleverage">
    <div class="range">
      <button @click="openSettingsPopup">setting</button>
    </div>
    <div class="btns-wrap">
      <DefaultButton primary>Approve</DefaultButton>
      <DefaultButton>Repay</DefaultButton>
    </div>
    <DefaultButton>Repay</DefaultButton>
    <SettingsPopup
      :isOpen="isOpenSettingsPopup"
      @closePopup="closeSettingsPopup"
    />
  </div>
</template>

<script>
const DefaultButton = () => import("@/components/main/DefaultButton");
const SettingsPopup = () => import("@/components/myPosition/SettingsPopup");

export default {
  data() {
    return {
      isOpenSettingsPopup: false,
    };
  },

  methods: {
    openSettingsPopup() {
      this.isOpenSettingsPopup = !this.isOpenSettingsPopup;
    },

    closeSettingsPopup() {
      this.isOpenSettingsPopup = false;
    },
  },

  components: {
    DefaultButton,
    SettingsPopup,
  },
};
</script>

<style lang="scss" scoped>
.deleverage {
  max-width: 550px;
  width: 100%;
  margin: 0 auto;
  padding-top: 15px;
}

.range {
  height: 300px;
  margin-bottom: 20px;
}

.btns-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}
</style>
