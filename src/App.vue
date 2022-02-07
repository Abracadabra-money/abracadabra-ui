<template>
  <div id="app">
    <Header />
    <div class="router-wrap">
      <router-view />
    </div>
  </div>
</template>

<script>
const Header = () => import("@/components/main/Header");
export default {
  components: {
    Header,
  }
};
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
