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
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  font-weight: 500;

  transition: all 0.3s ease;
  cursor: pointer;
}

.switch-btn:hover {
  color: #ffffffa2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.646);
}

.switch-btn-active {
  color: #fff;
  border-bottom: 1px solid rgb(255, 255, 255);
}

@media (max-width:760px) {
    .switch-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 16px;
        font-size: 20px;
      }
}
</style>
