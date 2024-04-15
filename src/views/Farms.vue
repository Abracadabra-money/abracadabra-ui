<template>
  <div class="farms-view">
    <div class="farms-wrap">
      <div class="farms">
        <FarmsInfo :farms="this.farms" />

        <div class="farms-list-wrap">
          <div class="farms-list-head">
            <div class="togglers">
              <Toggle
                text="Active Farms"
                :selected="isActiveMarkets"
                @updateToggle="toggleActiveMarkets"
              />

              <Toggle
                text="My Farms"
                :selected="isMyPositions"
                @updateToggle="toggleMyPositions"
                v-if="signer"
              />
            </div>

            <div class="sort-buttons">
              <SortButton :sortOrder="aprOrder" @click="changeAprOrder">
                APR
              </SortButton>

              <ChainsDropdown
                :activeChains="activeChains"
                :selectedChains="selectedChains"
                @updateSelectedChain="updateSelectedChain"
              />
            </div>

            <InputSearch class="input-search" @changeSearch="updateSearch" />
          </div>

          <div class="farms-list">
            <template v-if="filteredFarms.length">
              <FarmItem
                v-for="farm in filteredFarms"
                :key="`${farm.id}-${farm.chainId}`"
                :farm="farm"
              />
            </template>

            <div class="loader-wrap" v-if="isFarmsLoading || showEmptyBlock">
              <BaseLoader v-if="isFarmsLoading" medium text="Loading Farms" />
              <BaseSearchEmpty
                v-if="showEmptyBlock"
                text="There are no Farms"
              />
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop class="scroll-top" v-if="farms?.length" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FarmItem from "@/components/farm/FarmItem.vue";
import Toggle from "@/components/ui/Toggle.vue";
import ChainsDropdown from "@/components/ui/dropdown/ChainsDropdown.vue";
import InputSearch from "@/components/ui/inputs/InputSearch.vue";
import SortButton from "@/components/ui/buttons/SortButton.vue";
import FarmsInfo from "@/components/farm/FarmsInfo.vue";
import ScrollToTop from "@/components/ui/ScrollToTop.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import BaseSearchEmpty from "@/components/base/BaseSearchEmpty.vue";
import { getFarmsList } from "@/helpers/farm/list/getFarmsList";

export default {
  data() {
    return {
      search: "",
      farmsInterval: null,
      isActiveMarkets: true,
      isMyPositions: false,
      aprOrder: null,
      farms: null,
      selectedChains: [],
      isFarmsLoading: false,
    };
  },

  computed: {
    ...mapGetters({
      signer: "getSigner",
      chainId: "getChainId",
      localFarmList: "getFarmList",
    }),

    isSelectAllChains() {
      return this.selectedChains.length === this.activeChains.length;
    },

    showButtonUp() {
      return this.currentPools.length && this.scrollPosition !== 0;
    },

    showEmptyBlock() {
      return !this.isFarmsLoading && !this.filteredFarms.length;
    },

    currentPools() {
      return this.farms || [];
    },

    filteredFarms() {
      return this.sortByApr(
        this.filterByChain(
          this.sortByDepreciate(
            this.filterByOpenedPositions(
              this.filterBySearch(this.currentPools, this.search)
            )
          )
        )
      );
    },

    activeChains() {
      return this.getActiveChain();
    },
  },

  watch: {
    farms() {
      this.selectedChains = this.getActiveChain();
    },
  },

  methods: {
    filterBySearch(farms, search) {
      return search
        ? farms.filter(
            (farm) =>
              farm.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          )
        : farms;
    },

    updateSearch(value) {
      this.search = value.toLowerCase();
    },

    sortByDepreciate(farms = []) {
      if (this.isActiveMarkets) {
        return farms.filter((farm) => {
          return !farm?.isDeprecated;
        });
      } else {
        return [...farms].sort((a, b) => {
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

    sortByApr(farms = []) {
      if (this.aprOrder === null) return farms;
      const sortedByApr = farms.sort((a, b) => b.farmRoi - a.farmRoi);

      if (this.aprOrder == "up") return sortedByApr;
      return sortedByApr.reverse();
    },

    toggleActiveMarkets() {
      this.isActiveMarkets = !this.isActiveMarkets;
    },

    filterByOpenedPositions(farms = []) {
      if (this.isMyPositions) {
        return farms.filter((farm) =>
          Number(farm.accountInfo.depositedBalance)
        );
      }

      return farms;
    },

    toggleMyPositions() {
      this.isMyPositions = !this.isMyPositions;
    },

    changeAprOrder() {
      this.aprOrder =
        this.aprOrder === null ? "up" : this.aprOrder == "up" ? "down" : null;
    },

    filterByChain(farms) {
      if (this.selectedChains.includes(0)) return farms;
      return farms.filter((farm) => {
        return this.selectedChains.includes(farm.chainId);
      });
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

    getActiveChain() {
      return this.farms?.reduce((acc, farm) => {
        if (!acc.includes(farm.chainId)) acc.push(farm.chainId);
        return acc;
      }, []);
    },
  },

  async created() {
    this.isFarmsLoading = true;
    if (this.localFarmList.length) {
      this.farms = this.localFarmList;
      this.isFarmsLoading = false;
    } else {
      this.farms = await getFarmsList(this.chainId);
      this.isFarmsLoading = false;
      await this.$store.commit("setFarmList", this.farms);
    }

    this.selectedChains = this.getActiveChain();
    this.farmsInterval = setInterval(async () => {
      this.farms = await getFarmsList(this.chainId, this);
      await this.$store.commit("setFarmList", this.farms);
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.farmsInterval);
  },

  components: {
    FarmItem,
    Toggle,
    ChainsDropdown,
    InputSearch,
    SortButton,
    FarmsInfo,
    ScrollToTop,
    BaseLoader,
    BaseSearchEmpty,
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.farms-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
}

.button-up {
  position: fixed;
  right: 10%;
  bottom: 10%;
  z-index: 9;
  cursor: pointer;
}

.farms-wrap {
  margin: 150px 0 60px 0;
  width: 1280px;
  max-width: 100%;
  box-sizing: border-box;
}

.farms-info {
  margin-bottom: 32px;
}

.title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.desc-line {
  display: flex;
  align-items: center;
}

.mim-symbol {
  margin-right: 4px;
}

.farms {
  position: relative;
}

.farms-list-head {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 24px;
  margin-bottom: 20px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.farms-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.loader-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-gif {
  width: 40%;
  height: 50%;
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

.togglers,
.sort-buttons {
  display: flex;
  gap: 20px;
}

.sort-buttons {
  margin-left: auto;
  margin-right: 20px;
}

.loader-wrap {
  margin: auto;
}

@media screen and (max-width: 1300px) {
  .farms {
    padding: 0 15px;
  }

  .farms-list {
    justify-content: center;
  }
}

@media screen and (max-width: 1000px) {
  .farms-list-head {
    flex-wrap: wrap;
    gap: 20px;
    padding: 12px;
  }

  .input-search {
    order: -1;
    width: 100%;
  }

  .sort-buttons {
    margin-left: 0;
    margin-right: 0;
  }
}

@media screen and (max-width: 600px) {
  .farms-list-wrap {
    padding: 20px 24px;
    border-radius: 16px;
    border: 1px solid #00296b;
    background: linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    backdrop-filter: blur(12.5px);
  }

  .farms-list-head {
    align-items: start;
    padding: 0;
    margin-bottom: 12px;
    border: none;
    background: none;
    box-shadow: none;
    backdrop-filter: none;
  }

  .farms-list {
    max-height: 300px;
    padding: 0 8px;
    gap: 12px;
    overflow: auto;
  }

  .input-search {
    order: 1;
    width: 100%;
  }

  .togglers {
    order: 2;
  }

  .sort-buttons {
    order: 3;
  }

  .scroll-top {
    display: none;
  }
}
</style>
