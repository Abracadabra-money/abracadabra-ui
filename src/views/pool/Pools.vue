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
import { getPoolConfigs } from "@/helpers/pools/getPoolConfigs";
import type { FilterData } from "@/types/sorting";
import { poolTypesArray } from "@/constants/pools/poolCreation";

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
          tooltip: "Fee Tier.",
          isSortingCriterion: true,
        },
        {
          tableKey: "Pool type",
          tooltip: "Pool type.",
        },
        {
          tableKey: "Staking APR",
          tooltip: "Staking APR.",
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
          options: this.getFeeTierOptions(),
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

    updatePoolTypeFilter(option: string) {
      (this.$refs.poolsTable as any).updatePoolTypeFilter(option);
    },

    updateFeeTierFilter(option: string) {
      (this.$refs.poolsTable as any).updateFeeTierFilter(option);
    },

    getFeeTierOptions() {
      return (this.$refs.poolsTable as any).getFeeTierOptions();
    },
  },

  async created() {
    this.checkLocalData();
    this.poolConfigs = await getPoolConfigs();
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
      () => import("@/components/pools/table/PoolsTable.vue")
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
