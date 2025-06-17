<template>
  <div class="pool-view-wrap">
    <div class="pool-view" v-if="pool">
      <div class="chart-wrap">
        <h5 class="chart-title">Pool composition</h5>
        <PieChart :option="chartOption" title="Pool composition" />
      </div>

      <div class="pool">
        <PoolActionBlock
          :pool="pool"
          :isUserPositionOpen="isUserPositionOpen"
          @updatePoolInfo="refresherInfo.refresher.update()"
          @openPositionPopup="isMyPositionPopupOpened = true"
        />
      </div>

      <div class="pool-position-wrap">
        <PoolPosition
          :pool="pool"
          :isUserPositionOpen="isUserPositionOpen"
          :isMyPositionPopupOpened="isMyPositionPopupOpened"
          @closePopup="isMyPositionPopupOpened = false"
          @updateInfo="refresherInfo.refresher.update()"
          v-if="account"
        />
      </div>
    </div>
    <BaseLoader
      v-else
      :large="true"
      :text="'Loading Pool'"
      :loading="refresherInfo.isLoading"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { getPoolConfig } from "@/helpers/pools/configs/getOrCreatePairsConfigs";
import { getPoolTvlPieChartOption } from "@/helpers/pools/charts/getPoolTvlPieChartOption";
import { dataRefresher } from "@/helpers/dataRefresher";

export default {
  props: {
    id: { type: String, required: true },
    poolChainId: { type: String, required: true },
  },

  data() {
    return {
      pool: null,
      isMyPositionPopupOpened: false,
      chartOption: null,
      poolConfig: null,
      refresherInfo: {
        refresher: null,
        remainingTime: 0,
        isLoading: false,
        intervalTime: 60,
      },
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    showTvlChart() {
      return !!this.pool?.lockInfo;
    },

    isUserPositionOpen() {
      const hasLp = this.pool?.userInfo?.balance > 0n;
      return this.account && hasLp;
    },
  },

  watch: {
    account: {
      immediate: true,
      async handler() {
        if (this.refresherInfo.refresher) {
          this.refresherInfo.refresher.update();
        }
      },
    },

    chainId: {
      immediate: true,
      async handler() {
        if (this.refresherInfo.refresher) {
          this.refresherInfo.refresher.update();
        }
      },
    },
  },

  methods: {
    async fetchPoolData() {
      this.poolConfig = await getPoolConfig(Number(this.poolChainId), this.id);
      const pool = await getPoolInfo(
        Number(this.poolChainId),
        this.poolConfig,
        undefined,
        this.account
      );
      this.chartOption = await getPoolTvlPieChartOption(pool);
      return pool;
    },

    createDataRefresher() {
      this.refresherInfo.refresher = new dataRefresher(
        async () => {
          return await this.fetchPoolData();
        },
        this.refresherInfo.intervalTime,
        (time) => (this.refresherInfo.remainingTime = time),
        (loading) => (this.refresherInfo.isLoading = loading),
        (updatedData) => {
          this.pool = updatedData;
        }
      );
    },
  },

  async created() {
    this.createDataRefresher();
    await this.refresherInfo.refresher.initialize();
  },

  beforeUnmount() {
    if (this.refresherInfo.refresher) {
      this.refresherInfo.refresher.stop();
    }
  },

  components: {
    PoolActionBlock: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolActionBlock.vue")
    ),
    PoolPosition: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/PoolPosition.vue")
    ),
    PieChart: defineAsyncComponent(() =>
      import("@/components/pools/pool/charts/PieChart.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-view-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.pool-view {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  min-height: 100vh;
  padding: 120px 0 40px 0;
  margin: 0 auto;
}

.pool {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 573px;
  padding: 0 20px;
}

.chart-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  min-width: 302px;
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

.chart-title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
}

.pool-position-wrap {
  min-width: 354px;
}

@media (max-width: 1400px) {
  .pool-view {
    flex-direction: column-reverse;
    align-items: center;
    gap: 16px;
  }

  .pool {
    position: static;
    padding: 0;
  }

  .chart-wrap {
    width: 100%;
    max-width: 573px;
  }

  .chart {
    position: static;
    width: 100% !important;
  }
}

@media (max-width: 600px) {
  .pool-view {
    padding: 120px 15px 40px 15px;
  }

  .pool {
    padding: 0;
    width: 100% !important;
  }
}
</style>
