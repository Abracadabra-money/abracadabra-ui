<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
  >
    <path
      d="M15 4.50098H5V18.501C5 19.0314 5.21071 19.5401 5.58579 19.9152C5.96086 20.2903 6.46957 20.501 7 20.501H15M16 15.501L19 12.501M19 12.501L16 9.50098M19 12.501H9"
      :stroke="fill"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
export default {
  props: {
    width: {
      type: Number,
      default: 16,
    },
    height: {
      type: Number,
      default: 16,
    },
    fill: {
      type: String,
      default: "#7088CC",
    },
  },
};
</script>

<style scoped>
path {
  transition: all 0.3s ease;
}
</style>
