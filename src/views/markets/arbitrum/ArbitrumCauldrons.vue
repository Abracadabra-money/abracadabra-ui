<template>
  <div class="arbitrum-page">
    <img class="banner" src="./book_01.gif" alt="" />
    <Farms />
    <Cauldrons />
  </div>
</template>
<script>
import Cauldrons from "@/views/markets/arbitrum/Cauldrons.vue";
import Farms from "@/views/markets/arbitrum/Farms.vue";

export default {
  components: {
    Cauldrons,
    Farms,
  },
};
</script>
<style lang="scss" scoped>
.arbitrum-page {
  padding: 160px 0 100px;
  margin: 0 auto;
  width: 960px;
  max-width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.banner {
  width: 100%;
}
</style>
