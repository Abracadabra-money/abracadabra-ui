<template>
  <div class="my-position-view">
    <h2 class="title page-title">My positions</h2>
    <div class="choose">
      <h4 class="choose-title">Choose Chain</h4>
      <NetworksList :items="5" :activeList="activeNetworks" />
    </div>

    <div class="values-list" v-if="account && !borrowLoading && !farmLoading">
      <div v-for="(item, i) in balanceItems" :key="i" class="values-list-item">
        <p class="values-list-title">{{ item.title }}</p>
        <p class="values-list-value">{{ item.value }}</p>
      </div>
    </div>
    <BalanceBoxes
      v-if="mimInBentoDepositObject"
      :infoObject="mimInBentoDepositObject"
    />
    <h2 class="title">Specific positions</h2>
    <div
      v-if="
        !account ||
        (!borrowPools.length && !pools.length && !borrowLoading && !farmLoading)
      "
      class="empty-wrap"
    >
      <EmptyPosList />
    </div>
    <div v-else class="spec-positions">
      <div
        v-if="
          (farmLoading && !pools.length) ||
          (borrowLoading && !borrowPools.length)
        "
        class="loader-wrap"
      >
        <BaseLoader />
      </div>

      <template v-else>
        <SpecPos v-if="userBorrowPools.length" :pools="userBorrowPools" />
        <SpecPos
          v-if="userFarmPools.length"
          :isFarm="true"
          :pools="userFarmPools"
        />
      </template>
    </div>
  </div>
</template>

<script>
import farmPoolsMixin from "@/mixins/farmPools";

const NetworksList = () => import("@/components/ui/NetworksList");
const BalanceBoxes = () => import("@/components/myPositions/BalanceBoxes");
const SpecPos = () => import("@/components/myPositions/SpecPos");
const BaseLoader = () => import("@/components/base/BaseLoader");
import mimBentoDeposit from "@/mixins/mimBentoDeposit";
import borrowPoolsMixin from "@/mixins/borrow/borrowPools.js";
import { mapGetters } from "vuex";

const EmptyPosList = () => import("@/components/myPositions/EmptyPosList");

export default {
  mixins: [mimBentoDeposit, farmPoolsMixin, borrowPoolsMixin],
  data: () => ({
    activeNetworks: [1, 56, 250, 43114, 42161, 137],

    mimBentoInterval: null,
    farmPoolsTimer: null,
    borrowPoolsTimer: null,
  }),

  computed: {
    ...mapGetters({
      borrowPools: "getPools",
      borrowLoading: "getLoadPoolsBorrow",
      farmLoading: "getFarmPoolLoading",
      account: "getAccount",
    }),
    balanceItems() {
      return [
        {
          title: "Collateral Deposit",
          value: `${this.userBorrowPools
            .reduce((calc, pool) => {
              return calc + parseFloat(pool.userInfo.userCollateralShare);
            }, 0)
            .toFixed(2)} $`,
        },
        {
          title: "MIM Borrowed",
          value: `${this.userBorrowPools
            .reduce((calc, pool) => {
              return calc + parseFloat(pool.userInfo.userBorrowPart);
            }, 0)
            .toFixed(2)} $`,
        },
        {
          title: "Yield Generated",
          value: this.userFarmPools.reduce((calc, pool) => {
            return calc + parseFloat(pool.accountInfo.userReward);
          }, 0),
        },
      ];
    },
    mimInBentoDepositObject() {
      return this.$store.getters.getMimInBentoDepositObject;
    },
    userBorrowPools() {
      return this.borrowPools.filter((pool) => {
        if (!pool.userInfo) return false;
        const tokenInUsd = pool.userInfo.userCollateralShare / pool.tokenPrice;
        if (tokenInUsd < 3) return false;
        return (
          pool.userBorrowPart !== "0.0" &&
          pool.userInfo.userCollateralShare !== "0.0"
        );
      });
    },
    userFarmPools() {
      return this.pools.filter((pool) => {
        return (
          !pool.accountInfo?.userReward.isZero() ||
          !pool.accountInfo?.userInfo.amount.isZero()
        );
      });
    },
  },

  components: {
    EmptyPosList,
    SpecPos,
    NetworksList,
    BalanceBoxes,
    BaseLoader,
  },
  async created() {
    if (!this.pools.length) {
      await this.createFarmPools();
    }

    this.farmPoolsTimer = setInterval(async () => {
      await this.createFarmPools();
    }, 10000);

    this.borrowPoolsTimer = setInterval(async () => {
      await this.createPools();
    }, 10000);

    await this.createMimBentoInfo();
    this.mimBentoInterval = setInterval(async () => {
      await this.createMimBentoInfo();
    }, 5000);
  },

  beforeDestroy() {
    clearInterval(this.farmPoolsTimer);
    clearInterval(this.mimBentoInterval);
    clearInterval(this.borrowPoolsTimer);
  },
};
</script>

<style lang="scss" scoped>
.my-position-view {
  padding-top: 160px;
  margin: 0 auto;
  width: 780px;
  max-width: 100%;
  box-sizing: border-box;
  padding-bottom: 207px;
}

.title {
  text-align: center;
  text-transform: uppercase;
  margin: 32px 0 32px 0;

  &.page-title {
    margin-top: 0;
  }
}

.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  margin-top: 40px;

  &-title {
    padding-bottom: 14px;
  }
}

.values-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
  row-gap: 33px;
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  margin-top: 16px;

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    line-height: 27px;
  }

  &-title {
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
  }

  &-value {
    font-weight: 700;
  }
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spec-positions {
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: 24px;
  margin-top: 40px;
}

.empty-wrap {
  background-color: #2a2835;
  border-radius: 30px;
  padding: 16px 0 50px 0;
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
  .values-list {
    padding: 18px 40px 15px 20px;
  }
}
</style>
