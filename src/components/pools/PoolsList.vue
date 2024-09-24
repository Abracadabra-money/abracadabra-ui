<template>
  <div class="pools-list-wrap">
    <PoolsTable
      :pools="pools"
      :poolsLoading="poolsLoading"
      :tableKeys="tableKeys"
    />

    <div class="loader-wrap">
      <BaseLoader v-if="poolsLoading" medium text="Loading pools" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";

export default {
  props: {
    poolsLoading: { type: Boolean },
    pools: { type: Array as PropType<MagicLPInfo[]>, required: true },
  },

  data() {
    return {
      tableKeys: [
        {
          tableKey: "Pool name",
        },
        {
          tableKey: "TVL",
          tooltip: "Total Value Locked.",
        },
        {
          tableKey: "Fee Tier",
          tooltip: "Fee Tier.",
        },
        {
          tableKey: "Pool type",
          tooltip: "Pool type.",
        },
        {
          tableKey: "Staking APR",
          tooltip: "Staking APR.",
        },
      ],
    };
  },

  components: {
    PoolsTable: defineAsyncComponent(
      () => import("@/components/pools/table/PoolsTable.vue")
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
    overflow: auto;
  }
}
</style>
