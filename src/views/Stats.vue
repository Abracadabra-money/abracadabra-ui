<template>
  <div class="stats">
    <h2 class="title">Available MIM Markets</h2>
    <div class="switcher">
      <StatsSwitch
        :name="routeName"
        :items="items"
        @select="$router.push({ name: $event.name })"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
const StatsSwitch = () => import("@/components/stats/StatsSwitch");

export default {
  name: "Stats",
  components: { StatsSwitch },
  data: () => ({
    items: [
      { title: "Borrow", name: "StatsBorrow" },
      { title: "Farm", name: "StatsFarm" },
    ],
  }),
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

.switcher {
  padding: 40px 0;
}
</style>
