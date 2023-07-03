<template>
  <img
    class="tooltip"
    src="@/assets/images/info.svg"
    alt="info"
    v-tooltip="tooltip"
  />
</template>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: "dfdf",
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  cursor: pointer;
}
</style>
