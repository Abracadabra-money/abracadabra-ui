<template>
  <div
    class="popup"
    :style="`background-image: url(${bg})`"
    v-click-outside="closePopup"
  >
    <div class="popup-header">
      <p class="title">Important Notice</p>
      <img
        class="close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div class="popup-content">
      <p class="popup-text">
        Your address is affected by a Smart Contract Vulnerability.
      </p>
      <p class="popup-text">
        Follow the Steps here to get back your secured funds.
      </p>
      <a class="link" href="http://" target="_blank" rel="noopener noreferrer"
        >Read more about it here</a
      >
    </div>

    <BaseButton primary>Secure funds</BaseButton>
  </div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";
import bg from "@/assets/images/claim/popupBg.png";
export default {
  data() {
    return {
      bg,
    };
  },
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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px 25px 10px;

  .main-img {
    width: 135px;
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

// ------------
.popup-text,
.link {
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.005em;
  margin-bottom: 15px;
  text-shadow: 0px 2px 6px #302e38;
}

.link {
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  position: relative;
  margin-bottom: 0;
}

.link::after {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
}
</style>
