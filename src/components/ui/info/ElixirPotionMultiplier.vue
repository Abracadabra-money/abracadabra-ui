<template>
  <div class="multiplier">
    <div class="multiplier-title">Elixir Potion Multiplier</div>
    <div class="multiplier-value">5x - 29.5x</div>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.multiplier {
  padding: 6px 12px;
  background: linear-gradient(
      270deg,
      #ffe47c -3.8%,
      #ff43c3 50.8%,
      #4156e0 100%
    ),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  border-radius: 10px;
}

.multiplier-title {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.multiplier-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
}

@media (max-width: 600px) {
  .multiplier-title {
    font-size: 10px;
  }
}
</style>
