<template>
  <div class="borrow">
    <ChooseChain />
    <StableCoins />
  </div>
</template>

<script>
const ChooseChain = () => import("@/components/borrow/ChooseChain");
const StableCoins = () => import("@/components/borrow/StableCoins");
export default {
  components: {
    ChooseChain,
    StableCoins,
  },
};
</script>

<style lang="scss" scoped>
.borrow {
  display: grid;
  grid-template-columns: 550px 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 1320px;
  max-width: 100%;
  padding-top: 160px;
}
</style>
