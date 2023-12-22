<template>
  <div class="switch">
    <button
      v-for="(item, i) in items"
      class="switch-btn"
      :class="{ 'switch-btn-active': name === item }"
      :key="i"
      @click="$emit('select', item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script lang="ts">
//  todo
export default {
  props: {
    name: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 220px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.38);
  padding: 6px;
}

.switch-btn {
  padding: 6px 24px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: capitalize;
}

.switch-btn-active {
  color: #7088cc;
  background-color: rgba(111, 111, 111, 0.06);
}
</style>
