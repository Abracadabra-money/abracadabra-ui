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

const NotificationContainer = () =>
  import("@/components/notifications/NotificationContainer");
const AppHeader = () => import("@/components/appComponents/AppHeader");
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
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
