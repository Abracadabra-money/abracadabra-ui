<template>
  <div class="pools-table-wrap">
    <div class="additional-logic">
      <div class="toggles-wrap">
        <Toggle
          text="My stakes"
          :selected="showMyStakes"
          @updateToggle="updateToggleMyStakes"
        />
      </div>

      <div class="dropdowns-wrap">
        <ChainsDropdown
          :activeChains="activeChains"
          :selectedChains="selectedChains"
          @updateSelectedChain="updateSelectedChain"
          @selectAllChains="selectAllChains"
        />
      </div>

      <button class="filters" @click="$emit('openMobileFiltersPopup')">
        <img class="filters-icon" src="@/assets/images/filters.png" />
      </button>

      <InputSearch class="search" @changeSearch="updateSearch" />
    </div>

    <div class="table-wrapper">
      <PoolsTableHead :tableKeys="tableKeys" @updateSort="updateSortKeys" />

      <div class="pools-items-wrap">
        <div class="row-wrapper">
          <PoolsTableItem
            v-for="(pool, index) in poolsToRender"
            :key="index"
            :pool="pool"
          />
        </div>

        <div class="card-wrapper">
          <PoolCardItem
            v-for="(pool, index) in poolsToRender"
            :key="index"
            :pool="pool"
          />
        </div>

        <div class="loader-wrap">
          <BaseLoader v-if="poolsLoading" medium text="Loading farms" />
          <BaseSearchEmpty
            v-if="showEmptyBlock && !poolsLoading"
            text="There are no farms"
          />
        </div>

        <div class="btn-wrap" v-if="showDeprecatedButton">
          <button class="deprecated-btn" @click="updateToggleActivepools">
            {{ deprecatedButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import type { SortOrder } from "@/types/sorting";

export default {
  props: {
    pools: {
      type: Array as PropType<(MagicLPInfo & { stakeInfo: any })[]>,
      required: true,
    },
    poolsLoading: { type: Boolean },
    tableKeys: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      searchValue: "",
      showActivePools: true,
      showMyStakes: false,
      sortKey: "TVL",
      sortOrder: "up" as SortOrder,
      selectedChains: [] as number[],
      isFiltersPopupOpened: false,
    };
  },

  computed: {
    allChainsSelected() {
      return this.selectedChains.length === this.activeChains.length;
    },

    showEmptyBlock() {
      return !this.poolsLoading && !this.poolsToRender.length;
    },

    poolsToRender() {
      const filteredByChain = this.filterByChain(
        this.pools,
        this.selectedChains
      );

      const filteredByDepreciate = this.filterByActivepools(filteredByChain);

      const filteredByPositions = this.filterPositions(filteredByDepreciate);

      const filteredByValue = this.filterBySearchValue(
        filteredByPositions,
        this.searchValue
      );

      const sortedByChain = this.sortByKey(
        filteredByValue,
        this.sortKey,
        this.sortOrder
      );

      return sortedByChain;
    },

    activeChains() {
      return this.getActiveChain();
    },

    showDeprecatedButton() {
      const hasDeprecatedPool = this.pools.some(
        (pool: MagicLPInfo) => pool.settings.isDeprecated
      );
      return this.poolsToRender.length && hasDeprecatedPool;
    },

    deprecatedButtonText() {
      if (this.showActivePools) return "Show Deprecated pools";
      return "Hide Deprecated pools";
    },
  },

  watch: {
    pools() {
      this.selectedChains = this.getActiveChain();
    },
  },

  methods: {
    updateToggleActivepools() {
      this.showActivePools = !this.showActivePools;
    },

    updateToggleMyStakes() {
      this.showMyStakes = !this.showMyStakes;
    },

    updateSortKeys(key: string, order: SortOrder) {
      this.sortKey = key;
      this.sortOrder = order;
    },

    updateSearch(value: string) {
      this.searchValue = value.toLowerCase();
    },

    selectAllChains() {
      if (this.allChainsSelected) this.selectedChains = [];
      else this.selectedChains = [...this.activeChains];
    },

    updateSelectedChain(chainId: number) {
      if (this.allChainsSelected) this.selectAllChains();

      const index = this.selectedChains.indexOf(chainId);
      if (index === -1) this.selectedChains.push(chainId);
      else this.selectedChains.splice(index, 1);
    },

    filterByChain(pools: MagicLPInfo[], selectedChains: number[]) {
      if (this.allChainsSelected) return pools;
      return pools.filter((pool) => {
        return selectedChains.includes(pool.chainId);
      });
    },

    filterByActivepools(pools: MagicLPInfo[]) {
      if (this.showActivePools) {
        return pools.filter((pool) => {
          return !pool.settings.isDeprecated;
        });
      }

      return pools.sort((a, b) => {
        const settingsA = a?.settings;
        const settingsB = b?.settings;
        if (settingsA || settingsB) {
          return +settingsA?.isDeprecated - +settingsB?.isDeprecated;
        }

        return 1;
      });
    },

    filterPositions(pools: MagicLPInfo[]) {
      if (this.showMyStakes)
        return pools.filter(({ stakeInfo }) => (stakeInfo?.balance || 0n) > 0n);
      return pools;
    },

    filterBySearchValue(pools: MagicLPInfo[], value: string) {
      return pools.filter(
        (config) => config.name.toLowerCase().indexOf(value) !== -1
      );
    },

    sortByNew(pools: MagicLPInfo[]) {
      return pools.sort((a, b) => {
        const isNewA = +!!a?.config?.settings?.isNew;
        const isNewB = +!!b?.config?.settings?.isNew;
        if (isNewA || isNewB) return isNewB - isNewA;
        return 1;
      });
    },

    sortByKey(pools: MagicLPInfo[], key: string, sortOrder: SortOrder) {
      if (!key || !sortOrder) return pools;
      return pools.sort((poolA, poolB) => {
        const a = this.getSortKey(poolA, key);
        const b = this.getSortKey(poolB, key);

        const factor = sortOrder === "down" ? -1 : 1;
        return a < b ? factor : -factor;
      });
    },

    getSortKey(pool: MagicLPInfo, key: string) {
      switch (key) {
        case "TBD":
          return pool.initialParameters.lpFeeRate;
        case "APR":
          return pool.poolAPR?.totalApr || 0;
        default:
          return pool.stakedTotalSupply;
      }
    },

    getActiveChain() {
      return this.pools
        .reduce((acc: number[], pool: MagicLPInfo) => {
          if (!acc.includes(pool.chainId)) acc.push(pool.chainId);
          return acc;
        }, [] as number[])
        .sort((a: number, b: number) => {
          return a >= ARBITRUM_CHAIN_ID || b <= ARBITRUM_CHAIN_ID ? -1 : 1;
        });
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    ChainsDropdown: defineAsyncComponent(
      () => import("@/components/ui/dropdown/ChainsDropdown.vue")
    ),
    InputSearch: defineAsyncComponent(
      () => import("@/components/ui/inputs/InputSearch.vue")
    ),
    PoolsTableHead: defineAsyncComponent(
      () => import("@/components/pools/table/poolFarms/PoolFarmsTableHead.vue")
    ),
    PoolsTableItem: defineAsyncComponent(
      () => import("@/components/pools/table/poolFarms/PoolFarmsTableItem.vue")
    ),
    PoolCardItem: defineAsyncComponent(
      () => import("@/components/pools/table/poolFarms/PoolFarmCardItem.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
    BaseSearchEmpty: defineAsyncComponent(
      () => import("@/components/base/BaseSearchEmpty.vue")
    ),
  },

  created() {
    this.selectedChains = this.getActiveChain();
  },

  expose: [
    "updateSortKeys",
    "getFeeTierOptions",
    "updatePoolTypeFilter",
    "updateFeeTierFilter",
  ],
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.pools-table-wrap {
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  padding: 24px;
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.row-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.card-wrapper {
  display: none;
}

.additional-logic {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  position: relative;
}

.dropdowns-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: auto;
}

.toggles-wrap,
.filters-wrap {
  display: flex;
  gap: 20px;
  align-items: center;
}

.pools-items-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-height: 300px;
  padding: 6px;
}

.chains-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 100%;
}

.filters {
  display: none;
  height: 34px;
  width: 48px;
  padding: 7px 14px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  font-family: Prompt;
  font-size: 16px;
  font-weight: 400;
  transition: opacity 0.3s ease;
}

.filters:hover {
  cursor: pointer;
  opacity: 0.7;
}

.table-wrapper {
  overflow: auto;
}

.loader-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.deprecated-btn {
  color: #7088cc;
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  max-width: 260px;
  width: 100%;
  padding: 9px;
  border-radius: 10px;
  border: 2px solid var(--Primary-Solid, #7088cc);
  background: rgba(255, 255, 255, 0.01);
  cursor: pointer;
}

@media screen and (max-width: 1024px) {
  .filters-wrap {
    width: 100%;
    justify-content: space-between;
  }
}

@media screen and (max-width: 600px) {
  .pools-items-wrap {
    height: 500px;
    overflow: auto;
  }

  .card-wrapper {
    display: block;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .row-wrapper {
    display: none;
  }

  .additional-logic {
    justify-content: space-between;
    gap: 12px;
  }

  .toggles-wrap {
    order: 3;
    width: 100%;
  }

  .dropdowns-wrap {
    order: 2;
    margin-left: 0;
  }

  .pool-type-dropdown,
  .fee-tier-dropdown {
    display: none;
  }

  .pools-table-wrap {
    padding: 16px;
  }

  .filters {
    order: 1;
    display: flex;
  }

  .search {
    order: 4;
  }
}
</style>
