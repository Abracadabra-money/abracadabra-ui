<template>
  <div class="wrapper">
    <h2 class="title">Explore the Abracadabra Ecosystem on Arbitrum!</h2>
    <EmptyState v-if="!currentPools.length && !isFarmsLoading" />
    <div v-else-if="!currentPools.length && isFarmsLoading" class="loader-wrap">
      <BaseLoader />
    </div>
    <div v-else class="stats-wrap">
      <div class="stats-list-wrap">
        <template v-if="filteredPools.length">
          <FarmCard v-for="farm in filteredPools" :key="farm.id" :farm="farm" />
          <CamelotCard />
          <EmpowerCard />
        </template>
        <EmptyState v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseLoader from "@/components/base/BaseLoader.vue";
import EmptyState from "@/components/markets/EmptyState.vue";
import FarmCard from "@/components/markets/arbitrum/FarmCard.vue";
import EmpowerCard from "@/components/markets/arbitrum/EmpowerCard.vue";
import CamelotCard from "@/components/markets/arbitrum/CamelotCard.vue";
import { getFarmsList } from "@/helpers/farm/list/getFarmsList";

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
  data() {
    return {
      selectedSort: sortKeys.name,
      sortReverse: false,
      search: "",
      farmsInterval: null,
      isActiveMarkets: true,
      scrollPosition: 0,
      farms: null,
      isFarmsLoading: false,
    };
  },

  computed: {
    ...mapGetters({
      signer: "getSigner",
      chainId: "getChainId",
    }),

    showButtonUp() {
      return this.currentPools.length && this.scrollPosition !== 0;
    },

    selectedSortData() {
      return (
        this.sortList.find(({ name }) => this.selectedSort === name) || null
      );
    },

    sortList() {
      return [
        { title: "Title", name: sortKeys.name },
        { title: "APR", name: sortKeys.roi },
        { title: "TVL", name: sortKeys.tvl },
      ];
    },

    currentPools() {
      return this.farms || [];
    },

    filteredPools() {
      const multiRewardFarm = this.currentPools.find(
        (farm) => farm.isMultiReward
      );

      return [multiRewardFarm];
      // return this.sortByDepreciate(
      //   this.sortByTitle(this.filterBySearch(this.currentPools, this.search))
      // );
    },

    headers() {
      return ["Pool", "APR", "TVL"];
    },
  },

  methods: {
    select(name) {
      this.selectedSort = name;
    },

    filterBySearch(farms, search) {
      return search
        ? farms.filter(
            (farm) =>
              farm.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          )
        : farms;
    },

    sortByTitle(farms) {
      const sortedPools = [...farms];
      if (this.selectedSortData !== null) {
        const prepValue = (farm, sortData) => {
          switch (sortData.name) {
            case sortKeys.name:
              return farm.name;

            case sortKeys.yield:
              return +farm.farmYield;

            case sortKeys.roi:
              return +farm.farmRoi;

            case sortKeys.tvl:
              return +farm.farmTvl;

            case sortKeys.totalMim:
              return +farm.totalBorrow;

            case sortKeys.mimsLeft:
              return +farm.dynamicBorrowAmount;

            case sortKeys.interest:
              return +farm.interest;

            case sortKeys.liquidation:
              return +farm.stabilityFee;
          }

          return null;
        };
        sortedPools.sort((aPool, bPool) => {
          const a = prepValue(aPool, this.selectedSortData);
          const b = prepValue(bPool, this.selectedSortData);

          const factor = this.sortReverse ? -1 : 1;

          if (this.selectedSort === sortKeys.name)
            return a < b ? -factor : factor;

          return a < b ? factor : -factor;
        });
      }

      return sortedPools;
    },

    sortByDepreciate(farms = []) {
      if (this.isActiveMarkets) {
        return farms.filter((farm) => {
          if (farm?.cauldronSettings)
            return !farm.cauldronSettings.isDeprecated;
          return !farm.isDeprecated;
        });
      } else {
        return farms.sort((a, b) => {
          if (a?.cauldronSettings || b?.cauldronSettings) {
            return (
              +a.cauldronSettings.isDeprecated -
              +b.cauldronSettings.isDeprecated
            );
          }

          return +a.isDeprecated - +b.isDeprecated;
        });
      }
    },

    toggleActiveMarkets() {
      this.isActiveMarkets = !this.isActiveMarkets;
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    },

    onScroll() {
      this.scrollPosition = window.scrollY;
    },
  },

  async created() {
    this.isFarmsLoading = true;
    this.farms = await getFarmsList(this.chainId);
    this.isFarmsLoading = false;

    this.farmsInterval = setInterval(async () => {
      this.farms = await getFarmsList(this.chainId, this);
    }, 60000);
    window.addEventListener("scroll", this.onScroll);
  },

  beforeUnmount() {
    clearInterval(this.farmsInterval);
    window.removeEventListener("scroll", this.onScroll);
  },
  components: {
    EmptyState,
    BaseLoader,
    FarmCard,
    EmpowerCard,
    CamelotCard,
  },
};
</script>

<style lang="scss" scoped>
.button-up {
  position: fixed;
  right: 10%;
  bottom: 10%;
  z-index: 9;
  cursor: pointer;
}

.wrapper {
  width: 100%;
}

.title {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 40px;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
}

.stats-list-header {
  display: none;
  grid-template-columns: 1.1fr 1.1fr 1.1fr 1.2fr;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-size: 14px;
  border-radius: 30px;
  background: rgba(8, 14, 31, 0.6);
  backdrop-filter: blur(50px);
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;

  &-farm {
    grid-template-columns: 1fr 1fr 1fr 60px;
  }
}

.loader-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

// new
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
  .dropdown {
    grid-column: auto / span 5;
  }

  .search-wrap {
    grid-column: auto / span 3;
  }

  .active-markets {
    grid-column: auto / span 4;
  }

  .tools-wrap {
    grid-template-columns: repeat(12, 1fr);
  }
}

@media (min-width: 1024px) {
  .dropdown {
    grid-column: auto / span 5;
  }

  .search-wrap {
    grid-column: auto / span 4;
  }

  .active-markets {
    grid-column: auto / span 3;
  }

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

@media screen and (max-width: 660px) {
  .stats-list-wrap {
    justify-content: center;
  }
}
</style>
