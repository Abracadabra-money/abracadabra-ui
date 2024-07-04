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
        </div>
      </div>

      <router-link
        class="pool-link"
        :to="`/pool/${pool.config.id}/${pool.config.chainId}`"
      >
        <svg
          class="arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M12.5886 9.91129L12.5888 9.91148C12.6004 9.92309 12.6097 9.93688 12.616 9.95205C12.6222 9.96723 12.6255 9.98349 12.6255 9.99992C12.6255 10.0164 12.6222 10.0326 12.616 10.0478C12.6097 10.063 12.6005 10.0767 12.5888 10.0884L12.5886 10.0886L6.33863 16.3386C6.31512 16.3621 6.28324 16.3753 6.25 16.3753C6.21675 16.3753 6.18487 16.3621 6.16136 16.3386C6.13786 16.315 6.12465 16.2832 6.12465 16.2499C6.12465 16.2167 6.13785 16.1848 6.16134 16.1613C6.16135 16.1613 6.16135 16.1613 6.16136 16.1613L11.9699 10.3535L12.3236 9.99992L11.9699 9.64634L6.16136 3.83856C6.14972 3.82692 6.14049 3.8131 6.13419 3.79789C6.12789 3.78268 6.12465 3.76638 6.12465 3.74992C6.12465 3.73346 6.12789 3.71716 6.13419 3.70195C6.14049 3.68674 6.14972 3.67293 6.16136 3.66129C6.173 3.64965 6.18682 3.64042 6.20203 3.63411C6.21724 3.62781 6.23354 3.62457 6.25 3.62457C6.26646 3.62457 6.28276 3.62781 6.29797 3.63411C6.31318 3.64041 6.32699 3.64965 6.33863 3.66129L6.68296 3.31696L6.33863 3.66129L12.5886 9.91129Z"
            fill="white"
            stroke="white"
          />
        </svg>
      </router-link>
    </div>

    <div class="card-body">
      <div class="pool-tvl">
        <div class="tvl-value">{{ formatLargeSum(totalSupply) }}</div>
        <div class="tvl-usd">${{ formatLargeSum(totalSupplyUsd) }}</div>
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
                {{ formatPercent(baseTokenPercent) }}
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
                {{ formatPercent(quoteTokenPercent) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="line"></div>

    <div class="rewards-wrap">
      <div class="pool-rewards" v-if="isPoolHasReward">
        Staking rewards

        <img
          class="reward-icons"
          v-for="(rewardInfo, index) in poolRewards"
          :key="index"
          :src="rewardInfo.icon"
          alt=""
        />
      </div>

      <div class="pool-rewards" v-else-if="hasPotionReward">
        Staking rewards

        <img
          class="reward-icons"
          src="@/assets/images/points-dashboard/potion.png"
          alt=""
        />
      </div>

      <div class="pool-apr" v-if="isShowPoolApr">APR {{ poolApr }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { useImage } from "@/helpers/useImage";
import { BLAST_CHAIN_ID } from "@/constants/global";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { formatLargeSum, formatPercent } from "@/helpers/filters";

export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isPoolHasReward() {
      return this.pool.config.stakeContract ?? false
    },

    poolRewards() {
      if (!this.isPoolHasReward) return;
      return this.pool.config.rewardTokens;
    },

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

    baseTokenPercent() {
      return (this.baseTokenAmountUsd * 100) / this.tvl;
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

    quoteTokenPercent() {
      return (this.quoteTokenAmountUsd * 100) / this.tvl;
    },

    tvl() {
      return this.baseTokenAmountUsd + this.quoteTokenAmountUsd;
    },

    hasPotionReward() {
      return this.pool.config.chainId === BLAST_CHAIN_ID && this.pool.config.id === 1;
    },

    isShowPoolApr() {
      return this.pool.chainId !== BLAST_CHAIN_ID;
    },

    poolApr() {
      return formatPercent(this.pool.poolAPR?.totalApr || 0);
    },

    totalSupply() {
      return Number(formatUnits(this.pool.totalSupply, this.pool.decimals));
    },

    totalSupplyUsd() {
      return this.pool?.price ? this.totalSupply * this.pool.price : 0;
    },
  },

  methods: {
    getChainIcon,
    formatPercent,
    formatLargeSum,
  },
};
</script>

<style lang="scss" scoped>
.pool-card {
  max-width: 302px;
  width: 100%;
  padding: 12px 12px 8px 0;
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

.pool-link {
  width: 44px;
  height: 44px;
  padding-left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  // border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);

  &:hover {
    .arrow {
      transition: all 0.2s ease-in-out;
      transform: translateX(4px);
    }
  }
}

.card-body {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.pool-tvl {
  padding: 12px 19px 12px;
  border-radius: 0 16px 16px 0;
  background: #171b2f;
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

.line {
  height: 5px;
  width: 100%;
  background: #171b2f;
  border-radius: 0 16px 16px 0;
}

.rewards-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 0 12px;
}

.pool-rewards {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.reward-icons {
  width: 20px;
  height: 20px;
  border-radius: 8px;
}

.reward-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.reward-icons:not(:first-child) {
  margin-left: -8px;
}

@media screen and (max-width: 650px) {
  .pool-card {
    max-width: 100%;
    width: 100%;
  }
}
</style>
