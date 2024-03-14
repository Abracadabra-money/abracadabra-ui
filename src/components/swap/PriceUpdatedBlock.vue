<template>
  <div class="wrapper">
    <div class="title">
      <img src="@/assets/images/networks/unsupportedChain.svg" alt="" />
      Price Updated
    </div>
    <button :class="['button', 'active']" @click="console.log('click')">
      Accept
    </button>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 8px;
  border-radius: 12px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  gap: 8px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.button {
  border-radius: 10px;
  border: 2px solid #7088cc;
  background: rgba(255, 255, 255, 0.01);
  padding: 8px 24px;
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  max-width: 143px;
  width: 100%;
  cursor: pointer;
}

.active {
  color: #fff;
  background: #7088cc;
}
</style>
