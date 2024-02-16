<template>
  <div class="cauldrons-table-wrap">
    <div class="additional-logic">
      <div class="toggles-wrap">
        <Toggle
          text="My positions"
          :selected="showMyPositions"
          @updateToggle="updateToggleMyPositions"
        />
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
      <CauldronsTableHead :tableKeys="tableKeys" @updateSort="updateSortKeys" />

      <div class="cauldrons-items-wrap">
        <div class="row-wrapper">
          <CauldronsTableItem
            v-for="(cauldron, index) in cauldronsToRender"
            :key="index"
            :cauldron="cauldron"
          />
        </div>
        <div class="card-wrapper">
          <CauldronCardItem
            v-for="(cauldron, index) in cauldronsToRender"
            :key="index"
            :cauldron="cauldron"
          />
        </div>

        <div class="loader-wrap">
          <BaseLoader
            v-if="cauldronsLoading"
            medium
            text="Loading cauldrons."
          />
          <BaseSearchEmpty
            v-if="showEmptyBlock && !cauldronsLoading"
            text="There are no cauldrons"
          />
        </div>
        <div class="btn-wrap" v-if="showDeprecatedButton">
          <button class="deprecated-btn" @click="updateToggleActiveCauldrons">
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
    cauldrons: {
      type: Array,
      required: true,
    },
    cauldronsLoading: { type: Boolean },
    tableKeys: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      searchValue: "",
      showMyPositions: false,
      showActiveCauldrons: true,
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
        !this.cauldronsLoading &&
        !this.cauldronsToRender.length &&
        this.searchValue.length
      );
    },

    cauldronsToRender() {
      const filteredByChain = this.filterByChain(
        this.cauldrons,
        this.selectedChains
      );
      const filteredByDepreciate = this.showMyPositions
        ? filteredByChain
        : this.filterByActiveCauldrons(filteredByChain);

      const filteredByPositions = this.filterPositions(filteredByDepreciate);

      const sortedByNew = this.sortByNew(filteredByPositions);

      // TODO
      const sortedByTesting = this.sortByTesting(filteredByPositions);

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
      return this.cauldronsToRender.length && !this.showMyPositions;
    },

    deprecatedButtonText() {
      if (this.showActiveCauldrons) return " Show Deprecated Cauldrons";
      return "Hide Deprecated Cauldrons";
    },
  },

  watch: {
    cauldrons() {
      this.selectedChains = this.getActiveChain();
    },
  },

  methods: {
    updateToggleMyPositions() {
      this.showMyPositions = !this.showMyPositions;
    },

    updateToggleActiveCauldrons() {
      this.showActiveCauldrons = !this.showActiveCauldrons;
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

    filterByChain(cauldrons, selectedChains) {
      if (this.isSelectAllChains) return cauldrons;
      return cauldrons.filter((cauldron) => {
        return selectedChains.includes(cauldron.config?.chainId);
      });
    },

    filterByActiveCauldrons(cauldrons) {
      if (this.showActiveCauldrons) {
        return cauldrons.filter((cauldron) => {
          return !cauldron.config?.cauldronSettings?.isDepreciated;
        });
      }

      return cauldrons.sort((a, b) => {
        const settingsA = a?.config?.cauldronSettings;
        const settingsB = b?.config?.cauldronSettings;
        if (settingsA || settingsB) {
          return +settingsA?.isDepreciated - +settingsB?.isDepreciated;
        }

        return a;
      });
    },

    filterPositions(cauldrons) {
      if (this.showMyPositions) {
        return cauldrons.filter(({ userPosition }) => {
          return (
            userPosition.collateralInfo.userCollateralShare.gt(0) ||
            userPosition.borrowInfo.userBorrowPart.gt(0)
          );
        });
      }

      return cauldrons;
    },

    filterBySearchValue(cauldrons, value) {
      return cauldrons.filter(
        ({ config }) => config.name.toLowerCase().indexOf(value) !== -1
      );
    },

    sortByNew(cauldrons) {
      return cauldrons.sort((a, b) => {
        const isNewA = +!!a?.config?.cauldronSettings?.isNew;
        const isNewB = +!!b?.config?.cauldronSettings?.isNew;
        if (isNewA || isNewB) return isNewB - isNewA;
        return a;
      });
    },

    sortByTesting(cauldrons) {
      return cauldrons.sort((a, b) => {
        const isNewA = +!!a?.config?.cauldronSettings?.isNew;
        const isTestingA = +!!a?.config?.cauldronSettings?.isTesting;

        const isNewB = +!!b?.config?.cauldronSettings?.isNew;
        const isTestingB = +!!b?.config?.cauldronSettings?.isTesting;

        if (isTestingB && isNewA) {
          return -1;
        }

        return 0;
      });
    },

    sortByKey(cauldrons, key, sortOrder) {
      if (!key || !sortOrder) return cauldrons;

      return cauldrons.sort((cauldronA, cauldronB) => {
        const a = this.getSortKey(cauldronA, key);
        const b = this.getSortKey(cauldronB, key);

        const factor = sortOrder === "down" ? -1 : 1;
        if (key === "Interest" || key === "APR")
          return a < b ? factor : -factor;
        return a.lt(b) ? factor : -factor;
      });
    },

    getSortKey(cauldron, key) {
      if (key === "TVL") return cauldron.mainParams.tvl;
      if (key === "TMB") return cauldron.mainParams.totalBorrowed;
      if (key === "MIMS LB") return cauldron.mainParams.mimLeftToBorrow;
      if (key === "Interest") return cauldron.mainParams.interest;
      if (key === "APR") return +cauldron.apr.value;
    },

    getActiveChain() {
      return this.cauldrons
        .reduce((acc, { config }) => {
          if (!acc.includes(config.chainId)) acc.push(config.chainId);
          return acc;
        }, [])
        .sort((a, b) => {
          return a >= ARBITRUM_CHAIN_ID || b <= ARBITRUM_CHAIN_ID ? -1 : 1;
        });
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    ChainsDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/ChainsDropdown.vue")
    ),
    InputSearch: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputSearch.vue")
    ),
    CauldronsTableHead: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronsTableHead.vue")
    ),
    CauldronsTableItem: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronsTableItem.vue")
    ),
    CauldronCardItem: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronCardItem.vue")
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

.cauldrons-table-wrap {
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

.cauldrons-items-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-height: 300px;
  padding: 6px;
}

.chains-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  .cauldrons-items-wrap {
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

  .cauldrons-table-wrap {
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
