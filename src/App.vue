<template>
  <AppHeader />
  <div class="router-wrap" :style="pageBackground" v-if="checkInProcess">
    <img
      class="mim-top-bg"
      src="@/assets/images/main-mim-top-bg.png"
      alt="Mim"
    />
    <img
      class="mim-bottom-bg"
      src="@/assets/images/main-mim-bottom-bg.png"
      alt="Mim"
    />
    <router-view />
  </div>
  <NotificationContainer />
  <PopupsWrapper />
  <Banner />
  <SkullBanner />
  <OldAllowanceBanner />
  <TenderlyMod />
</template>
<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
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

    pageBackground() {
      if (this.$route.name === "BlastOnboarding") {
        return "background:#14182C";
      }
      return "";
    },
  },

  async beforeCreate() {
    try {
      const location = await axios.get(
        `https://ipwhois.pro/?key=${
          import.meta.env.VITE_APP_IPWHOIS_API_KEY
        }&security=1`
      );

      if (!location.data.success)
        throw new Error(
          `Location fetching unsuccessful: ${location.data.message}`
        );

      const isVPN = location.data.security?.vpn;

      if (
        this.country.includes(location.data.country) ||
        this.region.includes(location.data.region) ||
        isVPN
      )
        document.location.href = "https://abracadabra.money/location";
    } catch (error) {
      console.log("VPN", error);
    }
  },

  components: {
    AppHeader: defineAsyncComponent(() =>
      import("@/components/app/AppHeader.vue")
    ),
    NotificationContainer: defineAsyncComponent(() =>
      import("@/components/notifications/NotificationContainer.vue")
    ),
    PopupsWrapper: defineAsyncComponent(() =>
      import("@/components/popups/PopupsWrapper.vue")
    ),
    Banner: defineAsyncComponent(() => import("@/components/ui/Banner.vue")),
    SkullBanner: defineAsyncComponent(() =>
      import("@/components/ui/SkullBanner.vue")
    ),
    OldAllowanceBanner: defineAsyncComponent(() =>
      import("@/components/ui/OldAllowanceBanner.vue")
    ),
    TenderlyMod: defineAsyncComponent(() =>
      import("@/components/tenderly/TenderlyMod.vue")
    ),
  },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
