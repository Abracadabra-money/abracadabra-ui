<template>
  <div
    class="row-skeleton"
    :style="{ 'max-width': maxWidth, height: height }"
  ></div>
</template>

<script lang="ts">
export default {
  props: {
    maxWidth: {
      type: String,
      default: "130px",
    },
    height: {
      type: String,
      default: "48px",
    },
  },
};
</script>

<style lang="scss" scoped>
.row-skeleton {
  background: rgba(19, 24, 42, 1);
  max-width: 130px;
  height: 48px;
  width: 100%;
  border-radius: 12px;
  border-radius: 12px;
  background-image: linear-gradient(
    90deg,
    rgba(19, 24, 42, 1) 0px,
    rgba(35, 41, 64, 1) 60px,
    rgba(19, 24, 42, 1) 120px
  );
  background-size: 1000px;
  animation: skeleton 1.6s infinite forwards;
}

@keyframes skeleton {
  0% {
    background-position: -100px;
  }

  50%,
  100% {
    background-position: 400px;
  }
}
</style>
