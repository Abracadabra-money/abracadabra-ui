<template>
  <div class="switch">
    <button
      v-for="(item, i) in items"
      :style="`color: ${name === item ? activeColor : ''};`"
      class="switch-btn"
      :class="{ 'switch-btn-active': name === item, small }"
      :key="i"
      :disabled="disabledTabs.includes(item)"
      @click="$emit('select', i)"
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
    disabledTabs: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["select"],
};
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
}

.switch-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 37px;

  border-radius: 37px;
  border: none;
  background: transparent;

  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  font-weight: 500;

  transition: all 0.3s ease;
  cursor: pointer;
}

.switch-btn:hover {
  color: #ffffff6c;
}

.switch-btn-active {
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.24) 0%,
    rgba(116, 92, 210, 0.24) 100%
  );
  font-weight: 600;
}

@media (max-width: 760px) {
  .switch-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 16px;
    font-size: 20px;
  }
}
</style>
