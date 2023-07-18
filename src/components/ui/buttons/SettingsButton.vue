<template>
  <button class="settings-btn" :class="{ active }">
    <img
      class="settings-icon"
      src="@/assets/images/settings.png"
      alt="Settings button icon"
    />
  </button>
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
.settings-btn {
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  background: transparent;
}

.settings-icon {
  width: 20px;
  height: 20px;
}

.active {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>
