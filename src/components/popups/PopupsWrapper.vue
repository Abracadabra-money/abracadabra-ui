<template>
  <div class="popup-wrap" v-if="popupActiveType">
    <div v-click-outside="closePopup">
      <CrvPoolPopup v-if="popupActiveType === '3crv'" />
      <CrvRenPoolPopup v-if="popupActiveType === 'crv-ren'" />
      <ThreeCryptoPopup v-if="popupActiveType === 'three-crypto-deposit'" />
      <OHMPopup v-if="popupActiveType === 'olimpus'" />
      <MEMOWrapPopup v-if="popupActiveType === 'memo-wrap'" />
      <SucessPopup v-if="popupActiveType === 'success'" />
      <ClaimPopup v-if="popupActiveType === 'claim'" />
      <RouteOptimisationPopup v-if="popupActiveType === 'mglp-route'" />
      <ApprovalsPopup v-if="popupActiveType === 'approvals'"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CrvPoolPopup from "@/components/popups/Deposit/CrvPoolPopup.vue";
import CrvRenPoolPopup from "@/components/popups/Deposit/CrvRenPoolPopup.vue";
import ThreeCryptoPopup from "@/components/popups/Deposit/ThreeCryptoPopup.vue";
import OHMPopup from "@/components/popups/Deposit/OHMPopup/index.vue";
import MEMOWrapPopup from "@/components/popups/Deposit/MEMOWrapPopup.vue";
import SucessPopup from "@/components/popups/SuccessPopup.vue";
import ApprovalsPopup from "@/components/popups/ApprovalsPopup.vue";
import ClaimPopup from "@/components/popups/ClaimPopup.vue";
import RouteOptimisationPopup from "@/components/popups/RouteOptimisationPopup.vue";

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
    SucessPopup,
    ClaimPopup,
    RouteOptimisationPopup,
    ApprovalsPopup
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
