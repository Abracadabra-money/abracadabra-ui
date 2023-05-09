<template>
  <div class="box-wrap">
    <img class="info-icon" src="@/assets/images/tooltip.png" alt="Tooltip" />
    <div class="box-container">
      <p class="box-title">Entry Price</p>
      <p class="box-value">{{ entryPrice }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    entryPrice: {
      type: String,
      default: "0.0",
    },
  },
};
</script>

<style scoped>
.box-wrap {
  position: relative;
  width: 100%;
  height: 62px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(5px);
  border-radius: 20px;
}
.info-icon {
  position: absolute;
  top: 12.5px;
  left: 10px;
}
.box-container {
  padding: 10px 34px;
}
.box-title,
.box-value {
  font-family: "Prompt";
  font-style: normal;
  font-size: 14px;
  line-height: 21px;
}
.box-title {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
}
.box-value {
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #ffffff;
}
</style>
