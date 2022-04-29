<template>
  <button
    class="chip"
    :disabled="disabled || selected"
    :class="{
      selected,
      'chip-no-image': !icon,
    }"
    @click="$emit('click', $event)"
  >
    <img v-if="icon" class="network-icon" :src="icon" alt="network" />
    <span>{{ name }}</span>
  </button>
</template>

<script>
export default {
  name: "NetworkChip",
  props: {
    selected: { type: Boolean, default: false },
    icon: { type: String },
    name: { type: String, default: "" },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.chip {
  display: grid;
  grid-template-columns: repeat(2, auto);
  column-gap: 8px;
  justify-content: center;
  align-items: center;
  height: 50px;
  min-width: 110px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid rgba(118, 195, 245, 0);
  color: white;

  &-no-image {
    grid-template-columns: 1fr;
  }

  &:disabled {
    cursor: default;
  }

  transition: background-color 0.2s, border-bottom-color 0.2s,
    border-top-color 0.2s, border-left-color 0.2s, border-right-color 0.2s;
}

.selected {
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(118, 195, 245, 0.5);
}

.network-icon {
  height: 20px;
}
</style>
