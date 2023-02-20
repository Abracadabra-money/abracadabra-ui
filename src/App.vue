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
  data() {
    return {
      country: [
        "United States",
        "Myanmar [Burma]",
        "Ivory Coast",
        "Cuba",
        "Congo",
        "Iran",
        "Iraq",
        "Libya",
        "Mali",
        "Nicaragua",
        "North Korea",
        "Somalia",
        "Sudan",
        "Syria",
        "Yemen",
        "Zimbabwe",
      ],
      region: [
        "Crimea",
        "Republic of Crimea",
        "Bakhchysarai Raion",
        "Sevastopol",
      ],
    };
  },
  computed: {
    ...mapGetters({
      checkInProcess: "getWalletIsConnected",
      signer: "getSigner",
    }),
  },

  async beforeCreate() {
    return

    const location = await axios.get(
      `https://ipwhois.pro/?key=${process.env.VUE_APP_IPWHOIS_API_KEY}`
    );

    if (
      this.country.includes(location.data.country) ||
      this.region.includes(location.data.region)
    )
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
