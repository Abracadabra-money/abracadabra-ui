<template>
  <div class="similar-pools-wrap">
    <h3 class="similar-pools-title">Pools similar to yours</h3>

    <div class="similar-pools">
      <EmptyState v-if="!tokensSelected || similarPools.length <= 0" />

      <PoolItem
        :pool="pool"
        v-for="(pool, index) in similarPools"
        :key="index"
        v-else
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import poolsConfig from "@/configs/pools/pools";
import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";

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
  },

  data() {
    return {
      similarPools: [] as unknown as MagicLPInfo[],
    };
  },

  watch: {
    async tokens() {
      if (this.tokensSelected) await this.getSimilarPools();
    },
  },

  methods: {
    async getSimilarPools() {
      const baseTokenSymbol =
        this.tokens.baseToken.config.symbol.toLocaleLowerCase();
      const quoteTokenSymbol =
        this.tokens.quoteToken.config.symbol.toLocaleLowerCase();

      const similarPoolsConfigs = poolsConfig.filter(
        ({ name }) =>
          name.toLocaleLowerCase().includes(baseTokenSymbol) &&
          name.toLocaleLowerCase().includes(quoteTokenSymbol)
      );

      this.similarPools = await Promise.all(
        similarPoolsConfigs.map(
          async (config) => await getLpInfo(config, config.chainId)
        )
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
