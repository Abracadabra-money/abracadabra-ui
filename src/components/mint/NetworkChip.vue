<template>
  <button class="chip" :class="{ selected }" @click="$emit('click', $event)">
    <img
      class="chip-image"
      src="@/assets/images/networks/fantom-icon.svg"
      alt="network"
    />
    <span>Fantom</span>
  </button>
</template>

<script>
export default {
  name: "NetworkChip",
  props: {
    selected: { type: Boolean },
  },
};
</script>

<style scoped lang="scss">
.chip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 110px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  cursor: pointer;
  border: none;
  color: white;

  &-image {
    height: 20px;
    min-width: 20px;
    margin-right: 8px;
  }
}

.selected {
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(118, 195, 245, 0.5);
}
</style>
