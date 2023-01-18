<template>
  <div class="migrated-status" :class="{ rounded }">
    <p>Migrated</p>
  </div>
</template>

<script>
export default {
  props: {
    rounded: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.migrated-status {
  padding: 0 10px;
  background: linear-gradient(
    97.21deg,
    #6372f8 0%,
    #a4a3ff 44.99%,
    #fb5b80 100%
  );
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: max-content;
  margin-top: 4px;

  &.rounded {
    border-radius: 30px;
  }

  p {
    color: #fff;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
  }
}
</style>
