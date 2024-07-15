<template>
  <div class="pools-info">
    <div>
      <h3 class="title">MIM Pools</h3>
      <h4 class="subtitle">
        Explore our curated list of MIMSwap pairs. Become a liquidity provider
        and earn fees along with additional rewards
      </h4>
    </div>

    <div class="cards-wrap">
      <div class="tvl-card">
        <div>
          <h4 class="tvl-card-title">MIMSwap TVL</h4>
          <div class="tvl-card-value">$ {{ formatLargeSum(totalTvl) }}</div>
        </div>

        <div class="line"></div>

        <div class="tvl-by-chains">
          <div
            class="tvl-by-chain"
            v-for="{ chainId, tvl } in tvlByChains"
            :key="chainId"
          >
            <img class="chain-icon" :src="getChainIcon(chainId)" />
            ${{ formatLargeSum(tvl) }}
          </div>
        </div>
      </div>

      <!-- <div class="kava-card">
        <h4 class="kava-card-title">To be distributed</h4>
        <div class="kava-card-value">
          <img class="kava-icon" src="@/assets/images/tokens/KAVA.png" alt="" />

          {{ formatTokenBalance(toBeDistributed) }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { formatLargeSum, formatTokenBalance } from "@/helpers/filters";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { KAVA_CHAIN_ID } from "@/constants/global";

type RewardData = {
  rewardsDuration: bigint;
  periodFinish: bigint;
  rewardRate: bigint;
  lastUpdateTime: bigint;
  rewardPerTokenStored: bigint;
};

const MULTI_REWARDS_ADDRESS = "0xcF4f8E9A113433046B990980ebce5c3fA883067f";
const WKAVA_TOKEN_ADDRESS = "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b";

const abi = [
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "rewardData",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "rewardsDuration", type: "uint256" },
          { internalType: "uint256", name: "periodFinish", type: "uint256" },
          { internalType: "uint256", name: "rewardRate", type: "uint256" },
          { internalType: "uint256", name: "lastUpdateTime", type: "uint256" },
          {
            internalType: "uint256",
            name: "rewardPerTokenStored",
            type: "uint256",
          },
        ],
        internalType: "struct MultiRewards.Reward",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default {
  props: {
    pools: { type: Array as PropType<MagicLPInfo[]>, required: true },
  },

  data() {
    return {
      kavaRewardData: null as RewardData | null,
    };
  },

  computed: {
    totalTvl() {
      return this.tvlByChains.reduce(
        (acc: any, chainInfo: any) => acc + chainInfo.tvl,
        0
      );
    },

    tvlByChains() {
      const tvlByChainId = this.pools.reduce((acc, pool) => {
        const baseTokenAmount = Number(
          formatUnits(pool.vaultReserve[0], pool.config.baseToken.decimals)
        );
        const quoteTokenAmount = Number(
          formatUnits(pool.vaultReserve[1], pool.config.quoteToken.decimals)
        );
        const totalTvlUsd =
          baseTokenAmount * pool.baseTokenPrice +
          quoteTokenAmount * pool.quoteTokenPrice;

        if (acc[pool.config.chainId as keyof typeof acc]) {
          // @ts-ignore
          acc[pool.config.chainId as keyof typeof acc].tvl += totalTvlUsd;
        } else {
          // @ts-ignore
          acc[pool.config.chainId] = {
            chainId: pool.config.chainId,
            tvl: totalTvlUsd,
          };
        }

        return acc;
      }, {});

      return Object.values(tvlByChainId);
    },

    toBeDistributed() {
      if (!this.kavaRewardData) return 0;
      const { rewardRate, rewardsDuration }: RewardData = this.kavaRewardData;
      return Number(formatUnits(rewardRate * rewardsDuration, 18));
    },
  },

  methods: {
    getChainIcon,
    formatLargeSum,
    formatTokenBalance,

    async getRewardData(): Promise<RewardData> {
      const publicClient = getPublicClient(KAVA_CHAIN_ID);

      return await publicClient.readContract({
        chainId: KAVA_CHAIN_ID,
        address: MULTI_REWARDS_ADDRESS,
        abi: abi,
        functionName: "rewardData",
        args: [WKAVA_TOKEN_ADDRESS],
      });
    },
  },

  async created() {
    this.kavaRewardData = await this.getRewardData();
  },
};
</script>

<style lang="scss" scoped>
.pools-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;
}

.subtitle {
  max-width: 490px;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.6);
}

.cards-wrap {
  gap: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tvl-card {
  gap: 24px;
  display: flex;
  align-items: center;
  padding: 14px 35px;
  border-radius: 16px;
  border: 1px solid #00296b;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  background: url("@/assets/images/farm/reward-card-background.png"),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  background-repeat: no-repeat;
  background-position: 0 16px;
  min-width: 335px;
}

.tvl-card-title {
  color: #99a0b2;
  text-align: center;
  font-weight: 500;
  line-height: normal;
}

.tvl-card-value {
  text-align: center;
  font-size: 28px;
  font-weight: 500;
  line-height: normal;
}

.line {
  width: 1px;
  height: 77px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.12) 46%,
    rgba(255, 255, 255, 0) 100%
  );
}

.tvl-by-chains {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.tvl-by-chain {
  gap: 8px;
  display: flex;
  align-items: center;
  color: #878b93;
  font-weight: 500;
  line-height: normal;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.kava-card {
  height: 100%;
  padding: 18px 35px;
  min-width: 262px;
  background: url("@/assets/images/pools/kava-card-bg.png");
  background-repeat: no-repeat;
  background-position: bottom right;
  border: 1px solid #34141e;
  border-radius: 16px;
}

.kava-card-title {
  text-align: center;
  font-weight: 500;
  line-height: normal;
}

.kava-card-value {
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 500;
  line-height: normal;
}

.kava-icon {
  width: 32px;
  height: 32px;
}

@media screen and (max-width: 1050px) {
  .pools-info {
    flex-direction: column;
    gap: 16px;
  }

  .cards-wrap {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media screen and (max-width: 650px) {
  .pools-info {
    margin-bottom: 0;
  }

  .tvl-card {
    width: 100%;
    justify-content: center;
  }

  .kava-card {
    width: 100%;
    background-size: cover;
    background-position: center left;
  }
}

@media screen and (max-width: 475px) {
  .tvl-card {
    gap: 12px;
  }

  .tvl-card-title,
  .tvl-by-chain {
    font-size: 14px;
  }

  .tvl-card-value {
    font-size: 24px;
  }
}
</style>
