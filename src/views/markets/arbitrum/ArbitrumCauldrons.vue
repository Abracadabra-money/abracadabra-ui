<template>
  <div class="arbitrum-page">
    <div class="banner-wrap">
      <img class="coins" src="./Coins_animation.gif" alt="">
      <img class="banner" src="./Book_background.png" alt="" />
    </div>

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
.banner-wrap {
  width: 100%;
  position: relative;

  .coins {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
}
.banner {
  width: 100%;
}
</style>
