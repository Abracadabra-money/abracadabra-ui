<template>
  <div id="app">
    <AppHeader />
    <div class="router-wrap" v-if="checkInProcess">
      <router-view />
    </div>
    <NotificationContainer />
    <PopupsWrapper />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { Contract } from "ethers";

// import abraWsGlp from "@/utils/abi/tokensAbi/abraWsGlp";

const NotificationContainer = () =>
  import("@/components/notifications/NotificationContainer");
const AppHeader = () => import("@/components/app/AppHeader");
const PopupsWrapper = () => import("@/components/popups/PopupsWrapper");

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
  },
  methods: {
    // async testWrapEncode() {
    //   const wrapper = "0x3477Df28ce70Cecf61fFfa7a95be4BEC3B3c7e75";

    //   const constract = new Contract(
    //     wrapper,
    //     abraWsGlp,
    //     this.signer
    //   );

    //   const fee = await constract.feePercent();

    //   console.log("constract", constract)
    //   console.log("fee", fee)
    // },
  },
  // mounted() {
  //   // this.testWrapEncode();
  // },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
