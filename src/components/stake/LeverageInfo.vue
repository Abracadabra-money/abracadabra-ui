<template>
  <div class="leverage-info">
    {{ leverageInfo.label }}
    <router-link
      v-if="leverageInfo.id"
      :to="{
        name: 'Market',
        params: {
          chainId: selectedNetwork,
          cauldronId: leverageInfo.id,
        },
      }"
      class="leverege-link"
      >here.</router-link
    >
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { LeverageInfo } from "@/helpers/stake/types";

export default {
  props: {
    selectedNetwork: { type: Number, required: true },
    leverageInfo: { type: Object as PropType<LeverageInfo>, required: true },
  },
};
</script>

<style lang="scss" scoped>
.leverage-info {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
}

.leverege-link {
  color: #fff;
  text-decoration-line: underline;
}
</style>
