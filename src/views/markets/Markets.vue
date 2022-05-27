<template>
  <div class="stats">
    <h2 class="title">Available MIM Markets</h2>
    <div class="switcher">
      <MarketsSwitch
        :name="routeName"
        :items="items"
        @select="$router.push({ name: $event.name })"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
const MarketsSwitch = () => import("@/components/markets/MarketsSwitch");

export default {
  name: "Stats",
  components: { MarketsSwitch },
  data: () => ({
    items: [
      { title: "Borrow", name: "MarketsBorrow" },
      { title: "Farm", name: "MarketsFarm" },
    ],
  }),
  computed: {
    routeName() {
      console.log(this.$route.name);
      return this.$route.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.stats {
  padding-top: 160px;
  padding-bottom: 100px;
  margin: 0 auto;
  width: 940px;
  max-width: calc(100% - 20px);
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
