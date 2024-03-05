<template>
  <div class="pools-page">
    <div class="pools-container">
      <PoolsInfo />

      <UsersPools :usersPools="usersPools" v-if="usersPools" />

      <PoolsTable
        :pools="pools"
        :poolsLoading="poolsLoading"
        :tableKeys="tableKeys"
        @openMobileFiltersPopup="openMobileFiltersPopup"
        ref="poolsTable"
      />
    </div>

    <FiltersPopup
      v-if="isFiltersPopupOpened"
      :sortersData="tableKeys.slice(1)"
      @updateSortKey="$refs.poolsTable.updateSortKeys"
      @close="isFiltersPopupOpened = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getPoolsList } from "@/helpers/pools/getPoolsList";

export default {
  data() {
    return {
      pools: [],
      poolsLoading: true,
      updateInterval: null,
      isFiltersPopupOpened: false,
      tableKeys: [
        {
          tableKey: "Token pair",
        },
        {
          tableKey: "TVL",
          tooltip: "Total Value Locked.",
        },
        {
          tableKey: "Fees 1d",
          tooltip: "Fees 1d.",
        },
        {
          tableKey: "Volume 1d",
          tooltip: "Volume 1d.",
        },
        {
          tableKey: "Fees 7d",
          tooltip: "Fees 7d.",
        },
        {
          tableKey: "Volume 7d",
          tooltip: "Volume 7d.",
        },
        {
          tableKey: "APR",
          tooltip: "Annualised Percentage Return Range.",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    usersPools() {
      return this.pools.filter((pool) => pool.userPosition);
    },
  },

  methods: {
    async createPoolsList() {
      this.pools = await getPoolsList();
      this.poolsLoading = false;
      this.updateInterval = setInterval(async () => {
        this.pools = await getPoolsList();
      }, 60000);
    },

    openMobileFiltersPopup() {
      this.isFiltersPopupOpened = true;
    },

    updateSortKeys(key, order) {
      this.$refs.poolsTable.updateSortKeys(key, order);
    },
  },

  async created() {
    await this.createPoolsList();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    PoolsInfo: defineAsyncComponent(() =>
      import("@/components/pools/PoolsInfo.vue")
    ),
    PoolsTable: defineAsyncComponent(() =>
      import("@/components/pools/table/PoolsTable.vue")
    ),
    PoolsCarousel: defineAsyncComponent(() =>
      import("@/components/ui/carousel/PoolsCarousel.vue")
    ),
    FiltersPopup: defineAsyncComponent(() =>
      import("@/components/myPositions/FiltersPopup.vue")
    ),
    UsersPools: defineAsyncComponent(() =>
      import("@/components/pools/UsersPools.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pools-page {
  min-height: 100vh;
  width: 100%;
  height: 100%;
}

.pools-container {
  padding: 125px 15px 100px;
  max-width: 1310px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;
}

.subtitle {
  display: flex;
  gap: 4px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  line-height: 150%;
}

.mim-icon {
  width: 24px;
  height: 24px;
}

@media screen and (max-width: 768px) {
  .pools-container {
    padding: 100px 12px 60px;
    gap: 16px;
  }
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 24px;
  }

  .subtitle {
    align-items: flex-start;
    font-size: 14px;
  }

  .mim-icon {
    width: 16px;
    height: 16px;
  }

  .farm-title {
    font-size: 20px;
  }
}
</style>
