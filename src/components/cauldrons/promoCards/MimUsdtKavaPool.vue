<template>
  <router-link class="pool-card" :to="goToPage">
    <div class="primary paragraph">
      <span class="card-title">BOOSTED RETURNS</span>
      <div class="apr-line">
        <span class="apr-text">{{ apr }} Staking APR in</span>

        <div class="token-icons">
          <BaseTokenIcon
            class="base"
            :icon="rewardTokens[0].icon"
            :name="rewardTokens[0].name"
            size="24px"
          />
        </div>
      </div>
      <span class="token-pair">MIM / USDT Pool</span>
    </div>

    <p class="promo-text">
      Stake now on <SwapLogoIcon :width="24" :height="20" /> MIMSwap
    </p>
  </router-link>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import type { PoolConfig } from "@/configs/pools/types";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { getPoolConfig } from "@/helpers/pools/configs/getOrCreatePairsConfigs";
import { formatPercent, formatLargeSum } from "@/helpers/filters";

const POOL_CHAIN_ID = 2222;
const POOL_ID = "0x10C9FCDa1655b7A55250AdCEe06f0B6e83F473c1";

export default {
  data() {
    return {
      apr: "",
      pool: null as any,
      poolConfig: null as PoolConfig | null,
    };
  },

  computed: {
    rewardTokens() {
      return [
        {
          name: "KAVA",
          icon: useImage("assets/images/tokens/KAVA.png"),
        },
      ];
    },

    goToPage() {
      return {
        name: "Pool",
        params: {
          id: POOL_ID,
          poolChainId: POOL_CHAIN_ID,
        },
      };
    },
  },

  methods: {
    formatLargeSum,

    async fetchData() {
      if (!this.poolConfig) return;
      this.pool = await getPoolInfo(POOL_CHAIN_ID, this.poolConfig);
      this.apr = formatPercent(this.pool.poolAPR.totalApr);
    },
  },

  async created() {
    this.poolConfig = await getPoolConfig(Number(POOL_CHAIN_ID), POOL_ID);
    await this.fetchData();
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    SwapLogoIcon: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/ui/icons/SwapLogoIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 10px 20px;
  height: 160px;
  max-width: 416px;
  width: 100%;
  background-image: url("@/assets/images/pools/kava-promo-card-bg.png");
  border-radius: 16px;
  border: 1px solid rgba(107, 3, 0, 0.12);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  background-repeat: no-repeat;
  background-size: cover;
  text-transform: uppercase;
  font-weight: 600;
  transition: 0.3s;
  color: #fff;
}

.pool-card:hover {
  border: 1px solid #526fbc;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06),
    0px 4px 32px 0px rgba(103, 103, 103, 0.21);
}

.primary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-title {
  font-size: 24px;
}

.token-pair {
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
}

.apr-line {
  display: flex;
  align-items: center;
  gap: 3px;
  color: rgba(255, 188, 1, 1);
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
}

.token-icons {
  display: flex;
  align-items: center;
}

.base {
  border-radius: 8px;
  border: 1px solid #182365;
}

.quote {
  border-radius: 8px;
  border: 1px solid #182365;
  margin-left: -18px;
}

.promo-text {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media screen and (max-width: 1024px) {
  .pool-card {
    max-width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .pool-card {
    padding: 12px;
    height: 140px;
  }

  .card-title {
    font-size: 20px;
  }
}
</style>
