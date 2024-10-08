<template>
  <div class="warning-wrap">
    <img
      class="error-image"
      src="@/assets/images/pools/pool-creation/warning-cross.svg"
      alt="Error"
    />
    <p class="warning-text">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
export default {};
</script>
<style lang="scss" scoped>
.warning-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 12px;
  border-radius: 16px;
  border: 1px solid #c39818;
  background: rgba(195, 152, 24, 0.1);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.warning-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
}

@media (max-width: 600px) {
  .warning-wrap {
    align-items: flex-start;
    padding: 7px 12px;
  }
}
</style>
