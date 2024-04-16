<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :style="`width: ${width}px; height: ${height}px;`"
    :class="{ pointer: pointer }"
    viewBox="0 0 51 42"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.000202179 35.4624L25.4264 -6.64417e-05L50.8525 35.4624L50.8491 35.4596C44.9917 31.61 40.4838 28.6473 36.7036 26.5716L25.6126 14.2631L14.8662 26.1844C10.9397 28.2725 6.23415 31.3652 0.000202179 35.4624Z"
      :fill="fill"
    />
    <path
      d="M25.6078 42L36.896 25.9464C25.6078 32.7259 25.6078 32.7328 14.3242 25.9464L25.6078 42Z"
      :fill="fill"
    />
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 51,
    },
    height: {
      type: Number,
      default: 42,
    },
    fill: {
      type: String,
      default: "white",
    },
    pointer: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
path {
  transition: all 0.3s ease;
}

.pointer {
  cursor: pointer;
}
</style>
