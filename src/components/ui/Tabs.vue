<template>
  <div :style="`width: ${width};`" class="switch">
    <button
      v-for="(item, i) in items"
      :style="`color: ${name === item ? activeColor : ''};`"
      class="switch-btn"
      :class="{ 'switch-btn-active': name === item, small }"
      :key="i"
      @click="$emit('select', item)"
    >
      <img class="icon" v-if="icons[i]" :src="icons[i]" alt="Tab icon" />
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
    icons: {
      type: Array as any,
      default: () => [],
    },
    width: {
      type: String,
      default: "220px",
    },
    small: {
      type: Boolean,
      default: false,
    },
    activeColor: {
      type: String,
      default: "#7088cc",
    },
  },

  emits: ["select"],
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
  text-align: center;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: capitalize;
  gap: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.switch-btn-active {
  color: #7088cc;
  background-color: rgba(111, 111, 111, 0.06);
}

.icon {
  width: 24px;
  height: 24px;
}

.small {
  text-transform: initial;
}

@media screen and (max-width: 600px) {
  .switch-btn {
    font-size: 14px;
    padding: 6px 20px;
  }
}
</style>
