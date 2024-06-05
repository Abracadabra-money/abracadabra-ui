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
          @selectAllChains="selectAllChains"
        />
      </div>

      <div class="positions-list" v-if="sortedCauldrons.length">
        <CauldronPositionItem
          v-for="cauldron in sortedCauldrons"
          :key="`${cauldron.config.id} - ${cauldron.config.chainId}`"
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

<script lang="ts">
import { defineAsyncComponent } from "vue";
//@ts-ignore
import debounce from "lodash.debounce";
import {
  formatUSD,
  formatTokenBalance,
  formatToFixed,
} from "@/helpers/filters";
import { mapGetters, mapMutations } from "vuex";
import { APR_KEY } from "@/constants/global";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";
import { getUsersTotalAssets } from "@/helpers/cauldron/position/getUsersTotalAssets";
import {
  getUserOpenPositions,
  type UserOpenPosition,
} from "@/helpers/cauldron/position/getUserOpenPositions";
import type { Address } from "viem";
import type { UserTotalAssets } from "@/helpers/cauldron/types";
import type { SortOrder } from "@/types/common";

export type PositionsSortKey =
  | "positionHealth"
  | "collateralDepositedUsd"
  | "mimBorrowed"
  | "apr";
export type SorterData = { tableKey: PositionsSortKey; text: string };
export type LocalAPRData = {
  chainId: number;
  apr: number;
  createdAt: number;
};

export default {
  data() {
    return {
      selectedChains: [] as number[],
      updateInterval: null as NodeJS.Timeout | null,
      cauldrons: [] as unknown as UserOpenPosition[],
      positionsIsLoading: true,
      totalAssets: null as unknown as UserTotalAssets | null,
      sortKey: "mimBorrowed" as PositionsSortKey,
      sortOrder: "up" as SortOrder,
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

    allChainsSelected() {
      return this.selectedChains.length === this.activeChains.length;
    },

    showEmptyBlock() {
      return !this.positionsIsLoading && !this.sortedCauldrons.length;
    },

    sortedCauldrons() {
      return this.filterByChain(
        this.sortByKey(this.cauldrons, this.sortKey),
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
          value: formatUSD(this.totalAssets?.collateralDepositedInUsd || 0),
        },
        {
          title: "MIM Minted",
          value: formatTokenBalance(this.totalAssets?.mimBorrowed || 0),
        },
      ];
    },

    sortersData(): SorterData[] {
      return [
        { tableKey: "positionHealth", text: "Health factor" },
        { tableKey: "collateralDepositedUsd", text: "Collateral deposited" },
        { tableKey: "mimBorrowed", text: "MIM minted" },
        { tableKey: "apr", text: "APR" },
      ];
    },

    activeChains() {
      return this.getActiveChain() || [];
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
      this.selectedChains = this.getActiveChain() || [];
    },
  },

  methods: {
    ...mapMutations({
      setUserPositions: "setUserPositions",
      setUserTotalAssets: "setUserTotalAssets",
    }),

    sortByKey(cauldrons: UserOpenPosition[], key: PositionsSortKey) {
      console.log(cauldrons);

      if (this.sortOrder === null || this.cauldrons.length < 2)
        return this.cauldrons;
      const sortedByKey = cauldrons.sort((a, b) => {
        const prev = (key === "positionHealth" ? a[key].percent : a[key]) || 0;
        const cur = (key === "positionHealth" ? b[key].percent : b[key]) || 0;

        return cur - prev;
      });

      if (this.sortOrder == "up") return sortedByKey;
      return sortedByKey.reverse();
    },

    updateSortKey(newKey: PositionsSortKey, newOrder = null as SortOrder) {
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

    getSortOrder(key: PositionsSortKey): SortOrder {
      return key === this.sortKey ? this.sortOrder : null;
    },

    selectAllChains() {
      if (this.allChainsSelected) this.selectedChains = [];
      else this.selectedChains = [...this.activeChains];
    },

    updateSelectedChain(chainId: number) {
      if (this.allChainsSelected) this.selectAllChains();

      const index = this.selectedChains.indexOf(chainId);
      if (index === -1) this.selectedChains.push(chainId);
      else this.selectedChains.splice(index, 1);
    },

    filterByChain(cauldrons: UserOpenPosition[], selectedChains: number[]) {
      if (this.allChainsSelected) return cauldrons;
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

    async fetchCollateralApy(
      cauldron: UserOpenPosition,
      chainId: number,
      address: Address
    ) {
      const provider = getEthersProvider(chainId);
      const apr = await fetchTokenApy(cauldron, chainId, provider);
      const localData = localStorage.getItem(APR_KEY);
      const parsedData = localData ? JSON.parse(localData) : {};
      parsedData[address] = {
        chainId,
        apr: Number(formatToFixed(apr || 0, 2)),
        createdAt: new Date().getTime(),
      };
      localStorage.setItem(APR_KEY, JSON.stringify(parsedData));
      return Number(formatToFixed(apr || 0, 2));
    },

    timeHasPassed(localData: any, address: Address) {
      if (!localData) return true;
      if (!localData[address as keyof typeof localData]) return true;
      const allowedTime = 5;
      const { createdAt }: LocalAPRData =
        localData[address as keyof typeof localData];
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - createdAt;
      const minutes = Math.floor(timeDiff / 1000 / 60);
      return minutes > allowedTime;
    },

    async getCollateralApr(cauldron: UserOpenPosition) {
      const { chainId, id, contract } = cauldron.config;
      const isApyExist = isApyCalcExist(chainId, id);
      if (isApyExist) {
        const localApr = localStorage.getItem(APR_KEY);

        const parseLocalApr = localApr ? JSON.parse(localApr) : null;
        const isOutdated = this.timeHasPassed(parseLocalApr, contract.address);
        const collateralApy = !isOutdated
          ? parseLocalApr[contract.address].apr
          : await this.fetchCollateralApy(cauldron, chainId, contract.address);
        return Number(collateralApy);
      } else return 0;
    },

    async getCollateralsApr() {
      this.cauldrons = await Promise.all(
        this.cauldrons.map(async (cauldron: UserOpenPosition) => {
          const apr = await this.getCollateralApr(cauldron);
          cauldron.apr = apr;
          return cauldron;
        })
      );
    },

    getActiveChain: debounce(function getActiveChain(this: any) {
      return (
        this.cauldrons.reduce((acc: number[], { config }: UserOpenPosition) => {
          if (!acc.includes(config.chainId)) acc.push(config.chainId);
          return acc;
        }, []) || []
      );
    }, 500),

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
    if (this.updateInterval) clearInterval(this.updateInterval);
  },

  components: {
    BentoBoxBlock: defineAsyncComponent(
      () => import("@/components/myPositions/BentoBoxBlock.vue")
    ),
    CauldronPositionItem: defineAsyncComponent(
      () => import("@/components/myPositions/CauldronPositionItem.vue")
    ),
    MyPositionsInfo: defineAsyncComponent(
      () => import("@/components/myPositions/MyPositionsInfo.vue")
    ),
    ChainsDropdown: defineAsyncComponent(
      () => import("@/components/ui/dropdown/ChainsDropdown.vue")
    ),
    SortButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/SortButton.vue")
    ),
    FiltersPopup: defineAsyncComponent(
      () => import("@/components/myPositions/FiltersPopup.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
    BaseSearchEmpty: defineAsyncComponent(
      () => import("@/components/base/BaseSearchEmpty.vue")
    ),
    ConnectWalletBlock: defineAsyncComponent(
      () => import("@/components/myPositions/ConnectWalletBlock.vue")
    ),
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
