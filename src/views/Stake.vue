<template>
  <div class="stake">
    <ChooseChain />
    <StableCoins />
  </div>
</template>

<script>
const ChooseChain = () => import("@/components/stake/ChooseChain");
const StableCoins = () => import("@/components/stake/StableCoins");
export default {
  components: {
    ChooseChain,
    StableCoins,
  },
};
</script>

<style lang="scss" scoped>
.stake {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding-top: 160px;
}

@media (min-width: 1024px) {
  .stake {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }
}
</style>