<template>
  <div class="popup">
    <div class="popup-header">
      <p class="title">Success</p>
      <img
        class="close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div class="popup-content">
      <img src="@/assets/images/sucess-popup-img.png" alt="" class="main-img" />

      <p class="info-title">The transaction has been successfully confirmed!</p>
      <p class="info-subtitle">Head over to my position to view it.</p>
    </div>

    <BaseButton borderless @click="toMyPosition">My Position</BaseButton>
  </div>
</template>

<script>
const BaseButton = () => import("@/components/base/BaseButton");
export default {
  methods: {
    closePopup() {
      this.$store.commit("closePopups");
    },
    toMyPosition() {
      this.$router.push({ name: "MyPositions" });
      this.closePopup();
    },
  },

  components: { BaseButton },
};
</script>

<style lang="scss" scoped>
.popup {
  background: #302e38;
  border: 1px solid #63ff7b;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #63ff7b;
  margin-bottom: 15px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px 25px 15px;
  text-align: center;

  .main-img {
    width: 120px;
    height: auto;
    object-fit: contain;
    margin-bottom: 6px;
  }

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
  width: 14px;
  height: 14px;
  cursor: pointer;
}
</style>
