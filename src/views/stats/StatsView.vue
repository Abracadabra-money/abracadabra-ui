<template>
  <EmptyStatsList v-if="!currentPools.length && !loading" />
  <div v-else-if="!currentPools.length && loading" class="loader-wrap">
    <BaseLoader />
  </div>
  <div v-else class="stats-wrap">
    <template>
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
              <span>{{ `Sorted by ${selectedTitleData.title}` }}</span>
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
            v-for="(titleData, i) in titlesList.filter(
              ({ name }) => name !== selectedTitle
            )"
            :key="i"
            @click="select(titleData.name)"
          >
            {{ titleData.title }}
          </button>
        </template>
      </DropdownWrap>
      <div class="stats-list-wrap">
        <div
          class="stats-list-header"
          :class="{ 'stats-list-header-farm': isFarm }"
        >
          <div v-for="(title, i) in headers" :key="i">{{ title }}</div>
        </div>

        <template v-if="sortedDataItems.length">
          <StatsItem
            v-for="poolData in sortedDataItems"
            :key="poolData.id"
            :poolData="poolData"
            :degen="false"
            :isNew="false"
            :isFarm="isFarm"
        /></template>
        <EmptyStatsList v-else /></div
    ></template>
  </div>
</template>

<script>
import Vue from "vue";
import farmPoolsMixin from "@/mixins/farmPools";
import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import { mapGetters } from "vuex";

const BaseLoader = () => import("@/components/base/BaseLoader");
const EmptyStatsList = () => import("@/components/stats/EmptyStatsList");

const DropdownWrap = () => import("@/components/ui/DropdownWrap");
const StatsItem = () => import("@/components/stats/StatsItem");

export default {
  name: "StatsView",
  components: { EmptyStatsList, BaseLoader, DropdownWrap, StatsItem },
  mixins: [farmPoolsMixin, borrowPoolsMixin],
  props: { isFarm: { type: Boolean, default: false } },
  data: () => ({
    selectedTitle: "name",
    sortReverse: false,
    search: "",
    poolsInterval: null,
  }),
  methods: {
    select(name) {
      this.selectedTitle = name;
    },
    calcTokenInUsd(pool) {
      return pool.userInfo.userCollateralShare / pool.tokenPrice;
    },
    filterBySearch(pools, search) {
      return search
        ? pools.filter(
            (pool) =>
              pool.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          )
        : pools;
    },
    sortByTitle(pools, titleData) {
      const sortedPools = [...pools];
      if (titleData !== null) {
        const prepValue = (value) => {
          const numb = +String(value).replace(/,/g, "");
          if (!isNaN(numb)) return numb;
          return value;
        };
        sortedPools.sort((aItem, bItem) => {
          const a = prepValue(aItem[titleData.name]);
          const b = prepValue(bItem[titleData.name]);

          const factor = this.sortReverse ? 1 : -1;

          return a < b ? factor : -factor;
        });
      }

      return sortedPools;
    },
  },
  computed: {
    ...mapGetters({
      borrowPools: "getPools",
      borrowLoading: "getLoadPoolsBorrow",
      farmLoading: "getFarmPoolLoading",
    }),
    selectedTitleData() {
      return (
        this.titlesList.find(({ name }) => this.selectedTitle === name) || null
      );
    },
    titlesList() {
      return this.isFarm
        ? [
            { title: "Title", name: "name" },
            { title: "YIELD PER $1000", name: "yield" },
            { title: "ROI ANNUALLY", name: "roi" },
            { title: "TVL", name: "tvl" },
          ]
        : [
            { title: "Title", name: "name" },
            { title: "TVL", name: "totalMim" },
            { title: "MIMs Left", name: "mimsLeft" },
            { title: "Interest", name: "interest" },
            { title: "Fee", name: "liquidation" },
          ];
    },
    currentPools() {
      return (this.isFarm ? this.pools : this.borrowPools) || [];
    },
    filteredPools() {
      return this.filterBySearch(this.currentPools, this.search);
    },
    sortedDataItems() {
      return this.sortByTitle(this.poolDataItems, this.selectedTitleData);
    },
    poolDataItems() {
      if (this.filteredPools.length)
        return this.isFarm
          ? this.filteredPools.map((pool) => ({
              yield: Vue.filter("formatTokenBalance")(pool.poolYield),
              roi: Vue.filter("formatPercent")(pool.poolRoi),
              tvl: Vue.filter("formatUSD")(pool.poolTvl),
              name: pool.name,
              icon: pool.icon,
              id: pool.id,
            }))
          : this.filteredPools.map((pool) => ({
              totalMim: Vue.filter("formatTokenBalance")(pool.totalBorrow),
              mimsLeft: Vue.filter("formatTokenBalance")(
                pool.dynamicBorrowAmount
              ),
              interest: pool.interest,
              liquidation: pool.stabilityFee,
              name: pool.name,
              icon: pool.icon,
              id: pool.id,
            }));
      else return [];
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

        if (!this.poolDataItems.length) poolsCallback();
        this.poolsInterval = setInterval(poolsCallback, 5000);

        this.search = "";
        this.selectedTitle = "name";
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
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  padding: 0 16px 60px 16px;
}

.dropdown {
  &:focus-within {
    .open-btn {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
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
  background-color: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  border: none;
}

.sort-title-wrap {
  display: flex;
  align-items: center;
}

.sort-item {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);

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

@media (min-width: 1024px) {
  .stats-wrap {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
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
