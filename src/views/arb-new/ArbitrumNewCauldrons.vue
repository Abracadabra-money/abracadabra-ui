<template>
  <img
    src="@/assets/images/networks/arbitrum-icon.svg"
    class="arb-cauldrons-banner"
  />
  <ArbFarms />
  <ArbCauldrons />
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
.arb-cauldrons-banner {
  display: block;
  padding-top: 160px;
  padding-bottom: 0;
  margin: 0 auto;
  height: 366px;
  width: 940px;
  max-width: calc(100% - 20px);
  box-sizing: border-box;
}
</style>
