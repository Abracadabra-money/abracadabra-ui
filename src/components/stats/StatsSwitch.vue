<template>
  <div class="switch-wrap">
    <div class="switch">
      <router-link
        v-for="(item, i) in items"
        :key="i"
        class="switch-btn"
        :class="{ 'switch-btn-active': name === item.name }"
        :to="{ name: item.name }"
      >
        {{ item.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsSwitch",
  components: {},
  props: {
    name: {
      type: String,
    },
  },
  data: () => ({
    items: [
      { title: "Borrow", name: "StatsBorrow" },
      { title: "Farm", name: "StatsFarm" },
    ],
  }),
};
</script>

<style lang="scss" scoped>
.switch {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 4px;
  border-radius: 20px;

  &-wrap {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }
  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.06);
    height: 50px;
    width: 150px;
    border-radius: inherit;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 600;

    &-active {
      background-color: rgba(255, 255, 255, 0.2);
      cursor: default;
    }
  }
}
</style>
