<template>
  <div class="my-positions-view">
    <div class="position-page">
      <MyPositionsInfo v-if="totalAssets" :totalAssetsData="totalAssetsData" />

      <BentoBoxBlock
        v-if="activeChains.length"
        :activeNetworks="activeChains"
      />

      <div class="positions-list-head" v-if="cauldrons.length">
        <button class="filters" @click="isFiltersPopupOpened = true">
          <img src="@/assets/images/filters.png" />
          Filters
        </button>

        <div class="sort-buttons">
          <SortButton
            v-for="data in sortersData"
            :sortOrder="getSortOrder(data.key)"
            @click="updateSortKey(data.key)"
            :key="data.key"
            >{{ data.text }}</SortButton
          >
        </div>

        <ChainsDropdown
          :activeChains="activeChains"
          :selectedChains="selectedChains"
          @updateSelectedChain="updateSelectedChain"
        />
      </div>

      <div class="positions-list" v-if="sortedCauldrons.length">
        <CauldronPositionItem
          v-for="cauldron in sortedCauldrons"
          :key="cauldron.id"
          :cauldron="cauldron"
        />
      </div>

      <EmptyBlock v-else :isLoading="positionsIsLoading" />
    </div>

    <FiltersPopup
      v-if="isFiltersPopupOpened"
      :sortersData="sortersData"
      @updateSortKey="updateSortKey"
      @close="isFiltersPopupOpened = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import { getUserOpenPositions } from "@/helpers/cauldron/position/getUserOpenPositions.ts";
import { getUsersTotalAssets } from "@/helpers/cauldron/position/getUsersTotalAssets.ts";
import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";
import MyPositionsInfo from "@/components/myPositions/MyPositionsInfo.vue";
import ChainsDropdown from "@/components/ui/dropdown/ChainsDropdown.vue";
import SortButton from "@/components/ui/buttons/SortButton.vue";
import FiltersPopup from "@/components/myPositions/FiltersPopup.vue";
import EmptyBlock from "@/components/myPositions/EmptyState.vue";
import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier.ts";
const APR_KEY = "abracadabraCauldronsApr";

export default {
  data() {
    return {
      selectedChains: [0],
      updateInterval: null,
      cauldrons: [],
      positionsIsLoading: true,
      totalAssets: null,
      sortKey: "",
      sortOrder: null,
      isFiltersPopupOpened: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      provider: "getProvider",
      signer: "getSigner",
    }),

    sortedCauldrons() {
      return this.filterByChain(
        this.sortByKey([...this.cauldrons], this.sortKey),
        this.selectedChains
      );
    },

    isEmpyState() {
      return (
        !this.account || (!this.cauldrons.length && !this.positionsIsLoading)
      );
    },

    isPositionsLoaded() {
      return this.positionsIsLoading && !this.cauldrons.length;
    },

    totalAssetsData() {
      return [
        {
          title: "Collateral Deposit",
          value: filters.formatUSD(this.totalAssets?.collateralDepositedInUsd),
        },
        {
          title: "MIM Borrowed",
          value: filters.formatTokenBalance(this.totalAssets?.mimBorrowed),
        },
      ].filter((item) => !item.hidden);
    },

    sortersData() {
      return [
        { key: "positionHealth", text: "Health factor" },
        { key: "collateralDepositedUsd", text: "Collateral deposited" },
        { key: "mimBorrowed", text: "MIM borrowed" },
        { key: "apr", text: "APR" },
      ];
    },

    activeChains() {
      return this.cauldrons.reduce((acc, { config }) => {
        if (!acc.includes(config.chainId)) acc.push(config.chainId);
        return acc;
      }, []);
    },
  },

  watch: {
    async account() {
      await this.createOpenPositions();
    },
  },

  methods: {
    sortByKey(cauldrons = [], key) {
      if (this.sortOrder === null) return this.cauldrons;
      const sortedByKey = cauldrons.sort((a, b) => b[key] - a[key]);

      if (this.sortOrder) return sortedByKey;
      return sortedByKey.reverse();
    },

    updateSortKey(newKey, newOrder = null) {
      if (newOrder !== null) {
        this.sortKey = newKey;
        this.sortOrder = newOrder;
        return;
      }

      if (this.sortKey == newKey) {
        this.updateSortOrder();
        return;
      }

      this.sortKey = newKey;
      this.sortOrder = true;
    },

    updateSortOrder() {
      this.sortOrder =
        this.sortOrder === null ? true : this.sortOrder ? false : null;
    },

    getSortOrder(key) {
      return key === this.sortKey ? this.sortOrder : null;
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

    async createOpenPositions() {
      if (!this.account) {
        this.positionsIsLoading = false;
        return false;
      }

      this.cauldrons = await getUserOpenPositions(this.account);
      await this.getCollateralsApr();
      this.totalAssets = getUsersTotalAssets(this.cauldrons);
      this.positionsIsLoading = false;
      this.updateInterval = setInterval(async () => {
        this.cauldrons = await getUserOpenPositions(this.account);
        await this.getCollateralsApr();
        this.totalAssets = getUsersTotalAssets(this.cauldrons);
      }, 60000);
    },

    async fetchCollateralApy(cauldron, chainId, address) {
      const provider = new providers.StaticJsonRpcProvider(defaultRpc[chainId]);
      const apr = await fetchTokenApy(cauldron, chainId, provider);
      const localData = localStorage.getItem("abracadabraCauldronsApr");
      const parsedData = localData ? JSON.parse(localData) : {};
      parsedData[address] = {
        chainId,
        apr: Number(filters.formatToFixed(apr, 2)),
        createdAt: new Date().getTime(),
      };
      localStorage.setItem(APR_KEY, JSON.stringify(parsedData));
      return filters.formatToFixed(apr, 2);
    },

    timeHasPassed(localData, address) {
      if (!localData) return true;
      if (!localData[address]) return true;
      const allowedTime = 5;
      const { createdAt } = localData[address];
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - createdAt;
      const minutes = Math.floor(timeDiff / 1000 / 60);
      return minutes > allowedTime;
    },

    async getCollateralApr(cauldron) {
      const { chainId, id, contract } = cauldron.config;
      const isApyExist = isApyCalcExist(chainId, id);
      if (isApyExist) {
        const localApr = localStorage.getItem("abracadabraCauldronsApr");
        const parseLocalApr = localApr ? JSON.parse(localApr) : null;
        const isOutdated = this.timeHasPassed(parseLocalApr, contract.address);
        const collateralApy = !isOutdated
          ? parseLocalApr[contract.address].apr
          : await this.fetchCollateralApy(cauldron, chainId, contract.address);
        return collateralApy;
      } else return 0;
    },

    async getCollateralsApr() {
      this.cauldrons = await Promise.all(
        this.cauldrons.map(async (cauldron) => {
          const apr = await this.getCollateralApr(cauldron);
          cauldron.apr = apr;
          return cauldron;
        })
      );
    },
  },

  async created() {
    await this.createOpenPositions();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    BentoBoxBlock,
    CauldronPositionItem,
    MyPositionsInfo,
    ChainsDropdown,
    SortButton,
    FiltersPopup,
    EmptyBlock,
  },
};
</script>

<style lang="scss" scoped>
.my-positions-view {
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: url("../assets/images/myPositions/my-positions-page-background.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.position-page {
  margin: 150px 0 60px 0;
  width: 1280px;
  max-width: 100%;
  box-sizing: border-box;
}

.positions-list-head {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 100%;
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

.sort-buttons {
  display: flex;
  gap: 20px;
}

.filters {
  display: none;
  height: 39px;
  padding: 7px 14px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  color: #5d7acd;
  font-family: Prompt;
  font-size: 16px;
  font-weight: 400;
  transition: opacity 0.3s ease;
}

.filters:hover {
  cursor: pointer;
  opacity: 0.7;
}

.positions-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.position-list {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
}

@media screen and (max-width: 1300px) {
  .position-page {
    max-width: 94%;
  }

  .positions-list {
    justify-content: center;
  }
}

@media screen and (max-width: 1000px) {
  .positions-list-head {
    justify-content: space-between;
  }

  .sort-buttons {
    display: none;
  }

  .filters {
    display: flex;
  }
}
</style>
