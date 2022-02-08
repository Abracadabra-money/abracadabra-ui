<template>
  <div class="stable">
    <h1 class="title">Mint Stablecoins</h1>
    <StableInfo />
  </div>
</template>

<script>
const StableInfo = () => import("@/components/borrow/StableInfo");

export default {
  name: "StableCoins",
  components: { StableInfo },
};
</script>

<style lang="scss" scoped>
.stable {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}
.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
}
</style>
