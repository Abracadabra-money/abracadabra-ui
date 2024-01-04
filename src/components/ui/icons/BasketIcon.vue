<template>
  <svg
    :style="`width: ${width}px; height: ${height}px`"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.56818 9.92049C2.39639 7.6013 4.23171 5.625 6.55726 5.625H11.4427C13.7683 5.625 15.6036 7.6013 15.4318 9.92049L15.2744 12.0455C15.1197 14.1343 13.3798 15.75 11.2853 15.75H6.71466C4.62016 15.75 2.88032 14.1343 2.72559 12.0455L2.56818 9.92049Z"
      :stroke="stroke"
      stroke-linejoin="round"
    />
    <path
      d="M6 7.125V5.25C6 3.59315 7.34315 2.25 9 2.25V2.25C10.6569 2.25 12 3.59315 12 5.25V7.125"
      :stroke="stroke"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M6 12.75H12" stroke="white" stroke-linecap="round" />
  </svg>
</template>

<script lang="ts">
export default {
  props: {
    width: {
      type: Number,
      default: 18,
    },
    height: {
      type: Number,
      default: 18,
    },
    stroke: {
      type: String,
      default: "#ffffff",
    },
  },
};
</script>
