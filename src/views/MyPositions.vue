<template>
  <div class="position-page">
    <h2 class="title">My positions</h2>

    <div class="network-wrap">
      <h4 class="network-title">Choose Chain</h4>
      <NetworksList :items="5" :activeList="activeNetworks" />
    </div>

    <TotalAssets
      v-if="account && !cauldronsLoading && !farmLoading"
      :assets="totalAssets"
    />

    <BentoBoxBlock v-if="isHideBentoBoxBlock" :bentoInfo="bentoBoxConfig" />

    <h2 class="title">Individual positions</h2>

    <div v-if="isEmpyState" class="empty-wrap">
      <EmptyState />
    </div>

    <div v-else class="positions-list">
      <div v-if="isPositionsLoaded" class="loader-wrap">
        <BaseLoader />
      </div>

      <template v-else>
        <PositionList
          v-if="openUserCauldrons.length"
          :cauldrons="openUserCauldrons"
        />

        <PositionList
          v-if="openUserFarms.length"
          :isFarm="true"
          :cauldrons="openUserFarms"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import farmMixin from "@/mixins/farmPools";
import bentoBoxMixin from "@/mixins/mimBentoDeposit";
import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
import NetworksList from "@/components/ui/NetworksList.vue";
import TotalAssets from "@/components/myPositions/TotalAssets.vue";
import BentoBoxBlock from "@/components/myPositions/BentoBoxBlock.vue";
import EmptyState from "@/components/myPositions/EmptyState.vue";
import PositionList from "@/components/myPositions/PositionList.vue";
import BaseLoader from "@/components/base/BaseLoader.vue";

export default {
  mixins: [bentoBoxMixin, farmMixin, cauldronsMixin],

  data() {
    return {
      activeNetworks: [1, 56, 250, 43114, 42161, 137, 10],
      bentoUpdateInterval: null,
      farmUpdateInterval: null,
      cauldronsUpdateInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      cauldronPools: "getPools",
      cauldronsLoading: "getLoadPoolsBorrow",
      farmLoading: "getFarmPoolLoading",
      bentoBoxConfig: "getMimInBentoDepositObject",
    }),

    isEmpyState() {
      return (
        !this.account ||
        (!this.openUserCauldrons.length &&
          !this.openUserFarms.length &&
          !this.cauldronsLoading &&
          !this.farmLoading)
      );
    },

    isPositionsLoaded() {
      return (
        (this.farmLoading && !this.openUserFarms.length) ||
        (this.cauldronsLoading && !this.openUserCauldrons.length)
      );
    },

    totalAssets() {
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
          value: filters.formatUSD(
            this.openUserCauldrons.reduce((calc, pool) => {
              return (
                calc +
                parseFloat(
                  (pool.userInfo.userCollateralShare * 1) /
                    pool.borrowToken.exchangeRate
                )
              );
            }, 0)
          ),
        },
        {
          title: "MIM Borrowed",
          value: filters.formatTokenBalance(
            this.openUserCauldrons.reduce((calc, pool) => {
              return calc + parseFloat(pool.userInfo.userBorrowPart);
            }, 0)
          ),
        },
        {
          title: "SPELL Farmed",
          value: spellFarmer,
          routName: "Farm",
          hidden: spellFarmer === "0.0",
        },
      ].filter((item) => !item.hidden);
    },

    openUserCauldrons() {
      return this.cauldronPools.filter((cauldron) => {
        if (!cauldron.userInfo) return false;
        const tokenInUsd =
          cauldron.userInfo.userCollateralShare /
          cauldron.borrowToken.exchangeRate;
        if (tokenInUsd < 3) return false;
        return (
          cauldron.userBorrowPart !== "0.0" &&
          cauldron.userInfo.userCollateralShare !== "0.0"
        );
      });
    },

    openUserFarms() {
      return this.pools.filter((farm) => {
        return (
          !farm.accountInfo?.userReward.isZero() ||
          !farm.accountInfo?.userInfo.amount.isZero()
        );
      });
    },

    isHideBentoBoxBlock() {
      return (
        this.bentoBoxConfig &&
        +this.bentoBoxConfig?.mimInBentoBalance &&
        +this.bentoBoxConfig?.mimInDegenBalance &&
        this.account
      );
    },
  },

  async created() {
    if (!this.pools.length) {
      await this.createFarmPools();
    }

    this.farmUpdateInterval = setInterval(async () => {
      await this.createFarmPools();
    }, 10000);

    this.cauldronsUpdateInterval = setInterval(async () => {
      await this.createPools();
    }, 10000);

    await this.createMimBentoInfo();
    this.bentoUpdateInterval = setInterval(async () => {
      await this.createMimBentoInfo();
    }, 5000);
  },

  beforeUnmount() {
    clearInterval(this.farmUpdateInterval);
    clearInterval(this.bentoUpdateInterval);
    clearInterval(this.cauldronsUpdateInterval);
  },

  components: {
    NetworksList,
    TotalAssets,
    BentoBoxBlock,
    EmptyState,
    PositionList,
    BaseLoader,
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

@media (max-width: 1024px) {
  .network-wrap {
    padding: 20px 16px;
  }
}
</style>
