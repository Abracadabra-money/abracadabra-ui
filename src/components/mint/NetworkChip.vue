<template>
  <div class="wrap" @click="$emit('click', $event)">
    <button class="chip" :class="{ selected }">
      <img
        class="chip-image"
        src="@/assets/images/networks/fantom-icon.svg"
        alt="network"
      />
      <span>Fantom</span>
    </button>
  </div>
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
  background-color: #6a6972;

  &:before {
    content: "";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    margin: -2px;
    background: linear-gradient(
      90deg,
      rgba(109, 77, 245, 0.5),
      rgba(118, 195, 245, 0.5)
    );
    position: absolute;
    z-index: -1;
  }
}

.wrap {
  position: relative;
  z-index: 0;
}
</style>
