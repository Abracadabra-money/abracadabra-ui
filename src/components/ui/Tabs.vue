<template>
  <div class="switch">
    <button
      v-for="(item, i) in items"
      :style="`color: ${name === item ? activeColor : ''};`"
      class="switch-btn"
      :class="{ 'switch-btn-active': name === item, small }"
      :key="i"
      :disabled="disabledTabs.includes(item)"
      @click="$emit('select', item)"
    >
      <img class="icon" v-if="icons[i]" :src="icons[i]" alt="Tab icon" />
      {{ item }}
    </button>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";

export default {
  props: {
    name: {
      type: String,
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    icons: {
      type: Array as PropType<string[]>,
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
      type: Array as PropType<string[]>,
      default: () => [],
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
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.38);
  padding: 6px;
  z-index: 1;

  *:disabled {
    color: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
  }
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
