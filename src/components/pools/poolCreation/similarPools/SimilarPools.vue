<template>
  <div class="similar-pools-wrap">
    <h3 class="similar-pools-title">Pools similar to yours</h3>

    <div class="similar-pools">
      <PoolItem
        :pool="pool"
        :actionConfig="actionConfig"
        v-for="(pool, index) in similarPools"
        :key="index"
      />
      <EmptyState v-for="i in 3 - similarPools.length" :key="i" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";

export default {
  props: {
    similarPools: {
      type: Array as PropType<MagicLPInfo[]>,
      default: () => [] as MagicLPInfo[],
    },
    actionConfig: {
      type: Object as PropType<ActionConfig>,
      required: true,
    },
  },

  components: {
    EmptyState: defineAsyncComponent(
      () =>
        import("@/components/pools/poolCreation/similarPools/EmptyState.vue")
    ),
    PoolItem: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/similarPools/PoolItem.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.similar-pools-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.similar-pools-title {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.similar-pools {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
