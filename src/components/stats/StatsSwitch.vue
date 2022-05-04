<template>
  <div class="switch-wrap">
    <div class="switch">
      <button
        v-for="(item, i) in items"
        :key="i"
        class="switch-btn"
        :class="{ 'switch-btn-active': name === item.name }"
        @click="$emit('select', item)"
        :disabled="currentName === item.name"
      >
        {{ item.title }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsSwitch",
  props: {
    name: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    currentName() {
      return this.$route.name;
    },
  },
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
  max-width: 100%;

  &-wrap {
    display: flex;
    justify-content: center;
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
