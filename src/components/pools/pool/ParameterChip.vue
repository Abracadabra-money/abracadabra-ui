<template>
  <div class="parameter-chip-wrap">
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.parameter-chip-wrap {
  height: 31px;
  padding: 2px;
  border-radius: 16px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 5px 8px;
  border-radius: 16px;
  background: #474e62;
  font-family: Prompt;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
