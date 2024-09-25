<template>
  <div class="pools-list-wrap">
    <div class="pools-list">
      <PoolListCard
        v-for="(pool, index) in poolsList"
        :key="index"
        :pool="pool"
      />
    </div>

    <div class="loader-wrap">
      <BaseLoader v-if="poolsLoading" medium text="Loading pools" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { formatUnits } from "viem";

export default {
  props: {
    poolsLoading: { type: Boolean },
    pools: { type: Array as PropType<MagicLPInfo[]>, required: true },
  },

  computed: {
    poolsList() {
      return [...this.pools].sort((a, b) => {
        const aTotalSupply = Number(formatUnits(a.totalSupply, a.decimals));
        const bTotalSupply = Number(formatUnits(b.totalSupply, b.decimals));
        const aTotalSupplyUsd = a?.price ? aTotalSupply * a.price : 0;
        const bTotalSupplyUsd = b?.price ? bTotalSupply * b.price : 0;
        return bTotalSupplyUsd - aTotalSupplyUsd;
      });
    },
  },

  components: {
    PoolListCard: defineAsyncComponent(
      () => import("@/components/pools/PoolListCard.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pools-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-height: 300px;
  padding: 6px;
}

.pools-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px;
}

.loader-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 650px) {
  .pools-list-wrap {
    height: 500px;
    overflow: auto;
  }
}
</style>
