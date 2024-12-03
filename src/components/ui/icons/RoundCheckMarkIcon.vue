<template>
  <svg
    :width="width"
    :height="width"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="11.5"
      :stroke="color"
      :stroke-opacity="opacity"
    />
    <path
      d="M18.8026 8.00523L10.5526 16.2552C10.5047 16.3032 10.4478 16.3412 10.3852 16.3672C10.3226 16.3931 10.2555 16.4065 10.1878 16.4065C10.12 16.4065 10.0529 16.3931 9.99033 16.3672C9.92774 16.3412 9.87087 16.3032 9.82298 16.2552L6.21361 12.6459C6.11685 12.5491 6.0625 12.4179 6.0625 12.281C6.0625 12.1442 6.11685 12.013 6.21361 11.9162C6.31036 11.8195 6.44158 11.7651 6.57841 11.7651C6.71524 11.7651 6.84646 11.8195 6.94322 11.9162L10.1878 15.1615L18.073 7.27562C18.1697 7.17887 18.301 7.12451 18.4378 7.12451C18.5746 7.12451 18.7058 7.17887 18.8026 7.27562C18.8993 7.37237 18.9537 7.5036 18.9537 7.64042C18.9537 7.77725 18.8993 7.90848 18.8026 8.00523Z"
      :fill="color"
      :fill-opacity="opacity"
    />
  </svg>
</template>

<script lang="ts">
export default {
  props: {
    width: {
      type: Number,
      default: 24,
    },
    height: {
      type: Number,
      default: 24,
    },
    uncheckedColor: {
      type: String,
      default: "#7088CC",
    },
    checkedColor: {
      type: String,
      default: "#67A069",
    },
    checked: Boolean,
  },

  computed: {
    opacity() {
      return this.checked ? 1 : 0.3;
    },

    color() {
      return this.checked ? this.checkedColor : this.uncheckedColor;
    },
  },
};
</script>
