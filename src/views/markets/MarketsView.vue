<template>
  <EmptyMarketsList v-if="!currentPools.length && !loading" />
  <div v-else-if="!currentPools.length && loading" class="loader-wrap">
    <BaseLoader />
  </div>
  <div v-else class="stats-wrap">
    <div class="tools-wrap">
      <div class="search-wrap">
        <img
          class="search-icon"
          src="@/assets/images/search.svg"
          alt="search"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Search"
          class="search-input"
        />
      </div>

      <DropdownWrap class="dropdown">
        <template slot="btn">
          <button class="sort-btn open-btn">
            <span class="sort-title-wrap">
              <button
                @click.stop="sortReverse = !sortReverse"
                @mousedown.prevent.stop=""
                class="sort-icon-wrap"
              >
                <img
                  class="sort-icon"
                  :class="{ 'sort-icon-reverse': sortReverse }"
                  src="@/assets/images/filter.svg"
                  alt="filter"
                />
              </button>
              <span>{{ `Sorted by ${selectedSortData.title}` }}</span>
            </span>
            <img
              class="arrow-icon"
              src="@/assets/images/arrow-down.svg"
              alt="filter"
            />
          </button>
        </template>
        <template slot="list">
          <button
            class="sort-btn sort-item"
            v-for="(titleData, i) in sortList.filter(
              ({ name }) => name !== selectedSort
            )"
            :key="i"
            @click="select(titleData.name)"
          >
            {{ titleData.title }}
          </button>
        </template>
      </DropdownWrap>
    </div>
    <div class="stats-list-wrap">
      <div
        class="stats-list-header"
        :class="{ 'stats-list-header-farm': isFarm }"
      >
        <div v-for="(title, i) in headers" :key="i">{{ title }}</div>
      </div>

      <template v-if="prepPools.length">
        <template v-if="isFarm">
          <MarketsFarmItem
            v-for="pool in prepPools"
            :key="pool.id"
            :pool="pool"
        /></template>
        <template v-else>
          <MarketsBorrowItem
            v-for="pool in prepPools"
            :key="pool.id"
            :pool="pool"
        /></template>
      </template>
      <EmptyMarketsList v-else />
    </div>
  </div>
</template>

<script>
import farmPoolsMixin from "@/mixins/farmPools";
import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import { mapGetters } from "vuex";

const BaseLoader = () => import("@/components/base/BaseLoader");
const EmptyMarketsList = () => import("@/components/markets/EmptyMarketsList");

const DropdownWrap = () => import("@/components/ui/DropdownWrap");
const MarketsBorrowItem = () =>
  import("@/components/markets/MarketsBorrowItem");
const MarketsFarmItem = () => import("@/components/markets/MarketsFarmItem");

const sortKeys = {
  name: "name",
  yield: "yield",
  roi: "roi",
  tvl: "tvl",
  totalMim: "totalMim",
  mimsLeft: "mimsLeft",
  interest: "interest",
  liquidation: "liquidation",
};

export default {
  name: "StatsView",
  components: {
    EmptyMarketsList,
    BaseLoader,
    DropdownWrap,
    MarketsBorrowItem,
    MarketsFarmItem,
  },
  mixins: [farmPoolsMixin, borrowPoolsMixin],
  props: { isFarm: { type: Boolean, default: false } },
  data: () => ({
    selectedSort: sortKeys.name,
    sortReverse: false,
    search: "",
    poolsInterval: null,
  }),
  methods: {
    select(name) {
      this.selectedSort = name;
    },
    filterBySearch(pools, search) {
      return search
        ? pools.filter(
            (pool) =>
              pool.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          )
        : pools;
    },
    sortByTitle(pools) {
      const sortedPools = [...pools];
      if (this.selectedSortData !== null) {
        const prepValue = (pool, sortData) => {
          switch (sortData.name) {
            case sortKeys.name:
              return pool.name;

            case sortKeys.yield:
              return +pool.poolYield;

            case sortKeys.roi:
              return +pool.poolRoi;

            case sortKeys.tvl:
              return +pool.poolTvl;

            case sortKeys.totalMim:
              return +pool.totalBorrow;

            case sortKeys.mimsLeft:
              return +pool.dynamicBorrowAmount;

            case sortKeys.interest:
              return +pool.interest;

            case sortKeys.liquidation:
              return +pool.stabilityFee;
          }

          return null;
        };
        sortedPools.sort((aPool, bPool) => {
          const a = prepValue(aPool, this.selectedSortData);
          const b = prepValue(bPool, this.selectedSortData);

          const factor = this.sortReverse ? 1 : -1;

          return a < b ? factor : -factor;
        });
      }

      return sortedPools;
    },
    sortByDepreciate(pools = []) {
      return pools.sort(
        ({ isDepreciated: a }, { isDepreciated: b }) => +a - +b
      );
    },
  },
  computed: {
    ...mapGetters({
      borrowPools: "getPools",
      borrowLoading: "getLoadPoolsBorrow",
      farmLoading: "getFarmPoolLoading",
    }),
    selectedSortData() {
      return (
        this.sortList.find(({ name }) => this.selectedSort === name) || null
      );
    },
    sortList() {
      return this.isFarm
        ? [
            { title: "Title", name: sortKeys.name },
            { title: "Yield Per $1000", name: sortKeys.yield },
            { title: "ROI Annually", name: sortKeys.roi },
            { title: "TVL", name: sortKeys.tvl },
          ]
        : [
            { title: "Title", name: sortKeys.name },
            { title: "TVL", name: sortKeys.totalMim },
            { title: "MIMs Left", name: sortKeys.mimsLeft },
            { title: "Interest", name: sortKeys.interest },
            { title: "Fee", name: sortKeys.liquidation },
          ];
    },
    currentPools() {
      return (this.isFarm ? this.pools : this.borrowPools) || [];
    },
    prepPools() {
      return this.sortByDepreciate(
        this.sortByTitle(this.filterBySearch(this.currentPools, this.search))
      );
    },
    loading() {
      return this.isFarm ? this.farmLoading : this.borrowLoading;
    },
    headers() {
      return this.isFarm
        ? ["Pool", "~Yield per $1000", "ROI Annually", "TVL"]
        : [
            "COMPONENT",
            "TOTAL MIM BORROWED",
            "MIMS LEFT TO BORROW",
            "INTEREST",
            "LIQUIDATION FEE",
          ];
    },
  },
  watch: {
    isFarm: {
      immediate: true,
      handler(isFarm) {
        clearInterval(this.poolsInterval);

        const poolsCallback = isFarm
          ? async () => {
              await this.createFarmPools();
            }
          : async () => {
              await this.createPools();
            };

        if (!this.currentPools.length) poolsCallback();
        this.poolsInterval = setInterval(poolsCallback, 5000);

        this.search = "";
        this.selectedSort = sortKeys.name;
        this.sortReverse = false;
      },
    },
  },
  beforeDestroy() {
    clearInterval(this.poolsInterval);
  },
};
</script>

<style lang="scss" scoped>
.stats-wrap {
  padding: 0 16px 60px 16px;
}

.tools-wrap {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;
}

.dropdown {
  grid-column: auto / span 1;
  &:focus-within {
    .open-btn {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background-color: #55535d;
      color: white !important;
    }
    .sort-btn {
      background-color: #55535d;
      &:hover {
        color: #76c3f5;
      }
    }
  }
}

.open-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding: 0 17px 0 12px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.06);

  &:hover {
    background-color: #55535d;
  }

  .sort-icon {
    width: 20px;
    &-reverse {
      transform: rotate(180deg);
    }
    &-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;

      margin-right: 10px;
    }
  }

  .arrow-icon {
    margin-left: 25px;
  }
}

.sort-btn {
  height: 50px;
  color: white;
  cursor: pointer;
  border: none;
}

.sort-title-wrap {
  display: flex;
  align-items: center;
}

.sort-item {
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
}

.search-wrap {
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  padding-left: 10px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  height: 50px;
  grid-column: auto / span 1;

  .search-icon {
    width: 20px;
    pointer-events: none;
  }

  .search-input {
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    width: 100%;

    &::placeholder {
      color: white;
    }
  }
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
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 60px;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-size: 16px;
  border-radius: 30px;
  background-color: #2a2835;
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

@media (min-width: 768px) {
  .dropdown {
    grid-column: auto / span 4;
  }
  .search-wrap {
    grid-column: auto / span 3;
  }
  .tools-wrap {
    grid-template-columns: repeat(12, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-wrap {
    padding: 0 0 60px 0;
  }
  .stats-list-wrap {
    grid-column: 1 / 5;
    margin-top: 0;
  }
  .stats-list-header {
    display: grid;
  }
}
</style>
