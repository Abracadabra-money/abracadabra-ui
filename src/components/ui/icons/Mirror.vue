<template>
  <a
    target="_blank"
    rel="noreferrer noopener"
    href="https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9"
    class="list-link"
  >
    <svg
      :style="{ width: `${width}px`, height: `${width}px` }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M4.80005 7C4.80005 3.68629 7.48634 1 10.8 1C14.1138 1 16.8 3.68629 16.8 7V17C16.8 17.5523 16.3523 18 15.8 18H5.80005C5.24776 18 4.80005 17.5523 4.80005 17V7Z"
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
  width: inherit;
  height: 18px;
  object-fit: contain;
  cursor: pointer;
}

svg:hover path {
  fill: #76c3f5;
}
</style>
