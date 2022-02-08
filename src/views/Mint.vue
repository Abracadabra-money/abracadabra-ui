<template>
  <div class="mint">
    <ChooseChain />
    <StableCoins />
  </div>
</template>

<script>
const ChooseChain = () => import("@/components/mint/ChooseChain");
const StableCoins = () => import("@/components/mint/StableCoins");
export default {
  components: {
    ChooseChain,
    StableCoins,
  },
};
</script>

<style lang="scss" scoped>
.mint {
  display: grid;
  grid-template-columns: 550px 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 1320px;
  max-width: 100%;
}
</style>
