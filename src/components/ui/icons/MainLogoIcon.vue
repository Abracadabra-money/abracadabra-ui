<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :style="`width: ${width}px; height: ${height}px;`"
    :class="{ pointer: pointer }"
    viewBox="0 0 43 42"
    fill="none"
  >
    <path
      d="M19.57 41.9999L30.8381 30.7562V30.7104H0V41.9999H19.57Z"
      :fill="fill"
    />
    <path
      d="M0.0688477 22.4798L11.3369 11.2285H11.3828V41.9999H0.0688477V22.4798Z"
      :fill="fill"
    />
    <path d="M30.8379 0V41.9998L42.1595 30.7104V0H30.8379Z" :fill="fill" />
    <path d="M11.2681 0L0 11.2437V11.2971H34.6603V0H11.2681Z" :fill="fill" />
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 42,
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
