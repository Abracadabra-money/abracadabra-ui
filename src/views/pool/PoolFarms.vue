<template>
  <div class="pools-page" v-if="pools">
    <div class="pools-container">
      <PoolsInfo :pools="pools" isFarms />

      <PoolFarmsTable
        :pools="pools"
        :poolsLoading="poolsLoading"
        :tableKeys="tableKeys"
        ref="poolFarmsTable"
        @openMobileFiltersPopup="isFiltersPopupOpened = true"
      />
    </div>
    <FiltersPopup
      v-if="isFiltersPopupOpened"
      :sortersData="tableKeys"
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
import { getPoolConfigsByChains } from "@/helpers/pools/getPoolConfigs";

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
          tableKey: "Staked TVL",
          tooltip: "Staked Total Value Locked.",
          isSortingCriterion: true,
        },
        {
          tableKey: "TBD",
          tooltip: "To be distributed.",
          isSortingCriterion: true,
        },
        {
          tableKey: "Rewards",
          tooltip: "Rewards.",
        },
        {
          tableKey: "APR",
          tooltip: "APR.",
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
      localPoolsList: "getPoolFarmsList",
    }),

    poolFarmsConfigs() {
      return this.poolConfigs.filter(({ stakeContract }) => stakeContract);
    },
  },

  methods: {
    ...mapMutations({
      setPoolFarmsList: "setPoolFarmsList",
    }),

    checkLocalData(): void {
      if (this.localPoolsList.isCreated) {
        this.pools = this.localPoolsList.data;
        this.poolsLoading = false;
      }
    },

    async createPoolsInfo(): Promise<void> {
      this.pools = await getPoolsList(this.account, this.poolFarmsConfigs);
      this.poolsLoading = false;

      this.setPoolFarmsList(this.pools);
    },

    updateSortKeys(key: any, order: any) {
      (this.$refs.poolFarmsTable as any).updateSortKeys(key, order);
    },
  },

  async created() {
    this.checkLocalData();
    this.poolConfigs = await getPoolConfigsByChains();
    await this.createPoolsInfo();

    this.updateInterval = setInterval(async () => {
      this.pools = await getPoolsList(this.account, this.poolFarmsConfigs);
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },

  components: {
    PoolsInfo: defineAsyncComponent(
      () => import("@/components/pools/PoolsInfo.vue")
    ),
    PoolFarmsTable: defineAsyncComponent(
      () => import("@/components/pools/table/poolFarms/PoolFarmsTable.vue")
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
