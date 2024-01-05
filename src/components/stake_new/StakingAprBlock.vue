<template>
  <div class="staking-apr">
    <img
      class="mim-icon"
      src="@/assets/images/market/m-icon.svg"
      alt="Mim icon"
    />

    <h3 class="title">Staking APR</h3>
    <div class="value">{{ apr }}%</div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    apr: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.staking-apr {
  @include font;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  padding: 24px;
  max-width: 284px;
  width: 100%;
  height: 150px;
  position: relative;
  overflow: hidden;
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.mim-icon {
  position: absolute;
  top: 17px;
  left: -11px;
}

.title {
  color: #99a0b2;
  font-weight: 500;
  line-height: 150%;
}

.value {
  font-size: 32px;
  font-weight: 500;
  line-height: 32px;
}
</style>
