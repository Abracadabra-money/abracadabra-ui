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
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      rx="7"
      :fill="fill"
      v-if="active"
    />
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
</style>
