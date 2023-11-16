<template>
  <div class="token-chain-icon">
    <BaseTokenIcon :name="name" :icon="icon" />
    <img src="@/assets/images/networks/arbitrum-icon.svg" class="chain-icon" />
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
  bottom: 6px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
</style>
