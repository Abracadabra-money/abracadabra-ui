<template>
  <div class="my-positions-view">
    <div class="position-page">
      <MyPositionsInfo />

      <div class="positions-list-head">
        <SortButton>Health factor</SortButton>
        <SortButton>Collateral deposited</SortButton>
        <SortButton>MIM borrowed</SortButton>
        <SortButton>APR</SortButton>

        <ChainsDropdown />
      </div>

      <div class="positions-list">
        <CauldronPositionItem />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import iconPlus from "@/assets/images/myposition/Icon-Plus.png";
import iconMinus from "@/assets/images/myposition/Icon-Minus.png";
import { getFarmsList } from "@/helpers/farm/list/getFarmsList";
import { getUserOpenPositions } from "@/helpers/cauldron/position/getUserOpenPositions.ts";
import { getUsersTotalAssets } from "@/helpers/cauldron/position/getUsersTotalAssets.ts";
import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";
import FarmPositionItem from "@/components/myPositions/FarmPositionItem.vue";

import MyPositionsInfo from "@/components/myPositions/MyPositionsInfo.vue";
import ChainsDropdown from "@/components/ui/dropdown/ChainsDropdown.vue";
import SortButton from "@/components/ui/buttons/SortButton.vue";

export default {
  data() {
    return {
      activeNetworks: [1, 56, 250, 43114, 42161, 137, 10],
      activeNetwork: 5,
      updateInterval: null,
      isShowMore: false,
      positionList: [],
      positionsIsLoading: true,
      farmIsLoading: true,
      totalAssets: null,
      farms: [],
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      provider: "getProvider",
      signer: "getSigner",
    }),

    showTotalAssets() {
      return this.account && !this.positionsIsLoading;
    },

    isEmpyState() {
      return (
        !this.account ||
        (!this.positionList.length &&
          !this.openUserFarms.length &&
          !this.positionsIsLoading &&
          !this.farmIsLoading)
      );
    },

    isPositionsLoaded() {
      return (
        (this.farmIsLoading && !this.openUserFarms.length) ||
        (this.positionsIsLoading && !this.positionList.length)
      );
    },

    totalAssetsData() {
      const spellFarmer = filters.formatTokenBalance(
        this.openUserFarms.reduce((calc, pool) => {
          return calc + +pool.accountInfo.userReward;
        }, 0)
      );

      return [
        {
          title: "Collateral Deposit",
          value: filters.formatUSD(this.totalAssets.collateralDepositedInUsd),
        },
        {
          title: "MIM Borrowed",
          value: filters.formatTokenBalance(this.totalAssets.mimBorrowed),
        },
        {
          title: "SPELL Farmed",
          value: spellFarmer,
          routeName: "Farm",
          hidden: spellFarmer === "0.0",
        },
      ].filter((item) => !item.hidden);
    },

    openUserFarms() {
      return this.farms.filter((farm) => {
        const isOpenMultiReward = farm.isMultiReward
          ? +farm.accountInfo.depositedBalance > 0 ||
          farm.accountInfo.rewardTokensInfo.filter((item) => +item.earned > 0)
            .length > 0
          : false;

        const isOpenLegacyFarm =
          farm.accountInfo?.userReward != 0 ||
          farm.accountInfo?.userInfo.amount != 0;

        return farm.isMultiReward ? isOpenMultiReward : isOpenLegacyFarm;
      });
    },

    showMoreIcon() {
      return this.isShowMore ? iconMinus : iconPlus;
    },

    showMoreText() {
      return this.isShowMore ? "less" : "more";
    },
  },

  watch: {
    async account() {
      await this.createOpenPositions();
    },
  },

  methods: {
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },

    async createOpenPositions() {
      if (!this.account) {
        this.positionsIsLoading = false;
        return false;
      }

      this.positionList = await getUserOpenPositions(
        this.chainId,
        this.account,
        this.provider
      );

      this.totalAssets = getUsersTotalAssets(this.positionList);
      this.positionsIsLoading = false;

      this.farms = await getFarmsList(this.chainId, this.signer);
      this.farmIsLoading = false;

      this.updateInterval = setInterval(async () => {
        this.positionList = await getUserOpenPositions(
          this.chainId,
          this.account,
          this.provider
        );

        this.totalAssets = getUsersTotalAssets(this.positionList);

        this.farms = await getFarmsList(this.chainId, this.signer);
      }, 60000);
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
    FarmPositionItem,

    MyPositionsInfo,
    ChainsDropdown,
    SortButton,
  },
};
</script>

<style lang="scss" scoped>
.my-positions-view {
  display: flex;
  justify-content: center;
  width: 100%;
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
  width: 100%;
  padding: 12px 24px;
  margin-bottom: 20px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.positions-list {
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: 24px;
}

.position-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
