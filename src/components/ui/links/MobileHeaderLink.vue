<template>
  <a class="mobile-link" v-if="href" :href="href" target="_blank">
    <slot />
  </a>

  <router-link class="mobile-link" v-else :to="{ name: to }">
    <slot />
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: "Home",
    },
    href: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-link {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px;
  background: transparent;
  border-radius: 8px;
  color: #fff;
  border: none;
  outline: transparent;
  cursor: pointer;
  transition: all 0.5s;

  &::v-deep {
    img {
      width: 24px !important;
      height: 24px;
    }
  }

  &:hover {
    opacity: 0.7;
  }
}
</style>
