<template>
  <div class="cauldrons-table-wrap">
    <div class="additional-logic">
      <div class="toggles-wrap">
        <Toggle
          text="My positions"
          :selected="showMyPositions"
          @updateToggle="updateToggleMyPositions"
        />
        <Toggle
          text="Active Cauldrons"
          :selected="showActiveCauldrons"
          @updateToggle="updateToggleActiveCauldrons"
        />
        <Toggle
          text="Leverage"
          :selected="isSwappersActive"
          @updateToggle="updateToggleASwappersActive"
        />
      </div>
      <div class="filters-wrap">
        <ChainsDropdown
          :selectedChains="selectedChains"
          @updateSelectedChain="updateSelectedChain"
        />
        <InputSearch @changeSearch="updateSearch" />
      </div>
    </div>

    <div>
      <CauldronsTableHead @updateSort="updateSortKeys" />

      <div class="cauldrons-items-wrap">
        <CauldronsTableItem
          v-for="(cauldron, index) in cauldronsToRender"
          :key="index"
          :cauldron="cauldron"
        />

        <EmptyBlock
          v-if="showEmptyBlock"
          :cauldronsLoading="cauldronsLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

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
      isSwappersActive: true,
      sortKey: "",
      sortOrder: "",
      selectedChains: [0],
    };
  },

  computed: {
    showEmptyBlock() {
      return this.cauldronsLoading || !this.cauldronsToRender.length;
    },

    cauldronsToRender() {
      const filteredByChain = this.filterByChain(
        this.cauldrons,
        this.selectedChains
      );
      const filteredByDepreciate =
        this.filterByActiveCauldrons(filteredByChain);
      const filteredByPositions = this.filterPositions(filteredByDepreciate);

      const filteredBySwappersActive =
        this.filterSwappersActive(filteredByPositions);

      const sortedByNew = this.sortByNew(filteredBySwappersActive);
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
  },

  methods: {
    updateToggleMyPositions() {
      this.showMyPositions = !this.showMyPositions;
    },

    updateToggleActiveCauldrons() {
      this.showActiveCauldrons = !this.showActiveCauldrons;
    },

    updateToggleASwappersActive() {
      this.isSwappersActive = !this.isSwappersActive;
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
        const value = this.selectedChains.includes(0) ? [] : [0];
        return (this.selectedChains = value);
      }

      if (this.selectedChains.includes(0)) this.selectedChains = [];

      const index = this.selectedChains.indexOf(chainId);
      if (index === -1) this.selectedChains.push(chainId);
      else this.selectedChains.splice(index, 1);
    },

    filterByChain(cauldrons, selectedChains) {
      if (selectedChains.includes(0)) return cauldrons;
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

      return cauldrons.filter(({ userPosition }) => {
        return (
          userPosition.collateralInfo.userCollateralShare.eq(0) &&
          userPosition.borrowInfo.userBorrowPart.eq(0)
        );
      });
    },

    filterSwappersActive(cauldrons) {
      if (this.isSwappersActive) {
        return cauldrons.filter(({ config }) => {
          return config.cauldronSettings.isSwappersActive;
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

    sortByKey(cauldrons, key) {
      if (!key) return cauldrons;

      return cauldrons.sort((cauldronA, cauldronB) => {
        const a = this.getSortKey(cauldronA, key);
        const b = this.getSortKey(cauldronB, key);

        const factor = this.sortOrder ? -1 : 1;
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
    EmptyBlock: defineAsyncComponent(() =>
      import("@/components/cauldrons/EmptyBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.cauldrons-table-wrap {
  @include font;
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
}
</style>
