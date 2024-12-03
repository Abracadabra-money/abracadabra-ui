<template>
  <div class="elixir-potions">
    <span>Stake to Earn Pills Potions</span>
    <span>1x Multiplier </span>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.elixir-potions {
  width: 100%;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 12px;
  align-items: center;
  border-radius: 12px;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    linear-gradient(270deg, #915eff -3.8%, #d040c6 100%),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

@media screen and (max-width: 600px) {
  .elixir-potions {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
