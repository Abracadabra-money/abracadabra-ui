<template>
  <div class="toggle-wrap">
    <div
      :class="['toggle', { selected: selected }]"
      @click="emit('updateToggle', 0)"
    >
      <div class="indicator"></div>
    </div>
    <span class="text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

defineProps({
  selected: {
    type: Boolean,
    default: false,
  },

  text: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["updateToggle"]);
</script>

<style lang="scss" scoped>
.toggle-wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}

.toggle {
  position: relative;
  width: 30px;
  height: 10px;
  border-radius: 3px;
  background: rgba(37, 42, 85, 0.5);
  cursor: pointer;
}

.indicator {
  width: 15px;
  height: 15px;
  border-radius: 4px;
  background: #3a4668;
  position: absolute;
  top: calc(50%);
  left: 0;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}
.selected .indicator {
  left: 100%;
  background: #2881d6;
  transform: translateY(-50%) translateX(-100%);
}

.text {
  line-height: 150%;
}
</style>
