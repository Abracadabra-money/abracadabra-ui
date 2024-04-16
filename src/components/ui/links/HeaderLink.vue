<template>
  <router-link class="header-link" :to="{ name: to }">
    <slot />
  </router-link>
</template>

<script lang="ts">
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.header-link {
  display: flex;
  padding: 12px 14px;
  align-items: center;
  gap: 10px;
  height: 50px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
  }
}
</style>
