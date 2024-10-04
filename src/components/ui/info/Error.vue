<template>
  <div class="error-wrap">
    <img
      class="error-image"
      src="@/assets/images/notification-icons/error-icon.png"
      alt="Error"
    />
    <p class="error-text">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
export default {};
</script>
<style lang="scss" scoped>
.error-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 12px;
  border-radius: 16px;
  border: 1px solid $error;
  background: linear-gradient(
      0deg,
      rgba(217, 72, 68, 0.1) 0%,
      rgba(217, 72, 68, 0.1) 100%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );

  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.error-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
}

@media (max-width: 600px) {
  .error-wrap {
    align-items: flex-start;
    padding: 7px 12px;
  }
}
</style>
