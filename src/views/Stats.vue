<template>
  <div class="stats">
    <h2 class="title">Available MIM Markets</h2>
    <StatsSwitch :name="routeName" />
    <router-view />
  </div>
</template>

<script>
import StatsSwitch from "../components/stats/StatsSwitch";
export default {
  name: "Stats",
  components: { StatsSwitch },
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.stats {
  padding-top: 160px;
  margin: 0 auto;
  width: 940px;
  max-width: 100%;
  box-sizing: border-box;
}

.title {
  text-align: center;
  text-transform: uppercase;
}
</style>
