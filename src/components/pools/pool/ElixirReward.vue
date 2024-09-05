<template>
  <div class="elixir-reward">
    <span class="text">
      <img src="@/assets/images/pools/elixir-icon.svg" alt="" />
      Elixir Potion</span
    >
    <span>5x Multiplier </span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.elixir-reward {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background: -webkit-linear-gradient(
    271.25deg,
    #ffe47c -2.69%,
    #ff43c3 51.91%,
    #4156e0 101.11%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
