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
  created() {
    this.$store.commit("addNotification", {
      title: "SUCCESS",
      discription: "Thanks for taking part in the innovation of MIM.",
      msg: "Consider yourself extremely early in taking part in creating the stablecoin that has no bias and knows no walls. $MIM- stable for everyone, everywhere",
      type: "success",
      id: (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,""),
    });
    this.$store.commit("addNotification", {
      title: "PENDING",
      discription: "Thanks for taking part in the innovation of MIM.",
      msg: "Consider yourself extremely early in taking part in creating the stablecoin that has no bias and knows no walls. $MIM- stable for everyone, everywhere",
      type: "warning",
      id: (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,""),
    });
    this.$store.commit("addNotification", {
      title: "DECLINED",
      discription: "Thanks for taking part in the innovation of MIM.",
      msg: "Consider yourself extremely early in taking part in creating the stablecoin that has no bias and knows no walls. $MIM- stable for everyone, everywhere",
      type: "error",
      id: (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,""),
    });
    this.$store.commit("addNotification", {
      title: "INFO",
      discription: "Thanks for taking part in the innovation of MIM.",
      msg: "Consider yourself extremely early in taking part in creating the stablecoin that has no bias and knows no walls. $MIM- stable for everyone, everywhere",
      type: "info",
      id: (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,""),
    });
  },
  components: {
    Header,
    NotificationContainer
  }
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
