<template>
  <div class="pools-table-wrap">
    <div class="additional-logic">
      <div class="toggles-wrap">
        <Tabs :name="activeTab" :items="tabItems" @select="changeTab" />
      </div>

      <ChainsDropdown
        class="chains-dropdown"
        :activeChains="activeChains"
        :selectedChains="selectedChains"
        @updateSelectedChain="updateSelectedChain"
      />

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
          <BaseLoader v-if="poolsLoading" medium text="Loading pools" />
          <BaseSearchEmpty
            v-if="showEmptyBlock && !poolsLoading"
            text="There are no pools"
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

<script>
import { defineAsyncComponent } from "vue";
import { ARBITRUM_CHAIN_ID } from "@/constants/global.ts";

export default {
  props: {
    pools: {
      type: Array,
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
      activeTab: "All pools",
      tabItems: ["All pools", "My pools", "MIM pools"],
      searchValue: "",
      showActivePools: true,
      sortKey: "",
      sortOrder: false,
      selectedChains: [],
      isFiltersPopupOpened: false,
    };
  },

  computed: {
    isSelectAllChains() {
      return this.selectedChains.length === this.activeChains.length;
    },

    showEmptyBlock() {
      return (
        !this.poolsLoading &&
        !this.poolsToRender.length &&
        this.searchValue.length
      );
    },

    poolsToRender() {
      const filteredByChain = this.filterByChain(
        this.pools,
        this.selectedChains
      );
      const filteredByDepreciate = this.filterByActivepools(filteredByChain);

      const filteredByTab = this.filterByTab(filteredByDepreciate);

      const sortedByNew = this.sortByNew(filteredByTab);

      // TODO
      const sortedByTesting = this.sortByTesting(filteredByTab);

      const filteredByValue = this.filterBySearchValue(
        sortedByTesting,
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
      return this.poolsToRender.length;
    },

    deprecatedButtonText() {
      if (this.showActivePools) return " Show deprecated pools";
      return "Hide deprecated pools";
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

    updateSortKeys(key, order) {
      this.sortKey = key;
      this.sortOrder = order;
    },

    updateSearch(value) {
      this.searchValue = value.toLowerCase();
    },

    updateSelectedChain(chainId) {
      if (!chainId) {
        if (this.isSelectAllChains) this.selectedChains = [];
        else this.selectedChains = [...this.activeChains];
      } else {
        const index = this.selectedChains.indexOf(chainId);
        if (index === -1) this.selectedChains.push(chainId);
        else this.selectedChains.splice(index, 1);
      }
    },

    filterByChain(pools, selectedChains) {
      if (this.isSelectAllChains) return pools;
      return pools.filter((pool) => {
        return selectedChains.includes(pool.chainId);
      });
    },

    filterByActivepools(pools) {
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

        return a;
      });
    },

    filterByTab(pools) {
      if (this.activeTab == "My pools") return this.filterPositions(pools);
      if (this.activeTab == "MIM pools") return this.filterIsMim(pools);
      return pools;
    },

    filterIsMim(pools) {
      return pools.filter((config) => config.settings.isMim);
    },

    filterPositions(pools) {
      return pools.filter(({ userInfo }) => {
        return userInfo.balance > 0n;
      });
    },

    filterBySearchValue(pools, value) {
      return pools.filter(
        (config) => config.name.toLowerCase().indexOf(value) !== -1
      );
    },

    sortByNew(pools) {
      return pools.sort((a, b) => {
        const isNewA = +!!a?.config?.settings?.isNew;
        const isNewB = +!!b?.config?.settings?.isNew;
        if (isNewA || isNewB) return isNewB - isNewA;
        return a;
      });
    },

    sortByTesting(pools) {
      return pools.sort((a, b) => {
        const isNewA = +!!a?.settings?.isNew;
        const isTestingA = +!!a?.settings?.isTesting;

        const isNewB = +!!b?.settings?.isNew;
        const isTestingB = +!!b?.settings?.isTesting;

        if (isTestingB && isNewA) {
          return -1;
        }

        return 0;
      });
    },

    sortByKey(pools, key, sortOrder) {
      if (!key || !sortOrder) return pools;
      return pools.sort((poolA, poolB) => {
        const a = this.getSortKey(poolA, key);
        const b = this.getSortKey(poolB, key);

        const factor = sortOrder === "down" ? -1 : 1;
        return a < b ? factor : -factor;
      });
    },

    getSortKey(pool, key) {
      if (key === "TVL") return pool.mainParams.tvl;
      if (key === "Fees 1d") return pool.mainParams.dayFees;
      if (key === "Volume 1d") return pool.mainParams.dayVolume;
      if (key === "Fees 7d") return pool.mainParams.weekFees;
      if (key === "Volume 7d") return pool.mainParams.weekFees;
      if (key === "APR") return pool.mainParams.apr;
    },

    getActiveChain() {
      return this.pools
        .reduce((acc, config) => {
          if (!acc.includes(config.chainId)) acc.push(config.chainId);
          return acc;
        }, [])
        .sort((a, b) => {
          return a >= ARBITRUM_CHAIN_ID || b <= ARBITRUM_CHAIN_ID ? -1 : 1;
        });
    },

    changeTab(action) {
      this.activeTab = action;
    },
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    ChainsDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/ChainsDropdown.vue")
    ),
    InputSearch: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputSearch.vue")
    ),
    PoolsTableHead: defineAsyncComponent(() =>
      import("@/components/pools/table/PoolsTableHead.vue")
    ),
    PoolsTableItem: defineAsyncComponent(() =>
      import("@/components/pools/table/PoolsTableItem.vue")
    ),
    PoolCardItem: defineAsyncComponent(() =>
      import("@/components/pools/table/PoolCardItem.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    BaseSearchEmpty: defineAsyncComponent(() =>
      import("@/components/base/BaseSearchEmpty.vue")
    ),
  },

  created() {
    this.selectedChains = this.getActiveChain();
  },

  expose: ["updateSortKeys"],
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

.chains-dropdown {
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

  .chains-dropdown {
    order: 2;
    margin-left: 0;
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
