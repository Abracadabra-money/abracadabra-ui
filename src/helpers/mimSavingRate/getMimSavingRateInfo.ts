import { formatUnits, type Address } from "viem";
import type { PublicClient } from "@/types/global";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import {
  getUserInfo,
  type UserInfo,
} from "@/helpers/mimSavingRate/getUserInfo";
import {
  mimSavingRateConfig,
  type MimSavingRateConfig,
  type RewardTokenConfig,
} from "@/configs/stake/mimSavingRateConfig";
import {
  getLockingMultiRewardsInfo,
  type LockingMultiRewardsInfo,
} from "@/helpers/mimSavingRate/getLockingMultiRewardsInfo";
import { getCoinsPrices } from "@/helpers/prices/defiLlama/index";

export type MimSavingRateInfo = {
  baseApr: number;
  userInfo: UserInfo;
} & LockingMultiRewardsInfo &
  MimSavingRateConfig;


export const emptyMimSavingRateInfo = {
  baseApr: 0,
  userInfo: {
    stakeToken: {
      balance: 0n,
      approvedAmount: 0n,
    },
    totalBalance: 0n,
    balances: {
      locked: 0n,
      unlocked: 0n,
    },
    earned: {
      token0: 0n,
      token1: 0n,
      token2: 0n
    },
    locked: 0n,
    unlocked: 0n,
    userLocks: [],
    lastLockIndex: 0n,
    userLocksLength: 0n,
    rewards: {
      token0: 0n,
      token1: 0n,
      token2: 0n
    },
    userRewardLock: {
      items: [],
      unlockTime: 0n
    },
    userRewardPerTokenPaid: {
      token0: 0n,
      token1: 0n,
      token2: 0n
    }
  },
  paused: false,
  startOfEpoch: 0,
  nextEpoch: 0,
  remainingEpochTime: 0,
  totalSupply: 0n,
  lockedSupply: 0n,
  unlockedSupply: 0n,
  stakingTokenBalance: 0n,
  maxLocks: 0n,
  minLockAmount: 0n,
  lockDuration: 0,
  nextUnlockTime: 0,
  multiplerBoost: 0n,
  rewardsPerToken: [],
  rewardsDuration: 0,
  ...mimSavingRateConfig[0]
}


export const getMimSavingRateInfo = async (
  account: Address | null,
  publicClient: PublicClient,
  chainId = ARBITRUM_CHAIN_ID
): Promise<MimSavingRateInfo> => {
  const config: MimSavingRateConfig | undefined = mimSavingRateConfig.find(
    (config: MimSavingRateConfig) => config.chainId === chainId
  );

  if (!config) return emptyMimSavingRateInfo;

  const lockingMultiRewardsInfo = await getLockingMultiRewardsInfo(
    publicClient,
    config.lockingMultiRewardsContract,
    config.rewardTokens
  );

  const userInfo = await getUserInfo(
    publicClient,
    account,
    config.lockingMultiRewardsContract,
    config.rewardTokens,
    config.stakingToken.contract
  );

  const baseApr = (
    await getMSRBaseApr(publicClient, config, lockingMultiRewardsInfo.unlockedSupply)
  ).totalApr;

  return {
    ...config,
    ...lockingMultiRewardsInfo,
    baseApr,
    userInfo,
  };
};

export const getMSRBaseApr = async (
  publicClient: PublicClient,
  config: MimSavingRateConfig,
  totalSupply: bigint | undefined = undefined,
) => {
  try {
    if (totalSupply === undefined)
      totalSupply = (await publicClient.readContract({
        ...config.lockingMultiRewardsContract,
        functionName: "unlockedSupply",
        args: [],
      })) as bigint;

    const { rewardTokensInfo, stakingTokenPrice }: any = await getTokenPrices(
      config
    );

    const totalStakedInUSD =
      Number(formatUnits(totalSupply, 18)) * stakingTokenPrice;

    let totalAnnualRewardsInUSD = 0;
    const tokensApr = [];

    const lockingContract = config.lockingMultiRewardsContract;

    for (const tokenInfo of rewardTokensInfo) {
      const rewardData = await publicClient.readContract({
        address: lockingContract.address,
        abi: lockingContract.abi,
        functionName: "rewardData",
        args: [tokenInfo.contract.address],
      });

      const rewardTokenPrice = tokenInfo.price;

      const annualReward =
        //@ts-ignore
        Number(rewardData.periodFinish) <= Math.floor(new Date() / 1000)
          ? 0
          : //@ts-ignore
          formatUnits(rewardData.rewardRate, 18) *
          (365 * 24 * 60 * 60) *
          // rewardData.rewardsDuration *
          rewardTokenPrice;

      const tokenApr = (annualReward / totalStakedInUSD) * 100;

      tokensApr.push({
        address: tokenInfo.contract.address,
        apr: tokenApr,
      });

      totalAnnualRewardsInUSD += annualReward;
    }

    const totalApr = (totalAnnualRewardsInUSD / totalStakedInUSD) * 100;

    return { totalApr, tokensApr };
  } catch (error) {
    console.error("Error calculating APR:", error);
    return { totalApr: 0, tokensApr: 0 };
  }
};

const getTokenPrices = async (config: MimSavingRateConfig) => {
  const tokenAddresses = [config.stakingToken.contract.address];

  config.rewardTokens.forEach((token: RewardTokenConfig) =>
    tokenAddresses.push(token.contract.address)
  );

  const prices = await getCoinsPrices(config.chainId, tokenAddresses);

  const stakingTokenPrice = prices.shift()?.price || 1;

  return {
    stakingTokenPrice,
    rewardTokensInfo: config.rewardTokens.map(
      (token: RewardTokenConfig, index: number) => {
        return { ...token, price: prices[index].price || 0 };
      }
    ),
  };
};
