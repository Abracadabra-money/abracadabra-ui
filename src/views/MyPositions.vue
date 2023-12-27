<template>
  <div class="my-positions-view">
    <div class="position-page">
      <MyPositionsInfo v-if="totalAssets" :totalAssetsData="totalAssetsData" />

      <BentoBoxBlock />

      <div class="positions-list-head">
        <SortButton>Health factor</SortButton>
        <SortButton>Collateral deposited</SortButton>
        <SortButton>MIM borrowed</SortButton>
        <SortButton>APR</SortButton>

        <ChainsDropdown />
      </div>

      <div class="positions-list">
        <CauldronPositionItem
          v-for="cauldron in cauldrons"
          :key="cauldron.id"
          :cauldron="cauldron"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import iconPlus from "@/assets/images/myposition/Icon-Plus.png";
import { getUserOpenPositions } from "@/helpers/cauldron/position/getUserOpenPositions.ts";
import { getUsersTotalAssets } from "@/helpers/cauldron/position/getUsersTotalAssets.ts";
import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";
import MyPositionsInfo from "@/components/myPositions/MyPositionsInfo.vue";
import ChainsDropdown from "@/components/ui/dropdown/ChainsDropdown.vue";
import SortButton from "@/components/ui/buttons/SortButton.vue";

import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier.ts";
const APR_KEY = "abracadabraCauldronsApr";

export default {
  data() {
    return {
      activeNetworks: [1, 56, 250, 43114, 42161, 137, 10],
      activeNetwork: 5,
      updateInterval: null,
      cauldrons: [],
      positionsIsLoading: true,
      totalAssets: null,
      sortKey: "",
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      provider: "getProvider",
      signer: "getSigner",
    }),

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
  },

  watch: {
    async account() {
      await this.createOpenPositions();
    },
  },

  methods: {
    sortByKey(cauldrons, key) {
      if (!key) return cauldrons;

      return cauldrons.sort((cauldronA, cauldronB) => {
        const a = this.getSortKey(cauldronA, key);
        const b = this.getSortKey(cauldronB, key);

        const factor = this.sortOrder ? -1 : 1;
        if (key === "Interest" || key === "APR")
          return a < b ? factor : -factor;
        return a.lt(b) ? factor : -factor;
      });
    },

    async createOpenPositions() {
      if (!this.account) {
        this.positionsIsLoading = false;
        return false;
      }

      this.cauldrons = await getUserOpenPositions(
        this.chainId,
        this.account,
        this.provider
      );
      await this.getCollateralsApr();
      this.totalAssets = getUsersTotalAssets(this.cauldrons);
      this.positionsIsLoading = false;

      this.updateInterval = setInterval(async () => {
        this.cauldrons = await getUserOpenPositions(
          this.chainId,
          this.account,
          this.provider
        );
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
</style>
