<template>
  <a
    target="_blank"
    rel="noreferrer noopener"
    href="https://twitter.com/MIM_Spell"
    class="list-link"
  >
    <svg
      :style="{ width: `${width}px`, height: `${width}px` }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M12.2175 8.66L18.5462 1.25H17.0462L11.5525 7.68375L7.16248 1.25H2.09998L8.73748 10.98L2.09998 18.75H3.59998L9.40248 11.955L14.0387 18.75H19.1012L12.2175 8.66ZM10.1637 11.065L9.49123 10.0962L4.13998 2.3875H6.44373L10.7612 8.60875L11.4337 9.5775L17.0475 17.665H14.7437L10.1637 11.065Z"
        fill="white"
      />
    </svg>
  </a>
</template>

<script>
export default {
  props: {
    width: {
      default: 20,
    },
    height: {
      default: 18,
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  cursor: pointer;
  width: inherit;
}

svg:hover path {
  fill: #76c3f5;
}
</style>
