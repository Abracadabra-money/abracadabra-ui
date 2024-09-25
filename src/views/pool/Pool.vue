<template>
  <div class="pool-view" v-if="pool">
    <div class="chart-wrap">
      <h5 class="chart-title">Pool composition</h5>
      <PieChart :option="chartOption" title="Pool composition" />
    </div>

    <div class="pool">
      <PoolActionBlock
        :pool="pool"
        :isUserPositionOpen="isUserPositionOpen"
        @getPoolInfo="getPoolInfo"
        @openPositionPopup="isMyPositionPopupOpened = true"
      />
    </div>

    <div class="pool-position-wrap">
      <PoolPosition
        :pool="pool"
        :isMyPositionPopupOpened="isMyPositionPopupOpened"
        @closePopup="isMyPositionPopupOpened = false"
        @updateInfo="getPoolInfo"
        v-if="isUserPositionOpen && pool"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { getPoolConfig } from "@/helpers/pools/getPoolConfigs";
import { getPoolTvlPieChartOption } from "@/helpers/pools/charts/getPoolTvlPieChartOption";

export default {
  props: {
    id: { type: String },
    poolChainId: { type: String },
  },

  data() {
    return {
      pool: null,
      isMyPositionPopupOpened: false,
      poolsTimer: null,
      chartOption: null,
      poolConfig: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    isUserPositionOpen() {
      const hasLp = this.pool?.userInfo?.balance > 0n;
      const hasLocked = this.pool?.lockInfo?.balances.locked > 0n;
      const hasUnlocked = this.pool?.lockInfo?.balances.unlocked > 0n;
      const hasStaked = this.pool?.stakeInfo?.balance > 0n;

      return this.account && (hasLp || hasLocked || hasUnlocked || hasStaked);
    },
  },

  watch: {
    account: {
      immediate: true,
      async handler() {
        await this.getPoolInfo();
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
        this.poolConfig,
        this.account
      );
    },
  },

  async created() {
    this.poolConfig = await getPoolConfig(Number(this.poolChainId), this.id);

    await this.getPoolInfo();
    console.log(this.pool);

    this.chartOption = await getPoolTvlPieChartOption(this.pool);

    this.poolsTimer = setInterval(async () => {
      await this.getPoolInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.poolsTimer);
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
  width: 533px;
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
    max-width: 543px;
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
