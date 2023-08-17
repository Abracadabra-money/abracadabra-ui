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
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>
