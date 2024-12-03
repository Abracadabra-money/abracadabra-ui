<template>
  <div class="empty-similar-pool">
    <p class="text">Similar Pools will appear here</p>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.empty-similar-pool {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 235px;
  height: 154px;
  padding: 0px 27px 0px 28px;
  border-radius: 16px;
  border: 2px dashed #272d3c;
  background: #0e1a32;
}

.text {
  width: 180px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 135%;
}
</style>
