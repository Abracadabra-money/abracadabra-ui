<template>
  <div class="popup-wrap" v-if="popupActiveType">
    <!-- <NetworkPopup @close="closeModal" v-if="popupActiveType === 'network'" /> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      popupActiveType: "getPopupType",
      popupActiveData: "getPopupData",
    }),
  },
  methods: {
    closeModal() {
      this.$store.commit("closeModals");
    },
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
