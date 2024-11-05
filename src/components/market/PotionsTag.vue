<template>
  <div class="tag-wrap" v-if="!!text">
    <span class="content">{{ text }}</span>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-wrap {
  display: flex;
  padding: 1px;
  border-radius: 8px;
  background: linear-gradient(90deg, #2d4a96 0%, rgba(116, 92, 210, 0) 100%);
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 5px 8px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.385);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-align: center;
}
</style>
