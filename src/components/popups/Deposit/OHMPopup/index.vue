<template>
  <div class="popup">
    <div class="popup-header">
      <p class="title">{{ action }}</p>
      <img
        class="close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div class="popup-tabs">
      <button
        class="popup-tab"
        :class="{ 'popup-tab-active': activeTab === 1 }"
        @click="activeTab = 1"
      >
        sOHM
      </button>
      <button
        class="popup-tab"
        :class="{ 'popup-tab-active': activeTab === 2 }"
        @click="activeTab = 2"
      >
        wsOHM
      </button>
    </div>

    <Stake v-if="activeTab === 1" @toggleAction="toggleAction" />

    <Wrap v-if="activeTab === 2" @toggleAction="toggleAction" />
  </div>
</template>

<script>
const Stake = () => import("@/components/popups/Deposit/OHMPopup/Stake");
const Wrap = () => import("@/components/popups/Deposit/OHMPopup/Wrap");

export default {
  data() {
    return {
      activeTab: 1,
      action: "Stake",
      amount: "",
      amountError: "",
      updateInterval: null,
      tokensInfo: null,
      isApproved: false,
    };
  },

  methods: {
    toggleAction(type) {
      this.amount = "";
      this.amountError = "";
      this.action = type;
    },

    closePopup() {
      this.$store.commit("closePopups");
    },
  },

  components: {
    Stake,
    Wrap,
  },
};

Stake;
</script>

<style lang="scss" scoped>
.popup {
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 15px 25px;
  max-width: 540px;
  width: 100%;
  min-height: 520px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
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

.popup-tabs {
  width: 320px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 2px 5px;
  background: #595860;
  border-radius: 20px;
  margin-bottom: 24px;
}

.popup-tab {
  background: #636269;
  border-radius: 20px;
  max-width: 150px;
  width: 100%;
  border: transparent;
  height: 30px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
}

.popup-tab-active {
  background: #7a7980;
}

@media (max-width: 374px) {
  .popup-tabs {
    width: 250px;
  }
}
</style>
