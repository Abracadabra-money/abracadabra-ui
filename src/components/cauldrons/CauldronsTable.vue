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

      <div class="filters-wrap">
        <div class="chains-wrap">
          <h3 class="mobile-title">Cauldrons</h3>
          <ChainsDropdown
            :activeChains="activeChains"
            :selectedChains="selectedChains"
            @updateSelectedChain="updateSelectedChain"
          />
        </div>

        <div class="search-wrapper">
          <InputSearch @changeSearch="updateSearch" />
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <CauldronsTableHead @updateSort="updateSortKeys" />

      <div class="cauldrons-items-wrap">
        <CauldronsTableItem
          v-for="(cauldron, index) in cauldronsToRender"
          :key="index"
          :cauldron="cauldron"
        />

        <div class="loader-wrap">
          <BaseLoader
            v-if="cauldronsLoading"
            medium
            text="Loading cauldrons."
          />
          <BaseSearchEmpty
            v-if="showEmptyBlock"
            text="There are no cauldrons"
          />
        </div>
      </div>
      <div class="btn-wrap" v-if="showDeprecatedButton">
        <button class="deprecated-btn" @click="updateToggleActiveCauldrons">
          {{ deprecatedButtonText }}
        </button>
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
  },

  data() {
    return {
      searchValue: "",
      showMyPositions: false,
      showActiveCauldrons: true,
      sortKey: "",
      sortOrder: false,
      selectedChains: [],
    };
  },

  computed: {
    isSelectAllChains() {
      return this.selectedChains.length === this.activeChains.length;
    },

    showEmptyBlock() {
      return (
        !this.cauldronsLoading &&
        this.searchValue.length &&
        !this.cauldronsToRender.length
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
      const filteredByValue = this.filterBySearchValue(
        sortedByNew,
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
};
</script>

<style lang="scss" scoped>
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
  gap: 32px;
  flex-direction: column;
}

.additional-logic {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
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
}

.chains-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-title {
  display: none;
}

.loader-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-wrap {
  padding: 12px 0 0;
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
  .additional-logic {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 12px;
  }

  .filters-wrap {
    width: 100%;
    justify-content: space-between;
  }

  .table-wrapper {
    overflow-x: scroll;
  }
}

@media screen and (max-width: 600px) {
  .additional-logic {
    justify-content: flex-end;
    height: 90px;
  }

  .mobile-title {
    display: block;
  }

  .search-wrapper {
    width: 100%;
    position: absolute;
    top: 80px;
  }

  .cauldrons-table-wrap {
    padding: 16px;
  }
}
</style>
