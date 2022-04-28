<template>
  <div class="stats-wrap">
    <div class="search-wrap">
      <img class="search-icon" src="@/assets/images/search.svg" alt="search" />
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
            <img
              class="sort-icon"
              src="@/assets/images/filter.svg"
              alt="filter"
            />
            <span>{{
              selectedTitleData ? selectedTitleData.title : "Sorted by Title"
            }}</span>
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
          v-for="(titleData, i) in titlesList"
          :key="i"
          @click="
            titleData.name !== selectedTitle
              ? select(titleData.name)
              : select(null)
          "
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
      <div v-if="!currentPools.length && loading" class="loader-wrap">
        <Loader />
      </div>
      <template v-else>
        <StatsItem
          v-for="poolData in sortedDataItems"
          :key="poolData.id"
          :poolData="poolData"
          :degen="false"
          :isNew="false"
          :isFarm="isFarm"
      /></template>
    </div>
  </div>
</template>

<script>
import farmPoolsMixin from "../mixins/farmPools";
import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import { mapGetters } from "vuex";

const Loader = () => import("@/components/Loader");

const DropdownWrap = () => import("@/components/ui/DropdownWrap");
const StatsItem = () => import("@/components/stats/StatsItem");

export default {
  name: "StatsView",
  components: { Loader, DropdownWrap, StatsItem },
  mixins: [farmPoolsMixin, borrowPoolsMixin],
  props: { isFarm: { type: Boolean, default: false } },
  data: () => ({
    selectedTitle: null,
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
    calcBorrowLeft(pool) {
      const maxMimBorrow = (this.calcTokenInUsd(pool) / 100) * (pool.ltv - 1);
      let leftBorrow = parseFloat(
        maxMimBorrow - pool.userInfo.userBorrowPart
      ).toFixed(20);
      if (+leftBorrow < 0) leftBorrow = "0";

      let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0, + (4 || -1) + })?`
      );
      return leftBorrow.toString().match(re)[0];
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
        const prepValue = (value) => +String(value).replace(/,/g, "");
        sortedPools.sort((aItem, bItem) => {
          const a = prepValue(aItem[titleData.name]);
          const b = prepValue(bItem[titleData.name]);
          return a - b;
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
            { title: "YIELD PER $1000", name: "yield" },
            { title: "ROI ANNUALLY", name: "roi" },
            { title: "TVL", name: "tvl" },
          ]
        : [
            { title: "TOTAL MIM BORROWED", name: "totalMim" },
            { title: "MIMS LEFT TO BORROW", name: "mimsLeft" },
            { title: "INTEREST", name: "interest" },
            { title: "LIQUIDATION FEE", name: "liquidation" },
          ];
    },
    currentPools() {
      return (this.isFarm ? this.pools : this.borrowPools) || [];
    },
    filteredPools() {
      return this.filterBySearch(this.currentPools, this.search);
    },
    sortedDataItems() {
      console.log(this.sortByTitle(this.poolDataItems, this.selectedTitleData));
      return this.sortByTitle(this.poolDataItems, this.selectedTitleData);
    },
    poolDataItems() {
      return this.isFarm
        ? this.filteredPools.map((pool) => ({
            yield: pool.poolYield,
            roi: pool.poolRoi,
            tvl: pool.poolTvl,
            name: pool.name,
            icon: pool.icon,
            id: pool.id,
          }))
        : this.filteredPools.map((pool) => ({
            totalMim: pool.userInfo?.userBorrowPart,
            mimsLeft: this.calcBorrowLeft(pool),
            interest: pool.interest,
            liquidation: pool.stabilityFee,
            name: pool.name,
            icon: pool.icon,
            id: pool.id,
          }));
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
        this.selectedTitle = null;
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
    margin-right: 10px;
    width: 20px;
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
