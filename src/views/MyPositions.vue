<template>
  <div class="position-page">
    <h2 class="title">My positions</h2>

    <div class="network-wrap">
      <h4 class="network-title">Choose Chain</h4>
      <NetworksList :items="activeNetwork" :activeList="activeNetworks" />
    </div>

    <TotalAssets v-if="showTotalAssets" :assets="totalAssetsData" />

    <BentoBoxBlock />

    <h2 class="title">Individual positions</h2>

    <div v-if="isEmpyState" class="empty-wrap">
      <EmptyState />
    </div>

    <div v-else class="positions-list">
      <div v-if="isPositionsLoaded" class="loader-wrap">
        <BaseLoader />
      </div>

      <template v-else>
        <div class="positions-wrap" v-if="positionList.length">
          <div class="positions-header">
            <p>Borrow</p>
            <button class="btn-more" @click="toggleShowMore">
              <p class="btn-more-text">Show {{ showMoreText }}</p>
              <img class="btn-more-icon" :src="showMoreIcon" alt="Show more" />
            </button>
          </div>

          <div class="position-list">
            <CauldronPositionItem
              v-for="cauldron in positionList"
              :key="cauldron.id"
              :opened="isShowMore"
              :cauldron="cauldron"
            />
          </div>
        </div>

        <div class="positions-wrap" v-if="openUserFarms.length">
          <div class="positions-header">Farm</div>
          <div class="position-list">
            <FarmPositionItem
              v-for="farm in openUserFarms"
              :key="farm.id"
              :opened="isShowMore"
              :farmConfig="farm"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import farmMixin from "@/mixins/farmPools";
import iconPlus from "@/assets/images/myposition/Icon-Plus.png";
import iconMinus from "@/assets/images/myposition/Icon-Minus.png";
import { getUserPositions } from "@/helpers/cauldron/position/getUserPositions.ts";
import { getUsersTotalAssets } from "@/helpers/cauldron/position/getUsersTotalAssets.ts";
import NetworksList from "@/components/ui/NetworksList.vue";
import TotalAssets from "@/components/myPositions/TotalAssets.vue";
import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";
import EmptyState from "@/components/myPositions/EmptyState.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";
import FarmPositionItem from "@/components/myPositions/FarmPositionItem.vue";

export default {
  mixins: [farmMixin],

  data() {
    return {
      activeNetworks: [1, 56, 250, 43114, 42161, 137, 10],
      activeNetwork: 5,
      updateInterval: null,
      isShowMore: false,
      positionList: [],
      positionsIsLoading: true,
      totalAssets: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      provider: "getProvider",
      farmIsLoading: "getFarmPoolLoading",
    }),

    showTotalAssets() {
      return this.account && !this.positionsIsLoading && !this.farmIsLoading;
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
          return (
            calc + +this.$ethers.utils.formatEther(pool.accountInfo.userReward)
          );
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
      return this.pools.filter((farm) => {
        return (
          !farm.accountInfo?.userReward.isZero() ||
          !farm.accountInfo?.userInfo.amount.isZero()
        );
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

      this.positionList = await getUserPositions(
        this.chainId,
        this.account,
        this.provider
      );

      this.totalAssets = getUsersTotalAssets(this.positionList);
      this.positionsIsLoading = false;

      if (!this.pools.length) await this.createFarmPools();

      this.updateInterval = setInterval(async () => {
        this.positionList = await getUserPositions(
          this.chainId,
          this.account,
          this.provider
        );

        this.totalAssets = getUsersTotalAssets(this.positionList);

        await this.createFarmPools();
      }, 10000);
    },
  },

  async created() {
    await this.createOpenPositions();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    TotalAssets,
    BentoBoxBlock,
    EmptyState,
    BaseLoader,
    CauldronPositionItem,
    FarmPositionItem,
  },
};
</script>

<style lang="scss" scoped>
.position-page {
  max-width: 780px;
  width: 100%;
  margin: 0 auto;
  padding: 130px 5px 160px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  text-align: center;
  text-transform: uppercase;
  margin: 16px 0;
}

.network-wrap {
  overflow: hidden;
  width: 100%;
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
}

.network-title {
  padding-bottom: 14px;
}

.empty-wrap {
  background-color: #2a2835;
  border-radius: 30px;
  padding: 50px 0;
}

.positions-list {
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: 24px;
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.positions-wrap {
  background: #2a2835;
  border-radius: 30px;
  padding: 20px;
}

.positions-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.btn-more {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.btn-more-text {
  font-size: 14px;
  line-height: 21px;
  background: linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.btn-more-icon {
  width: 20px;
  height: auto;
  object-fit: contain;
  margin-left: 8px;
}

.position-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 1024px) {
  .network-wrap {
    padding: 20px 16px;
  }
}

@media screen and (max-width: 600px) {
  .positions-wrap {
    padding: 20px 10px;
  }
}
</style>
