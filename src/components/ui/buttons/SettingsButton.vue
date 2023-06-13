<template>
  <div class="settings-btn" :class="{ active }">
    <img
      class="settings-icon"
      src="@/assets/images/settings.png"
      alt="Settings button icon"
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
.settings-btn {
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-icon {
  width: 20px;
  height: 20px;
}
</style>
