<template>
  <div class="wrapper">
    <h2 class="title">Available Cauldrons</h2>
    <EmptyMarketsList v-if="!borrowPools.length && !borrowLoading" />
    <!-- todo added loader wrap and props class -->
    <div v-else-if="!borrowPools.length && borrowLoading" class="loader-wrap">
      <BaseLoader />
    </div>

    <div v-else class="stats-wrap">
      <div class="tools-wrap">
        <Search @changeSerch="changeSerch" />

        <DropdownSortBy
          :selectedSortData="selectedSortData"
          :sortList="sortList"
          :selectedSort="selectedSort"
          @changeSortBy="select"
          @changeReverse="changeReverse"
        />

        <div class="active-markets">
          active markets only
          <CheckBox @update="toggleActiveMarkets" :value="isActiveMarkets" />
        </div>
      </div>

      <div class="stats-list-wrap">
        <div class="stats-list-header">
          <div v-for="(title, i) in headers" :key="i">{{ title }}</div>
        </div>

        <template v-if="filteredPools.length">
          <CauldronItem
            v-for="pool in filteredPools"
            :key="pool.id"
            :cauldron="pool"
          />
        </template>
        <!-- EmptyState -->
        <EmptyMarketsList v-else />
      </div>
    </div>

    <ScrollToTop v-if="borrowPools.length" />
  </div>
</template>

<script>
import cauldronsListMixin from "@/mixins/cauldron/cauldronsList.js";
const ScrollToTop = () => import("@/components/ui/ScrollToTop");
const Search = () => import("@/components/ui/search/CauldronsSearch");
const DropdownSortBy = () => import("@/components/ui/dropdown/SortBy");

const BaseLoader = () => import("@/components/base/BaseLoader");
const EmptyMarketsList = () => import("@/components/markets/EmptyMarketsList");
const CauldronItem = () => import("@/components/markets/CauldronItem");
const CheckBox = () => import("@/components/ui/CheckBox");

// const sortList = [
//   { title: "Title", name: "name" },
//   { title: "TVL", name: "totalMim" },
//   { title: "MIMs Left", name: "MIMsLeftToBorrow" },
//   { title: "Interest", name: "interest" },
//   { title: "Fee", name: "fee" },
// ];

export default {
  mixins: [cauldronsListMixin],
  data() {
    return {
      selectedSort: "MIMsLeftToBorrow",
      sortReverse: false,
      search: "",
      poolsInterval: null,
      isActiveMarkets: true,

      borrowPools: [],
      borrowLoading: true,
      // sortList,
    };
  },

  computed: {
    selectedSortData() {
      return (
        this.sortList.find(({ name }) => this.selectedSort === name) || null
      );
    },

    sortList() {
      return [
        { title: "Title", name: "name" },
        { title: "TVL", name: "totalMim" },
        { title: "MIMs Left", name: "MIMsLeftToBorrow" },
        { title: "Interest", name: "interest" },
        { title: "Fee", name: "fee" },
      ];
    },

    filteredPools() {
      return this.sortByDepreciate(
        this.sortByValue(this.filterBySearch(this.borrowPools, this.search))
      );
    },

    headers() {
      return [
        "CHAIN",
        "COLLATERAL",
        "TOTAL MIM BORROWED",
        "TVL",
        "MIMS LEFT TO BORROW",
        "INTEREST",
      ];
    },
  },

  methods: {
    select(name) {
      this.selectedSort = name;
    },

    changeReverse(isReverse) {
      this.sortReverse = isReverse;
    },

    filterBySearch(pools, search) {
      return search
        ? pools.filter(
            (pool) =>
              pool.config.name.toLowerCase().indexOf(search.toLowerCase()) !==
              -1
          )
        : pools;
    },

    sortByValue(pools) {
      const sortedPools = [...pools];
      if (this.selectedSortData !== null) {
        const prepValue = (pool, sortData) => {
          if (sortData.name === "name") return pool.config.name;
          if (sortData.name === "fee") return pool.config.liquidationFee;
          return +pool[sortData.name] || null;
        };

        sortedPools.sort((aPool, bPool) => {
          const a = prepValue(aPool, this.selectedSortData);
          const b = prepValue(bPool, this.selectedSortData);

          const factor = this.sortReverse ? -1 : 1;

          if (this.selectedSort === "name") return a < b ? -factor : factor;

          return a < b ? factor : -factor;
        });
      }

      return sortedPools;
    },

    sortByDepreciate(pools = []) {
      if (this.isActiveMarkets) {
        return pools.filter((pool) => {
          if (pool?.config?.cauldronSettings)
            return !pool.config?.cauldronSettings.isDepreciated;
          return !pool.config?.cauldronSettings.isDepreciated;
        });
      } else {
        return pools.sort((a, b) => {
          if (a?.config?.cauldronSettings || b?.config?.cauldronSettings) {
            return (
              +a.config?.cauldronSettings.isDepreciated -
              +b.config?.cauldronSettings.isDepreciated
            );
          }

          return (
            +a.config?.cauldronSettings.isDepreciated -
            +b.config?.cauldronSettings.isDepreciated
          );
        });
      }
    },

    // ----
    changeSerch(inputValue) {
      this.search = inputValue;
    },

    toggleActiveMarkets() {
      this.isActiveMarkets = !this.isActiveMarkets;
    },

    async createPoolsCauldronsList() {
      this.borrowPools = await this.initCauldronsList();
      this.borrowLoading = false;

      this.poolsInterval = setInterval(await this.initCauldronsList(), 60000);
    },
  },

  async created() {
    this.createPoolsCauldronsList();
  },

  beforeDestroy() {
    clearInterval(this.poolsInterval);
  },

  components: {
    ScrollToTop,
    DropdownSortBy,
    Search,

    EmptyMarketsList,
    BaseLoader,
    CauldronItem,
    CheckBox,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding-top: 160px;
  padding-bottom: 100px;
  margin: 0 auto;
  width: 940px;
  max-width: calc(100% - 20px);
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.title {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 40px;
}
.tools-wrap {
  display: grid;
  width: 100%;
  grid-template-columns: 1.5fr 1.5fr 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;
}

.stats-list-wrap {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  grid-column: 1;
  margin-top: 10px;
}

.stats-list-header {
  display: none;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 180px;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-size: 14px;
  border-radius: 30px;
  background-color: #2a2835;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;

  &-farm {
    grid-template-columns: 1fr 1fr 1fr 1fr 60px;
  }
}
.loader-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.active-markets {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px;
  font-size: 16px;
  line-height: 24px;
}

@media (min-width: 768px) {
  // .dropdown {
  //   grid-column: auto / span 5;
  // }
  // .search-wrap {
  //   grid-column: auto / span 3;
  // }
  // .active-markets {
  //   grid-column: auto / span 4;
  // }
  // .tools-wrap {
  //   grid-template-columns: repeat(12, 1fr);
  // }
}

@media (min-width: 1024px) {
  // .dropdown {
  //   grid-column: auto / span 5;
  // }
  // .search-wrap {
  //   grid-column: auto / span 4;
  // }
  // .active-markets {
  //   grid-column: auto / span 3;
  // }
  .stats-list-wrap {
    grid-column: 1 / 5;
    margin-top: 0;
  }
  .stats-list-header {
    display: grid;
  }
}

@media screen and (max-width: 767px) {
  .active-markets {
    justify-content: center;
  }
}
</style>
