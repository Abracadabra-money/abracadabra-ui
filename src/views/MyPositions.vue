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
            :sortOrder="getSortOrder(data.tableKey as PositionsSortKey)"
            @click="updateSortKey(data.tableKey as PositionsSortKey)"
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
          :userElixirInfo="userElixirInfo"
        />
      </div>

      <div
        class="loader-wrap"
        v-else-if="showConnectionBlock || showEmptyBlock || showLoader"
      >
        <ConnectWalletBlock v-if="showConnectionBlock" />
        <BaseLoader v-if="showLoader" large text="Loading Positions" />
        <BaseSearchEmpty v-if="showEmptyBlock" text="There are no Positions" />
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
import {
  formatUSD,
  formatTokenBalance,
  formatToFixed,
} from "@/helpers/filters";
import { mapGetters, mapMutations } from "vuex";
import { APR_KEY } from "@/constants/global";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
// @ts-ignore
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";
import { getUsersTotalAssets } from "@/helpers/cauldron/position/getUsersTotalAssets";
import {
  getUserOpenPositions,
  type UserOpenPosition,
} from "@/helpers/cauldron/position/getUserOpenPositions";
import type { Address } from "viem";
import type { UserTotalAssets } from "@/helpers/cauldron/types";
import type { PositionsSortKey, SorterData, SortOrder } from "@/types/sorting";
import axios from "axios";
import { ELIXIR_POTIONS_URL } from "@/constants/global";
import { LS_ELIXIR_RARE_KEY } from "@/helpers/dataStore";

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
      userElixirInfo: null as any,
      elixirRate: 0,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      isWalletCheckInProcess: "getIsWalletCheckInProcess",
      chainId: "getChainId",
      provider: "getProvider",
      signer: "getSigner",
      localUserPositions: "getUserPositions",
      userTotalAssets: "getUserTotalAssets",
    }),

    allChainsSelected() {
      return this.selectedChains.length === this.activeChains.length;
    },

    showConnectionBlock() {
      return !this.account;
    },

    showLoader() {
      return (
        this.account && (this.positionsIsLoading || this.isWalletCheckInProcess)
      );
    },

    showEmptyBlock() {
      return !this.showConnectionBlock && !this.showLoader;
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
      const userElixirPotions = !this.userElixirInfo
        ? 0
        : this.userElixirInfo[this.account.toLowerCase()].total;

      return [
        {
          title: " Elixir Potions Earned",
          value: formatTokenBalance(userElixirPotions),
          rate: formatToFixed(this.elixirRate, 3),
        },
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
        {
          tableKey: "positionHealth",
          text: "Health factor",
          isSortingCriterion: true,
        },
        {
          tableKey: "collateralDepositedUsd",
          text: "Collateral deposited",
          isSortingCriterion: true,
        },
        {
          tableKey: "mimBorrowed",
          text: "MIM minted",
          isSortingCriterion: true,
        },
        { tableKey: "apr", text: "APR", isSortingCriterion: true },
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
        this.userElixirInfo = null;
      } else {
        this.positionsIsLoading = true;
        await this.getElixirInfo();
        this.checkLocalData();
        await this.createOpenPositions();
        this.positionsIsLoading = false;
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
      if (this.sortOrder === null || this.cauldrons.length < 2)
        return this.cauldrons;
      const sortedByKey = [...cauldrons].sort((a, b) => {
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

    getActiveChain() {
      return this.cauldrons.reduce(
        (acc: number[], { config }: UserOpenPosition) => {
          if (!acc.includes(config.chainId)) acc.push(config.chainId);
          return acc;
        },
        []
      );
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

    async getElixirInfo() {
      try {
        this.checkLocalElixirRate();

        const { data } = await axios.get(
          `${ELIXIR_POTIONS_URL}?addresses=${this.account}`
        );

        this.elixirRate =
          data.weeks.filter(({ preliminary }: any) => !preliminary).at(-1)
            .rate || 0;

        localStorage.setItem(LS_ELIXIR_RARE_KEY, this.elixirRate.toString());

        const { users } = data.totals;

        if (!Object.keys(users).length) {
          this.userElixirInfo = null;
        } else {
          this.userElixirInfo = users;
        }

        return;
      } catch (error) {
        this.userElixirInfo = null;
        return;
      }
    },

    async getElixirRate() {
      try {
        this.checkLocalElixirRate();

        const { data } = await axios.get(`${ELIXIR_POTIONS_URL}`);

        this.elixirRate =
          data.weeks.filter(({ preliminary }: any) => !preliminary).at(-1)
            .rate || 0;

        localStorage.setItem(LS_ELIXIR_RARE_KEY, this.elixirRate.toString());

        return;
      } catch (error) {
        this.elixirRate = 0;
        return;
      }
    },

    checkLocalElixirRate() {
      const lsElixirRate = localStorage.getItem(LS_ELIXIR_RARE_KEY);

      if (lsElixirRate) {
        this.elixirRate = Number(lsElixirRate);
      }
    },
  },

  async created() {
    if (this.account) {
      await this.getElixirInfo();
    } else {
      await this.getElixirRate();
    }

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

    this.selectedChains = this.getActiveChain() || [];
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
