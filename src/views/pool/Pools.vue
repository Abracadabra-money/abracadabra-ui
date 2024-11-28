<template>
  <div class="pools-page" v-if="pools">
    <div class="pools-container">
      <PoolsInfo :pools="pools" />

      <PoolsTable
        :pools="pools"
        :poolsLoading="poolsLoading"
        :tableKeys="tableKeys"
        ref="poolsTable"
        @openMobileFiltersPopup="isFiltersPopupOpened = true"
      />
    </div>
    <FiltersPopup
      v-if="isFiltersPopupOpened"
      :sortersData="tableKeys"
      :filtersData="filtersData"
      @updateSortKey="updateSortKeys"
      @close="isFiltersPopupOpened = false"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import type { PoolConfig } from "@/configs/pools/types";
import { getPoolsList } from "@/helpers/pools/getPoolsList";
import { getPoolConfigsByChains } from "@/helpers/pools/configs/getOrCreatePairsConfigs";
import type { FilterData } from "@/types/sorting";
import {
  FEE_TIER_DECIMALS,
  feeTiersArray,
  poolTypesArray,
} from "@/constants/pools/poolCreation";
import { formatUnits } from "viem";
import { formatPercent } from "@/helpers/filters";

export default {
  data() {
    return {
      pools: [] as any[],
      poolsLoading: true,
      poolConfigs: [] as PoolConfig[],
      tableKeys: [
        {
          tableKey: "Pool name",
        },
        {
          tableKey: "TVL",
          tooltip: "Total Value Locked.",
          isSortingCriterion: true,
        },
        {
          tableKey: "Fee Tier",
          tooltip:
            "Fee that trader pays when exchanging one token for another within the pool.",
        },
        {
          tableKey: "Pool type",
          tooltip: "Indicates how liquidity is concentrated within the pool.",
        },
        {
          tableKey: "Staking APR",
          tooltip:
            "Reward token(s) and total APR for staking the pool's LP tokens.",
          isSortingCriterion: true,
        },
      ],
      isFiltersPopupOpened: false,
      updateInterval: null as NodeJS.Timeout | null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      localPoolsList: "getPoolsList",
    }),

    filtersData(): FilterData[] {
      return [
        {
          filterKey: "poolType",
          text: "Pool type",
          options: [...poolTypesArray],
          emitter: this.updatePoolTypeFilter,
        },
        {
          filterKey: "feeTier",
          text: "Fee tier",
          options: feeTiersArray.map((feeTier) =>
            formatPercent(formatUnits(feeTier, FEE_TIER_DECIMALS))
          ),
          emitter: this.updateFeeTierFilter,
        },
      ];
    },
  },

  methods: {
    ...mapMutations({
      setPoolsList: "setPoolsList",
    }),

    checkLocalData(): void {
      if (this.localPoolsList.isCreated) {
        this.pools = this.localPoolsList.data;
        this.poolsLoading = false;
      }
    },

    async createPoolsInfo(): Promise<void> {
      this.pools = await getPoolsList(this.account, this.poolConfigs);
      this.poolsLoading = false;

      this.setPoolsList(this.pools);
    },

    updateSortKeys(key: any, order: any) {
      (this.$refs.poolsTable as any).updateSortKeys(key, order);
    },

    updatePoolTypeFilter(options: string[]) {
      (this.$refs.poolsTable as any).updatePoolTypeFilter(options);
    },

    updateFeeTierFilter(options: string[]) {
      (this.$refs.poolsTable as any).updateFeeTierFilter(options);
    },
  },

  async created() {
    this.checkLocalData();
    this.poolConfigs = await getPoolConfigsByChains();
    await this.createPoolsInfo();

    this.updateInterval = setInterval(async () => {
      this.pools = await getPoolsList(this.account, this.poolConfigs);
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },

  components: {
    PoolsInfo: defineAsyncComponent(
      () => import("@/components/pools/PoolsInfo.vue")
    ),
    PoolsTable: defineAsyncComponent(
      () => import("@/components/pools/table/pools/PoolsTable.vue")
    ),
    FiltersPopup: defineAsyncComponent(
      () => import("@/components/myPositions/FiltersPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pools-page {
  min-height: 100vh;
  width: 100%;
  height: 100%;
}

.pools-container {
  padding: 125px 15px 100px;
  max-width: 1310px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 768px) {
  .pools-container {
    padding: 100px 12px 60px;
    gap: 16px;
  }
}
</style>
