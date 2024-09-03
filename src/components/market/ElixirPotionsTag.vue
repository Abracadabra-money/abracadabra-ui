<template>
  <div class="tag-wrap">
    <span class="content">Earning Elixir Potions</span>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.tag-wrap {
  display: flex;
  padding: 1px;
  border-radius: 8px;
  background: linear-gradient(
    270deg,
    rgb(255, 229, 124) 0%,
    rgb(255, 67, 195) 52.6%,
    rgb(65, 86, 224) 100%
  );
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
