<template>
  <div class="pool-view">
    <div class="pool" v-if="pool">
      <PoolActionBlock
        :pool="pool"
        :isUserPositionOpen="isUserPositionOpen"
        @getPoolInfo="getPoolInfo"
        @openPositionPopup="isMyPositionPopupOpened = true"
      />

      <PoolComposition :pool="this.pool" />

      <PoolPosition
        :pool="pool"
        :isMyPositionPopupOpened="isMyPositionPopupOpened"
        @closePopup="isMyPositionPopupOpened = false"
        @updateInfo="getPoolInfo"
        v-if="isUserPositionOpen && account"
      />

      <div class="chart-wrap" v-if="pool">
        <PieChart :option="chartOption" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
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
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    isUserPositionOpen() {
      return this.pool?.userInfo?.balance > 0n;
    },

    chartOption() {
      return getPoolTvlPieChartOption(this.pool);
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
        Number(this.id),
        this.account
      );
      console.log({ pool: this.pool });
    },
  },

  async created() {
    await this.getPoolInfo();
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
    PoolComposition: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolComposition.vue")
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
  padding: 0 30px;
  width: 593px;
}

.chart-wrap {
  position: absolute;
  top: 129px;
  left: -302px;
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

@media (max-width: 1300px) {
  .pool {
    position: static;
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
