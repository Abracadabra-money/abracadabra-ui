<template>
  <div class="arbitrum-page">
    <img class="banner" src="@/assets/images/arbitrym-banner.png" alt="" />
    <ArbFarms />
    <ArbCauldrons />
  </div>
</template>
<script>
import ArbCauldrons from "@/views/arb-new/ArbCauldrons.vue";
import ArbFarms from "@/views/arb-new/ArbFarms.vue";

export default {
  components: {
    ArbCauldrons,
    ArbFarms,
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
