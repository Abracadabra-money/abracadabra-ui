<template>
  <div class="wallet-btn" :class="{ active }">
    <img
      class="wallet-icon"
      src="@/assets/images/wallet-icon.png"
      alt="Wallet button icon"
    />
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-btn {
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-icon {
  width: 24px;
  height: 24px;
}

.active {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>
