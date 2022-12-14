<template>
  <div class="primary-apy-block">
    <img class="bg-img" src="@/assets/images/primary-apy-bg.png" alt="">
    <p class="title">{{ title }}</p>
    <p class="value">{{ value }} %</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Self repaying APY",
      value: "10",
    };
  },
};
</script>

<style lang="scss" scoped>
.primary-apy-block {
  width: 100%;
  max-width: 680px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 5px;
  position: relative;

  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .title {
    font-weight: 400;
    font-size: 18px;
    line-height: 1.3;
    position: relative;
  }

  .value {
    position: relative;
    font-weight: 700;
    font-size: 30px;
    line-height: 1.5;
  }
}
</style>
