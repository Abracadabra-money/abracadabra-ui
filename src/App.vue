<template>
  <div id="app">
    <Header />
    <div class="router-wrap">
      <router-view />
    </div>
    <NotificationContainer />
  </div>
</template>

<script>
const NotificationContainer = () => import("@/components/notifications/NotificationContainer");
const Header = () => import("@/components/main/Header");

export default {
  methods: {},
  created() {},
  components: {
    Header,
    NotificationContainer,
  },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
