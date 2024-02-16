<template>
  <div class="token-info-icon">
    <BaseTokenIcon :icon="icon" :name="name" :size="size" />
    <img class="token-chain" :src="getChainIcon(chainId)" v-if="name" />
  </div>
</template>
<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  props: {
    name: String,
    icon: String,
    chainId: [Number, String],
    size: { type: String, default: "32px" },
  },

  methods: { getChainIcon },

  components: { BaseTokenIcon },
};
</script>
<style scoped lang="scss">
.token-info-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.token-chain {
  position: absolute;
  top: -4px;
  right: 4px;
  width: 20px;
  height: 20px;
}
</style>
