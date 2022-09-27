<template>
  <div class="popup-message">
    <div class="popup-header">
      <img
        class="close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div class="popup-content">
      <p class="info-title">Zero x Swapper difference Oracl Price more 1%</p>
    </div>

    <div class="btn-wrap">
      <BaseButton @click="closePopup">Cancel</BaseButton>
      <BaseButton @click="approve" primary>Continue</BaseButton>
    </div>
  </div>
</template>

<script>
const BaseButton = () => import("@/components/base/BaseButton");
export default {
  methods: {
    closePopup() {
      this.$emit("closeExecutionPricePopup");
    },

    approve() {
      this.$emit("closeExecutionPricePopup");
      this.$emit("approveExecutionPrice");
    },
  },

  components: { BaseButton },
};
</script>

<style lang="scss" scoped>
.popup-message {
  padding: 20px 10px;
  background: #302e38;
  border-radius: 30px;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 15px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px 25px 10px;
  text-align: center;

  .info-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .info-subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 1.3;
  }
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.btn-wrap {
  display: flex;
  gap: 15px;
}
</style>
