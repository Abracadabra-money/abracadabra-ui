<template>
  <div class="my-positions-view">
    <div class="position-page">
      <MyPositionsInfo :totalAssetsData="totalAssetsData" />

      <BentoBoxBlock v-if="account" />

      <div class="positions-list-head" v-if="cauldrons.length">
        <button class="filters" @click="isFiltersPopupOpened = true">
          <img class="filters-icon" src="@/assets/images/filters.png" />
        </button>

        <div class="sort-buttons">
          <SortButton
            v-for="data in sortersData"
            :sortOrder="getSortOrder(data.tableKey)"
            @click="updateSortKey(data.tableKey)"
            :key="data.tableKey"
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
          :key="`${cauldron.id} - ${cauldron.chainId}`"
          :cauldron="cauldron"
        />
      </div>

      <div class="loader-wrap" v-if="positionsIsLoading || showEmptyBlock">
        <BaseLoader v-if="positionsIsLoading" large text="Loading Positions" />
        <BaseSearchEmpty
          v-if="showEmptyBlock && account"
          text="There are no Positions"
        />
        <ConnectWalletBlock v-if="!account" />
      </div>
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
import {
  formatUSD,
  formatTokenBalance,
  formatToFixed,
} from "@/helpers/filters";
import { mapGetters, mapMutations } from "vuex";
import { APR_KEY } from "@/constants/global";
import BaseLoader from "@/components/base/BaseLoader.vue";
import SortButton from "@/components/ui/buttons/SortButton.vue";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
import BaseSearchEmpty from "@/components/base/BaseSearchEmpty.vue";
import FiltersPopup from "@/components/myPositions/FiltersPopup.vue";
import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";
import ChainsDropdown from "@/components/ui/dropdown/ChainsDropdown.vue";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";
import MyPositionsInfo from "@/components/myPositions/MyPositionsInfo.vue";
import ConnectWalletBlock from "@/components/myPositions/ConnectWalletBlock.vue";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";
import { getUsersTotalAssets } from "@/helpers/cauldron/position/getUsersTotalAssets.ts";
import { getUserOpenPositions } from "@/helpers/cauldron/position/getUserOpenPositions.ts";

export default {
  data() {
    return {
      selectedChains: [],
      updateInterval: null,
      cauldrons: [],
      positionsIsLoading: true,
      totalAssets: null,
      sortKey: "mimBorrowed",
      sortOrder: "up",
      isFiltersPopupOpened: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      provider: "getProvider",
      signer: "getSigner",
      localUserPositions: "getUserPositions",
      userTotalAssets: "getUserTotalAssets",
    }),

    isSelectAllChains() {
      return this.selectedChains.length === this.activeChains.length;
    },

    showEmptyBlock() {
      return !this.positionsIsLoading && !this.sortedCauldrons.length;
    },

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
          value: formatUSD(this.totalAssets?.collateralDepositedInUsd),
        },
        {
          title: "MIM Minted",
          value: formatTokenBalance(this.totalAssets?.mimBorrowed),
        },
      ].filter((item) => !item.hidden);
    },

    sortersData() {
      return [
        { tableKey: "positionHealth", text: "Health factor" },
        { tableKey: "collateralDepositedUsd", text: "Collateral deposited" },
        { tableKey: "mimBorrowed", text: "MIM minted" },
        { tableKey: "apr", text: "APR" },
      ];
    },

    activeChains() {
      return this.getActiveChain();
    },
  },

  watch: {
    async account() {
      if (!this.account) {
        this.cauldrons = [];
        this.totalAssets = null;
      } else {
        this.checkLocalData();
        await this.createOpenPositions();
      }
    },

    cauldrons() {
      this.selectedChains = this.getActiveChain();
    },
  },

  methods: {
    ...mapMutations({
      setUserPositions: "setUserPositions",
      setUserTotalAssets: "setUserTotalAssets",
    }),

    sortByKey(cauldrons = [], key) {
      if (this.sortOrder === null) return this.cauldrons;
      const sortedByKey = cauldrons.sort((a, b) => b[key] - a[key]);

      if (this.sortOrder == "up") return sortedByKey;
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
      this.sortOrder = "up";
    },

    updateSortOrder() {
      this.sortOrder =
        this.sortOrder === null ? "up" : this.sortOrder == "up" ? "down" : null;
    },

    getSortOrder(key) {
      return key === this.sortKey ? this.sortOrder : null;
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

    async createOpenPositions() {
      if (!this.account) return false;
      this.cauldrons = await getUserOpenPositions(this.account);
      await this.getCollateralsApr();
      this.totalAssets = getUsersTotalAssets(this.cauldrons);
    },

    async fetchCollateralApy(cauldron, chainId, address) {
      const provider = getEthersProvider(chainId);
      const apr = await fetchTokenApy(cauldron, chainId, provider);
      const localData = localStorage.getItem(APR_KEY);
      const parsedData = localData ? JSON.parse(localData) : {};
      parsedData[address] = {
        chainId,
        apr: Number(formatToFixed(apr, 2)),
        createdAt: new Date().getTime(),
      };
      localStorage.setItem(APR_KEY, JSON.stringify(parsedData));
      return formatToFixed(apr, 2);
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
        const localApr = localStorage.getItem(APR_KEY);
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

    getActiveChain() {
      return this.cauldrons.reduce((acc, { config }) => {
        if (!acc.includes(config.chainId)) acc.push(config.chainId);
        return acc;
      }, []);
    },

    checkLocalData() {
      if (this.localUserPositions.isCreated && this.account) {
        this.cauldrons = this.localUserPositions.data;
        this.positionsIsLoading = false;
      }

      if (this.userTotalAssets.isCreated && this.account) {
        this.totalAssets = this.userTotalAssets.data;
      }
    },
  },

  async created() {
    this.positionsIsLoading = true;
    this.checkLocalData();
    await this.createOpenPositions();

    this.positionsIsLoading = false;

    if (this.account) {
      this.setUserPositions(this.cauldrons);
      this.setUserTotalAssets(this.totalAssets);
    }

    this.updateInterval = setInterval(async () => {
      await this.createOpenPositions();
    }, 60000);

    this.selectedChains = this.getActiveChain();
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
    BaseLoader,
    BaseSearchEmpty,
    ConnectWalletBlock,
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.my-positions-view {
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 100vh;
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
    padding: 0 15px;
  }

  .positions-list {
    justify-content: center;
  }
}

@media screen and (max-width: 1000px) {
  .positions-list-head {
    justify-content: space-between;
  }

  .positions-list {
    height: 780px;
    overflow-y: auto;
  }

  .sort-buttons {
    display: none;
  }

  .filters {
    display: flex;
  }
}

@media screen and (max-width: 600px) {
  .position-page {
    padding: 0 10px;
  }
}
</style>
