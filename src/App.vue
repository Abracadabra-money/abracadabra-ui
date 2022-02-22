<template>
  <div id="app">
    <Header />
    <div class="router-wrap">
      <router-view />
    </div>
    <NotificationContainer />
    <PopupsWrapper />
  </div>
</template>

<script>
const NotificationContainer = () =>
  import("@/components/notifications/NotificationContainer");
const Header = () => import("@/components/main/Header");
const PopupsWrapper = () => import("@/components/popups/PopupsWrapper");

export default {
  components: {
    Header,
    NotificationContainer,
    PopupsWrapper,
  },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
