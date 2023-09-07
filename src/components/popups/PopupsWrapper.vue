<template>
  <div class="popup-wrap" v-if="popupActiveType">
    <div v-click-outside="closePopup">
      <CrvPoolPopup v-if="popupActiveType === '3crv'" />
      <CrvRenPoolPopup v-if="popupActiveType === 'crv-ren'" />
      <ThreeCryptoPopup v-if="popupActiveType === 'three-crypto-deposit'" />

      <SucessPopup v-if="popupActiveType === 'success'" />
      <ClaimPopup v-if="popupActiveType === 'claim'" />
      <RouteOptimisationPopup v-if="popupActiveType === 'mglp-route'" />
      <ApprovalsPopup v-if="popupActiveType === 'approvals'" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters({ popupActiveType: "getPopupType" }),
  },

  methods: {
    ...mapMutations({ closePopup: "closePopups" }),
  },

  components: {
    CrvPoolPopup: defineAsyncComponent(() =>
      import("@/components/popups/Deposit/CrvPoolPopup.vue")
    ),
    CrvRenPoolPopup: defineAsyncComponent(() =>
      import("@/components/popups/Deposit/CrvRenPoolPopup.vue")
    ),
    ThreeCryptoPopup: defineAsyncComponent(() =>
      import("@/components/popups/Deposit/ThreeCryptoPopup.vue")
    ),
    SucessPopup: defineAsyncComponent(() =>
      import("@/components/popups/SuccessPopup.vue")
    ),
    ClaimPopup: defineAsyncComponent(() =>
      import("@/components/popups/ClaimPopup.vue")
    ),
    RouteOptimisationPopup: defineAsyncComponent(() =>
      import("@/components/popups/RouteOptimisationPopup.vue")
    ),
    ApprovalsPopup: defineAsyncComponent(() =>
      import("@/components/popups/ApprovalsPopup.vue")
    ),
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
