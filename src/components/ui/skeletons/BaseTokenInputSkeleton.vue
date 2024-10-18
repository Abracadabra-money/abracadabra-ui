<template>
  <div class="row-skeleton"></div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.row-skeleton {
  background: rgba(19, 24, 42, 1);
  background-image: linear-gradient(
    90deg,
    rgba(19, 24, 42, 1) 0px,
    rgba(35, 41, 64, 1) 60px,
    rgba(19, 24, 42, 1) 120px
  );
  background-size: 1000px;
  animation: skeleton 1.6s infinite forwards;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  width: 100%;
  min-height: 82px;
}

@keyframes skeleton {
  0% {
    background-position: -100px;
  }

  50%,
  100% {
    background-position: 180px;
  }
}
</style>
