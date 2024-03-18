<template>
  <div class="swap-view">
    <div class="animation-wrap">
      <img class="bg-img" src="@/assets/gifs/Preview_00299.png" alt="">
      <img class="gif-img" src="@/assets/gifs/Preview_2.gif" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.swap-view {
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  width: 100%;
}

.animation-wrap {
  margin: 0 auto;
  width: 1000px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .bg-img {
    width: 100%;
    height: auto;
  }

  .gif-img {
    position: absolute;
    left: 0;
    top: tranlateY(-50%);
    width: 100%;
    height: auto;
  }
}
</style>
