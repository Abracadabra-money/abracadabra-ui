<template>
  <div id="app">
    <Header />
    <div class="router-wrap" v-if="checkInProcess">
      <router-view />
    </div>
    <PopupsWrapper />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const Header = () => import("@/components/main/Header");
const PopupsWrapper = () => import("@/components/popups/PopupsWrapper");
export default {
  computed: {
    ...mapGetters({ checkInProcess: "getWalletIsConnected" }),
  },
  components: {
    Header,
    PopupsWrapper,
  },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
