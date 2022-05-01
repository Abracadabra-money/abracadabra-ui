<template>
  <div class="popup-wrap" v-if="popupActiveType">
    <div v-click-outside="closePopup">
      <CrvPoolPopup v-if="popupActiveType === '3crv'" />
      <CrvRenPoolPopup v-if="popupActiveType === 'crv-ren'" />
      <ThreeCryptoPopup v-if="popupActiveType === 'three-crypto-deposit'" />
      <OHMPopup v-if="popupActiveType === 'olimpus'" />
      <MEMOWrapPopup v-if="popupActiveType === 'memo-wrap'" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const CrvPoolPopup = () => import("@/components/popups/Deposit/CrvPoolPopup");
const CrvRenPoolPopup = () =>
  import("@/components/popups/Deposit/CrvRenPoolPopup");
const ThreeCryptoPopup = () =>
  import("@/components/popups/Deposit/ThreeCryptoPopup");
const OHMPopup = () => import("@/components/popups/Deposit/OHMPopup/index");
const MEMOWrapPopup = () => import("@/components/popups/Deposit/MEMOWrapPopup");
export default {
  computed: {
    ...mapGetters({
      popupActiveType: "getPopupType",
      popupActiveData: "getPopupData",
    }),
  },
  methods: {
    closePopup() {
      this.$store.commit("closePopups");
    },
  },

  components: {
    CrvPoolPopup,
    CrvRenPoolPopup,
    ThreeCryptoPopup,
    OHMPopup,
    MEMOWrapPopup,
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: $headerHeight 10px 60px;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
}
</style>
