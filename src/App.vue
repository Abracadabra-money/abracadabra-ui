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
import axios from "axios";

export default {
  computed: {
    ...mapGetters({
      checkInProcess: "getWalletIsConnected",
      signer: "getSigner",
    }),
  },

  async beforeCreate() {
    const response = await axios.get(
      `http://ipwhois.pro/?key=${process.env.VUE_APP_IPWHOIS_API_KEY}`
    );

    const location = response.data.country;

    if (location === "United States")
      document.location.href = "https://abracadabra.money/location";
  },

  components: {
    AppHeader,
    NotificationContainer,
    PopupsWrapper,
    Banner,
    SkullBanner,
  },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
