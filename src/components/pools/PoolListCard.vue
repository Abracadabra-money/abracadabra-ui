<template>
  <div class="pool-card">
    <div class="card-header">
      <div class="pool-info">
        <div class="pool-icons">
          <img class="token0-icon" :src="pool.config.baseToken.icon" alt="" />
          <img class="token1-icon" :src="pool.config.quoteToken.icon" alt="" />
          <img class="chain-icon" :src="getChainIcon(pool.config.chainId)" />
        </div>

        <div>
          <div class="pool-name">{{ pool.name }}</div>
          <div class="pool-rewards">
            Staking rewards
            <div class="reward-icons-wrap" v-if="pool.config.chainId === 81457">
              <img
                class="reward-icons"
                v-for="(reward, index) in kavaRewards"
                :key="index"
                :src="reward"
                alt=""
              />
            </div>

            <img
              class="reward-icon"
              :src="getChainIcon(pool.config.chainId)"
              v-else
            />
          </div>
        </div>
      </div>

      <router-link
        class="pool-link"
        :to="`/pool/${pool.config.id}/${pool.config.chainId}`"
      >
        <LinkIcon fill="#fff" />
      </router-link>
    </div>

    <div class="card-body">
      <div class="pool-tvl">
        <div class="tvl-value">{{ formatLargeSum(tvl) }}</div>
        <div class="tvl-usd">${{ formatLargeSum(tvlUsd) }}</div>
      </div>

      <div>
        <div class="tokens-info">
          <div class="token-info">
            <img
              class="token-icon"
              :src="pool.config.baseToken.icon"
              :alt="pool.config.baseToken.name"
            />

            <div>
              <div class="token-value">
                {{ formatLargeSum(baseTokenAmount) }}
              </div>
              <div class="token-value-usd">
                ${{ formatLargeSum(baseTokenAmountUsd) }}
              </div>
            </div>
          </div>
        </div>

        <div class="tokens-info">
          <div class="token-info">
            <img
              class="token-icon"
              :src="pool.config.quoteToken.icon"
              :alt="pool.config.quoteToken.name"
            />

            <div>
              <div class="token-value">
                {{ formatLargeSum(quoteTokenAmount) }}
              </div>
              <div class="token-value-usd">
                ${{ formatLargeSum(quoteTokenAmountUsd) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent, type PropType } from "vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { formatLargeSum, formatTokenBalance } from "@/helpers/filters";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    pool: {
      type: Object as PropType<MagicLPInfo>,
      required: true,
    },
  },

  data() {
    return {
      kavaRewards: [
        useImage("assets/images/points-dashboard/blast.png"),
        useImage("assets/images/points-dashboard/gold-points.svg"),
        useImage("assets/images/points-dashboard/potion.png"),
      ],
    };
  },

  computed: {
    baseTokenAmount() {
      return Number(
        formatUnits(
          this.pool.vaultReserve[0],
          this.pool.config.baseToken.decimals
        )
      );
    },

    baseTokenAmountUsd() {
      return this.baseTokenAmount * this.pool.baseTokenPrice;
    },

    quoteTokenAmount() {
      return Number(
        formatUnits(
          this.pool.vaultReserve[1],
          this.pool.config.quoteToken.decimals
        )
      );
    },

    quoteTokenAmountUsd() {
      return this.quoteTokenAmount * this.pool.quoteTokenPrice;
    },

    tvl() {
      return this.baseTokenAmount + this.quoteTokenAmount;
    },

    tvlUsd() {
      return this.baseTokenAmountUsd + this.quoteTokenAmountUsd;
    },
  },

  methods: { getChainIcon, formatTokenBalance, formatLargeSum },

  components: {
    LinkIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/LinkIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-card {
  max-width: 302px;
  width: 100%;
  padding: 13px 12px 18px 0;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.pool-info {
  padding-left: 12px;
  gap: 14px;
  display: flex;
  align-items: center;
}

.pool-icons {
  position: relative;
  display: flex;
  align-items: center;
}

.token0-icon {
  width: 32px;
  height: 32px;
}

.token1-icon {
  width: 36px;
  height: 36px;
  border: 2px solid #394ea0;
  margin-left: -10px;
  border-radius: 12px;
}

.chain-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #394ea0;
  position: absolute;
  top: -8px;
  right: -10px;
}

.pool-name {
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
}

.pool-rewards {
  gap: 4px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  font-weight: 500;
}

.reward-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.reward-icons-wrap {
  display: flex;
}

.reward-icons {
  width: 18px;
  height: 18px;
  border: 2px solid #5b56bc;
  border-radius: 50%;
}

.reward-icons:not(:first-child) {
  margin-left: -8px;
}

.pool-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--Radius-Tiny, 10px);
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.card-body {
  display: flex;
  gap: 20px;
}

.pool-tvl {
  padding: 12px 19px 12px;
  border-radius: 0 16px 16px 0;
  background: #000;
}

.tvl-value {
  font-size: 37px;
  font-weight: 500;
  line-height: 33px;
}

.tvl-usd {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 16px;
}

.token-info {
  gap: 8px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 28px;
  height: 28px;
}

.token-value {
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.token-value-usd {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}
</style>
