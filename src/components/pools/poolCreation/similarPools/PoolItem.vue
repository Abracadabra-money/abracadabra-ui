<template>
  <router-link :to="goToPage" :class="['pool-item']">
    <div class="status-flag">
      <span class="status-flag-text">{{ poolStatus }}</span>
    </div>

    <div class="item-header">
      <div class="token-info">
        <TokenChainIcon
          :icon="pool.icon"
          :name="pool.name"
          :chainId="pool.chainId"
          size="32px"
        />
        <span class="token-name">{{ pool.name }}</span>
      </div>
    </div>

    <ul class="item-info">
      <li class="item-info-tag">
        <div class="tag-title">
          Fee tier
          <Tooltip tooltip="fee tier" />
        </div>
        <p class="tag-value">{{ feeTier }}</p>
      </li>

      <li class="item-info-tag">
        <div class="tag-title">
          TVL
          <Tooltip tooltip="tvl" />
        </div>
        <p class="tag-value">{{ tvl }}</p>
      </li>
    </ul>
  </router-link>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { formatUSD, formatPercent } from "@/helpers/filters";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import {
  FEE_TIER_DECIMALS,
  PoolTypes,
  STANDARD_K_VALUE,
} from "@/constants/pools/poolCreation";
import { formatUnits } from "viem";

export default {
  props: {
    pool: {
      type: Object as any,
      required: true,
    },
  },

  computed: {
    feeTier() {
      return formatPercent(formatUnits(this.pool.initialParameters.lpFeeRate, FEE_TIER_DECIMALS));
    },

    tvl() {
      const { totalSupply, decimals } = this.pool;
      return formatUSD(formatUnits(totalSupply, decimals));
    },

    goToPage() {
      const { id, chainId } = this.pool;

      return {
        name: "Pool",
        params: { id, poolChainId: chainId },
      };
    },

    poolStatus() {
      return this.pool.initialParameters.K === STANDARD_K_VALUE
        ? PoolTypes.Standard
        : PoolTypes.Pegged;
    },
  },

  components: {
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
    TokenChainIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/TokenChainIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 235px;
  height: 154px;
  border: 1px solid #304d99;
  border-radius: 16px;
  padding: 24px 16px 16px 16px;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );

  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  transition: all 0.5s ease-in-out;
}

.pool-item:hover {
  transform: scale(1.01);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.16);
  z-index: 1;
}

.item-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.token-info {
  display: flex;
  align-items: center;
}

.token-name {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.item-info-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.tag-title {
  display: flex;
  align-items: center;
  gap: 3px;
}

.status-flag {
  position: absolute;
  top: -1px;
  left: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 117px;
  height: 19px;
  border-radius: 16px 0 8px 0px;
  background: linear-gradient(0deg, #2d4a96 0%, #5b7cd1 100%);
}

.status-flag-text {
  text-align: center;
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
