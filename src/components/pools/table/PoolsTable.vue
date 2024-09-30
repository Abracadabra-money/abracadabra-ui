<template>
  <div class="pools-table-wrap">
    <div class="additional-logic">
      <div class="toggles-wrap">
        <Toggle
          text="My pools"
          :selected="showMyPools"
          @updateToggle="updateToggleMyPools"
        />

        <Toggle
          text="Rewards available"
          :selected="showAvailableRewardsPools"
          @updateToggle="updateAvailableRewardsPools"
        />
      </div>

      <div class="dropdowns-wrap">
        <TableDropdown
          title="Pool type"
          :options="poolTypesOptions"
          :selectedOptions="selectedPoolTypes"
          @updateSelectedOption="
            (poolType) => updateSelectedOptions(selectedPoolTypes, poolType)
          "
          @selectAllOptions="
            selectAllOptions(poolTypesOptions, selectedPoolTypes)
          "
        />

        <TableDropdown
          title="Fee tier"
          :options="feeTierOptions"
          :selectedOptions="selectedFeeTiers"
          @updateSelectedOption="
            (feeTier) => updateSelectedOptions(selectedFeeTiers, feeTier)
          "
          @selectAllOptions="selectAllOptions(feeTierOptions, selectedFeeTiers)"
        />

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

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import {
  FEE_TIER_DECIMALS,
  PoolTypes,
  poolTypesArray,
  STANDARD_K_VALUE,
} from "@/constants/pools/poolCreation";
import { formatPercent } from "@/helpers/filters";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { formatUnits } from "viem";
import type { SortOrder } from "@/types/sorting";

export default {
  props: {
    pools: {
      type: Array as PropType<MagicLPInfo[]>,
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
      showMyPools: false,
      showAvailableRewardsPools: false,
      sortKey: "",
      sortOrder: "up" as SortOrder,
      selectedChains: [] as number[],
      poolTypesOptions: [...poolTypesArray],
      selectedPoolTypes: [...poolTypesArray],
      selectedFeeTiers: [] as string[],
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

      const filteredByAvailableRewards =
        this.filterByAvailableRewards(filteredByPositions);

      const filteredByValue = this.filterBySearchValue(
        filteredByAvailableRewards,
        this.searchValue
      );

      const filteredByPoolType = this.filterByPoolType(filteredByValue);

      const filteredByFeeTier = this.filterByFeeTier(filteredByPoolType);

      const sortedByChain = this.sortByKey(
        filteredByFeeTier,
        this.sortKey,
        this.sortOrder
      );

      return sortedByChain;
    },

    activeChains() {
      return this.getActiveChain();
    },

    feeTierOptions() {
      return this.getFeeTierOptions();
    },

    showDeprecatedButton() {
      const hasDeprecatedPool = this.poolsToRender.some(
        (pool: MagicLPInfo) => pool.settings.isDeprecated
      );
      return this.poolsToRender.length && hasDeprecatedPool;
    },

    deprecatedButtonText() {
      if (this.showActivePools) return " Show Deprecated pools";
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

    updateToggleMyPools() {
      this.showMyPools = !this.showMyPools;
    },

    updateAvailableRewardsPools() {
      this.showAvailableRewardsPools = !this.showAvailableRewardsPools;
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

    selectAllOptions(allOptions: string[], selectedOptions: string[]) {
      if (allOptions.length === selectedOptions.length)
        selectedOptions.splice(0);
      else {
        selectedOptions.splice(0);
        selectedOptions.push(...allOptions);
      }
    },

    updateSelectedOptions(selectedOptions: string[], newOption: string) {
      const index = selectedOptions.indexOf(newOption);
      if (index === -1) selectedOptions.push(newOption);
      else selectedOptions.splice(index, 1);
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
      if (this.showMyPools)
        return pools.filter(({ userInfo }) => userInfo.balance > 0n);
      return pools;
    },

    filterByAvailableRewards(pools: MagicLPInfo[]) {
      if (this.showAvailableRewardsPools)
        return pools.filter(
          ({ rewardTokens }) => (rewardTokens || []).length > 0
        );
      return pools;
    },

    filterBySearchValue(pools: MagicLPInfo[], value: string) {
      return pools.filter(
        (config) => config.name.toLowerCase().indexOf(value) !== -1
      );
    },

    filterByPoolType(pools: MagicLPInfo[]) {
      if (this.selectedPoolTypes.length === 2) return pools;

      switch (this.selectedPoolTypes[0]) {
        case PoolTypes.Standard:
          return pools.filter(
            ({ initialParameters }) => initialParameters.K === STANDARD_K_VALUE
          );
        case PoolTypes.Pegged:
          return pools.filter(
            ({ initialParameters }) => initialParameters.K !== STANDARD_K_VALUE
          );
        default:
          return [];
      }
    },

    filterByFeeTier(pools: MagicLPInfo[]) {
      return pools.filter(({ initialParameters }) =>
        this.selectedFeeTiers.some(
          (feeTier: string) =>
            feeTier ===
            formatPercent(
              formatUnits(initialParameters.lpFeeRate, FEE_TIER_DECIMALS)
            )
        )
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
        case "Fee Tier":
          return pool.initialParameters.lpFeeRate;
        case "Staking APR":
          return pool.poolAPR?.totalApr || 0;
        default:
          return pool.totalSupply;
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

    getFeeTierOptions() {
      const feeTierOptions =
        this.pools
          .reduce((acc, { initialParameters }) => {
            if (!acc.includes(initialParameters.lpFeeRate))
              acc.push(initialParameters.lpFeeRate);
            return acc;
          }, [] as bigint[])
          .sort()
          .map((feeTier: bigint) =>
            formatPercent(formatUnits(feeTier, FEE_TIER_DECIMALS))
          ) || ([] as string[]);

      this.selectedFeeTiers = [...feeTierOptions];

      return [...feeTierOptions];
    },

    updatePoolTypeFilter(options: string[]) {
      const updatedSelectedOptions = options.length
        ? [...options]
        : [...this.poolTypesOptions];
      this.selectedPoolTypes = updatedSelectedOptions as PoolTypes[];
    },

    updateFeeTierFilter(options: string[]) {
      const updatedSelectedOptions = options.length
        ? [...options]
        : [...this.feeTierOptions];
      this.selectedFeeTiers = updatedSelectedOptions;
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    TableDropdown: defineAsyncComponent(
      () => import("@/components/ui/dropdown/TableDropdown.vue")
    ),
    ChainsDropdown: defineAsyncComponent(
      () => import("@/components/ui/dropdown/ChainsDropdown.vue")
    ),
    InputSearch: defineAsyncComponent(
      () => import("@/components/ui/inputs/InputSearch.vue")
    ),
    PoolsTableHead: defineAsyncComponent(
      () => import("@/components/pools/table/PoolsTableHead.vue")
    ),
    PoolsTableItem: defineAsyncComponent(
      () => import("@/components/pools/table/PoolsTableItem.vue")
    ),
    PoolCardItem: defineAsyncComponent(
      () => import("@/components/pools/table/PoolCardItem.vue")
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
