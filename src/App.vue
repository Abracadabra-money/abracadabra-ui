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
// import { ethers } from "ethers";

const NotificationContainer = () =>
  import("@/components/notifications/NotificationContainer");
const AppHeader = () => import("@/components/app/AppHeader");
const PopupsWrapper = () => import("@/components/popups/PopupsWrapper");

export default {
  computed: {
    ...mapGetters({ checkInProcess: "getWalletIsConnected" }),
  },
  components: {
    AppHeader,
    NotificationContainer,
    PopupsWrapper,
  },
  // methods: {
  //   testWrapEncode() {
  //     const degenBox = "0xF4B36812d1645dca9d562846E3aBf416D590349e";
  //     const lp = "0x6Eb1709e0b562097BF1cc48Bc6A378446c297c04";
  //     const cauldron = "0x68f498C230015254AFF0E1EB6F85Da558dFf2362";

  //     const selector = ethers.utils.defaultAbiCoder.encode(
  //       ["string"],
  //       ["wrap(address,address,address,uint256)"]
  //     );
  //     const encodedData = ethers.utils.defaultAbiCoder.encode(
  //       ["bytes", "address", "address", "address"],
  //       [selector, degenBox, lp, cauldron]
  //     );

  //     console.log("selector", selector);
  //     console.log("encodedData", encodedData);
  //   },
  // },
  // created() {
  //   this.testWrapEncode();
  // },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
