<template>
  <div class="token-icon-wrap">
    <img class="token-icon" :src="url" :alt="title" />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
    },
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.token-icon-wrap {
  width: 32px;
  height: 32px;
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.token-icon {
  width: 24px;
  height: 24px;
}
</style>
