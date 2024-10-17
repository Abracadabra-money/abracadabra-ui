<template>
  <svg
    class="radio-button"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" :stroke="stroke" />
    <Transition name="dot">
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="7"
        :fill="fill"
        v-if="active"
      />
    </Transition>
  </svg>
</template>

<script>
export default {
  props: {
    active: { type: Boolean, default: false },
    stroke: { type: String, default: "#7088CC" },
    fill: { type: String, default: "#7088CC" },
  },
};
</script>

<style lang="scss" scoped>
.radio-button {
  cursor: pointer;
}

.dot-enter-active,
.dot-leave-active {
  transition: opacity 0.3s ease-in;
}

.dot-enter-from,
.dot-leave-to {
  opacity: 0;
}
</style>
