<template>
  <div class="token-chain-icon">
    <BaseTokenIcon :name="name" :icon="icon" />
    <img class="chain-icon" src="@/assets/images/networks/arb-icon-new-page.png" />
  </div>
</template>
<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
export default {
  props: {
    name: String,
    icon: String,
    chain: [Number, String],
  },
  components: { BaseTokenIcon },
};
</script>
<style scoped lang="scss">
.token-chain-icon {
  position: relative;
  width: 42px;
}

.chain-icon {
  position: absolute;
  top: -4px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
</style>
