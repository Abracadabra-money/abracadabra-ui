<template>
  <div id="app">
    <Header />
    <div class="router-wrap" v-if="checkInProcess">
      <router-view />
    </div>
    <NotificationContainer />
    <PopupsWrapper />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const NotificationContainer = () => import("@/components/notifications/NotificationContainer");
const Header = () => import("@/components/main/Header");
const PopupsWrapper = () => import("@/components/popups/PopupsWrapper");

export default {
  methods: {},
  created() {},
  computed: {
    ...mapGetters({ checkInProcess: "getWalletIsConnected" }),
  },
  components: {
    Header,
    NotificationContainer,
    PopupsWrapper
  }
}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
