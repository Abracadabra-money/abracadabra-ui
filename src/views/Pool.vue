<template>
  <div class="pool-view" v-if="pool">
    <div class="chart-wrap">
      <PieChart :option="chartOption" v-if="chartOption" />
    </div>

    <div class="pool">
      <PoolActionBlock
        :pool="pool"
        :pointsStatistics="pointsStatistics"
        :isUserPositionOpen="isUserPositionOpen"
        @getPoolInfo="getPoolInfo"
        @openPositionPopup="isMyPositionPopupOpened = true"
        v-if="pointsStatistics"
      />

      <PoolComposition :pool="pool" />
    </div>

    <div class="pool-position-wrap">
      <PoolPosition
        :pool="pool"
        :pointsStatistics="pointsStatistics"
        :isMyPositionPopupOpened="isMyPositionPopupOpened"
        @closePopup="isMyPositionPopupOpened = false"
        @updateInfo="getPoolInfo"
        v-if="isUserPositionOpen && pointsStatistics"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { getPoolTvlPieChartOption } from "@/helpers/pools/charts/getPoolTvlPieChartOption";
import {
  fetchUserPointsStatistics,
  fetchPointsStatistics,
  type PointsStatistics,
} from "@/helpers/blast/stake/points";
import type { PoolInfo } from "@/configs/pools/types";

export default {
  props: {
    id: { type: String },
    poolChainId: { type: String },
  },

  data() {
    return {
      pool: null as PoolInfo | null,
      pointsStatistics: null as {
        user: PointsStatistics;
        global: PointsStatistics;
      } | null,
      isMyPositionPopupOpened: false,
      poolsTimer: null as unknown as NodeJS.Timeout,
      chartOption: null as any,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    isUserPositionOpen(): boolean {
      if (!this.account || !this.pool) return false;

      const isLpBalance = this.pool.userInfo.balance > 0n;

      let isLocked: boolean = false;
      let isUnlocked: boolean = false;

      if (this.pool.lockInfo) {
        isLocked = this.pool.lockInfo.balances.locked > 0n;
        isUnlocked = this.pool.lockInfo.balances.unlocked > 0n;
      }

      return isLpBalance || isLocked || isUnlocked;
    },
  },

  watch: {
    account: {
      immediate: true,
      async handler() {
        await this.getPoolInfo();
        await this.getPointsStatistics();
      },
    },

    chainId: {
      immediate: true,
      async handler() {
        await this.getPoolInfo();
      },
    },
  },

  methods: {
    async getPoolInfo() {
      this.pool = await getPoolInfo(
        Number(this.poolChainId),
        Number(this.id),
        this.account
      );
    },

    async getPointsStatistics() {
      [this.pointsStatistics.global, this.pointsStatistics.user] =
        await Promise.all([
          fetchPointsStatistics(),
          fetchUserPointsStatistics(this.account),
        ]);
    },
  },

  async created() {
    await this.getPoolInfo();
    await this.getPointsStatistics();

    this.chartOption = await getPoolTvlPieChartOption(this.pool);

    this.poolsTimer = setInterval(async () => {
      await this.getPoolInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.poolsTimer);
  },

  components: {
    PoolActionBlock: defineAsyncComponent(
      () => import("@/components/pools/pool/PoolActionBlock.vue")
    ),
    PoolComposition: defineAsyncComponent(
      () => import("@/components/pools/pool/PoolComposition.vue")
    ),
    PoolPosition: defineAsyncComponent(
      () => import("@/components/pools/pool/position/PoolPosition.vue")
    ),
    PieChart: defineAsyncComponent(
      () => import("@/components/pools/pool/charts/PieChart.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
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
  padding: 0 20px;
  width: 583px;
}

.chart-wrap {
  margin-top: 129px;
  min-width: 302px;
}

.chart {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
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
  }

  .chart-wrap {
    padding: 0 20px;
    margin-top: 0;
    width: 100%;
    max-width: 583px;
  }

  .chart {
    position: static;
    width: 100% !important;
  }
}

@media (max-width: 600px) {
  .pool-wrap {
    padding: 30px;
  }

  .pool {
    padding: 0 15px;
    width: 100% !important;
  }
}
</style>
