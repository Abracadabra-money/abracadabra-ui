<template>
  <div id="app">
    <AppHeader />
    <div class="router-wrap" v-if="checkInProcess">
      <router-view />
    </div>
    <NotificationContainer />
    <PopupsWrapper />
    <Banner />
    <SkullBanner />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const NotificationContainer = () =>
  import("@/components/notifications/NotificationContainer");
const AppHeader = () => import("@/components/app/AppHeader");
const PopupsWrapper = () => import("@/components/popups/PopupsWrapper");
const Banner = () => import("@/components/ui/Banner");
const SkullBanner = () => import("@/components/ui/SkullBanner");

export default {
  computed: {
    ...mapGetters({
      checkInProcess: "getWalletIsConnected",
      signer: "getSigner",
    }),
  },
  components: {
    AppHeader,
    NotificationContainer,
    PopupsWrapper,
    Banner,
    SkullBanner
  },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
