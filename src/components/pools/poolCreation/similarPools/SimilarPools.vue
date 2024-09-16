<template>
  <div class="similar-pools-wrap">
    <h3 class="similar-pools-title">Pools similar to yours</h3>

    <div class="similar-pools">
      <PoolItem
        :pool="pool"
        v-for="(pool, index) in similarPools"
        :key="index"
      />
      <EmptyState v-for="i in 3 - similarPools.length" :key="i" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import poolsConfig from "@/configs/pools/pools";
import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import { createSimilarPoolsInfo } from "@/helpers/pools/poolCreation/createSimilarPoolsInfo";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { PoolConfig } from "@/configs/pools/types";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { debounce } from "lodash";

export default {
  props: {
    tokensSelected: { type: Boolean, default: false },
    tokens: {
      type: Object as PropType<{
        baseToken: PoolCreationTokenInfo;
        quoteToken: PoolCreationTokenInfo;
      }>,
      required: true,
    },
    actionConfig: {
      type: Object as PropType<ActionConfig>,
      required: true,
    },
    chainId: { type: Number, default: ARBITRUM_CHAIN_ID },
  },

  data() {
    return {
      similarPools: [] as unknown as MagicLPInfo[],
    };
  },

  watch: {
    actionConfig: {
      async handler() {
        const { K, lpFeeRate } = this.actionConfig;
        if (this.tokensSelected && K > 0n && lpFeeRate > 0n)
          await this.createSimilarPoolsInfo();
      },
      deep: true,
    },
  },

  methods: {
    createSimilarPoolsInfo: debounce(async function (this: any) {
      this.similarPools = await createSimilarPoolsInfo(
        this.actionConfig,
        this.chainId
      );
    }, 500),

    async getSimilarPools() {
      const similarPoolsConfigs = poolsConfig.filter((config) =>
        this.checkPoolSimilarity(config)
      );

      this.similarPools = await Promise.all(
        similarPoolsConfigs.map(
          async (config) => await getLpInfo(config, config.chainId)
        )
      );
    },

    checkPoolSimilarity(poolConfig: PoolConfig) {
      const baseTokenSymbol =
        this.tokens.baseToken.config.symbol.toLocaleLowerCase();
      const quoteTokenSymbol =
        this.tokens.quoteToken.config.symbol.toLocaleLowerCase();

      const currentK = this.actionConfig.K;
      const currentFeeRate = this.actionConfig.lpFeeRate;

      const {
        name,
        initialParameters: { K, lpFeeRate },
      } = poolConfig;

      const isTokensCompoundSimilar =
        name.toLocaleLowerCase().includes(baseTokenSymbol) &&
        name.toLocaleLowerCase().includes(quoteTokenSymbol);

      const isFeeRateSimilar = currentFeeRate == lpFeeRate;

      const isKSimilar = this.checkKSimilarity(currentK, K);

      return isTokensCompoundSimilar && isFeeRateSimilar && isKSimilar;
    },

    checkKSimilarity(
      current: bigint,
      toCompare: bigint,
      dispersionPercentage = 20n
    ) {
      const dispersion = (current * dispersionPercentage) / 100n;
      return (
        current - dispersion <= toCompare && current + dispersion >= toCompare
      );
    },
  },

  components: {
    EmptyState: defineAsyncComponent(
      () =>
        import("@/components/pools/poolCreation/similarPools/EmptyState.vue")
    ),
    PoolItem: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/similarPools/PoolItem.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.similar-pools-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.similar-pools-title {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.similar-pools {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
