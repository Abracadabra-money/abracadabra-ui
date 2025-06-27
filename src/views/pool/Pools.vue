<template>
  <div class="pools-page" id="pools-page" v-if="pools">
    <div class="pools-container">
      <PoolsInfo :pools="pools" />

      <PoolsTable :pools="pools" :poolsLoading="refresherInfo.isLoading" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import type { PoolConfig } from "@/configs/pools/types";
import { getPoolsList } from "@/helpers/pools/getPoolsList";
import { getPoolConfigsByChains } from "@/helpers/pools/configs/getOrCreatePairsConfigs";
import { dataRefresher } from "@/helpers/dataRefresher";
import type { RefresherInfo } from "@/helpers/dataRefresher";

export default {
  data() {
    return {
      pools: [] as any[],
      poolsLoading: true,
      poolConfigs: [] as PoolConfig[],
      refresherInfo: {
        refresher: null as unknown as dataRefresher<any[]>,
        remainingTime: 0,
        isLoading: false,
        intervalTime: 60,
      } as RefresherInfo<any[]>,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      localPoolsList: "getPoolsList",
    }),
  },

  watch: {
    account() {
      this.createOrUpdateInfo();
    },
    chainId() {
      this.createOrUpdateInfo();
    },

    pools: {
      handler() {
        if (this.pools) this.setPoolsList(this.pools);
      },
      deep: true,
    },
  },

  methods: {
    ...mapMutations({
      setPoolsList: "setPoolsList",
    }),

    checkLocalData(): void {
      if (this.localPoolsList.isCreated) {
        this.pools = this.localPoolsList.data;
        this.poolsLoading = false;
      }
    },

    async fetchPoolsData() {
      this.poolConfigs = await getPoolConfigsByChains();
      const pools = await getPoolsList(this.account, this.poolConfigs);
      return pools;
    },

    async createOrUpdateInfo() {
      const refresher = this.refresherInfo?.refresher;
      try {
        if (!refresher) {
          this.createDataRefresher();
          await this.refresherInfo.refresher.start();
        } else {
          await refresher.manualUpdate();
        }
      } catch (error) {
        console.error("Error creating or updating Pools info:", error);
      }
    },

    createDataRefresher() {
      this.refresherInfo.refresher = new dataRefresher<any[]>(
        async () => {
          return await this.fetchPoolsData();
        },
        this.refresherInfo.intervalTime,
        (time) => (this.refresherInfo.remainingTime = time),
        (loading) => (this.refresherInfo.isLoading = loading),
        (updatedData: any[]) => {
          this.pools = updatedData;
          this.poolsLoading = false;
        }
      );
    },
  },

  async created() {
    this.checkLocalData();
    await this.createOrUpdateInfo();
  },

  beforeUnmount() {
    if (this.refresherInfo.refresher) {
      this.refresherInfo.refresher.stop();
    }
  },

  components: {
    PoolsInfo: defineAsyncComponent(
      () => import("@/components/pools/PoolsInfo.vue")
    ),
    PoolsTable: defineAsyncComponent(
      () => import("@/components/pools/table/pools/PoolsTable.vue")
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
}

@media screen and (max-width: 768px) {
  .pools-container {
    padding: 100px 12px 60px;
    gap: 16px;
  }
}
</style>
