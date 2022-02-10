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
  methods: {
    notificationsTest() {

      const discription = "Thanks for taking part in the innovation of MIM.";
      const msg = "Consider yourself extremely early in taking part in creating the stablecoin that has no bias and knows no walls. $MIM- stable for everyone, everywhere";

      const mock = [
        { type: "success",title: "SUCCESS", msg, discription }, 
        { type: "error", title: "DECLINED", msg, discription },
        { type: "warning", title: "PENDING", msg, discription },
        { type: "info", title: "INFO", msg, discription }
      ];

      const ids = mock
          .map( i => this.$store.dispatch("notifications/new",i) );

      Promise.all(ids).then((result)=>{console.log("notificationsTest"+result)});
        
    }
  },
  created() {
    // this.notificationsTest();
  },
  components: {
    Header,
    NotificationContainer,
  },
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
