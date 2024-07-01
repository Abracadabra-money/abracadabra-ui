import type { ContractInfo, PublicClient } from "@/types/global";
import type { RewardTokenConfig } from "@/configs/stake/mimSavingRateConfig";

export type LockingMultiRewardsInfo = {
  paused: boolean;
  startOfEpoch: number;
  nextEpoch: number;
  remainingEpochTime: number;
  totalSupply: bigint;
  lockedSupply: bigint;
  unlockedSupply: bigint;
  stakingTokenBalance: bigint;
  maxLocks: bigint;
  minLockAmount: bigint;
  lockDuration: number;
  nextUnlockTime: number;
  multiplerBoost: bigint;
  rewardsPerToken: RewardPerToken[];
  rewardsDuration: number;
};

export type RewardPerToken = {
  totalReward: bigint;
  rewardsForDuration: bigint;
};

export const getLockingMultiRewardsInfo = async (
  publicClient: PublicClient,
  contract: ContractInfo,
  rewardTokens: RewardTokenConfig[]
): Promise<LockingMultiRewardsInfo> => {
  const rewardToken0Address = rewardTokens[0].contract.address;
  const rewardToken1Address = rewardTokens[1].contract.address;

  const [
    epoch,
    lockDuration,
    lockedSupply,
    lockingBoostMultiplerInBips,
    maxLocks,
    minLockAmount,
    nextEpoch,
    nextUnlockTime,
    paused,
    remainingEpochTime,
    rewardsDuration,
    stakingTokenBalance,
    totalSupply,
    unlockedSupply,
    rewardPerToken0,
    rewardsForDurationToken0,
    rewardPerToken1,
    rewardsForDurationToken1,
  ]: any = await publicClient.multicall({
    contracts: [
      {
        ...contract,
        functionName: "epoch",
        args: [],
      },
      {
        ...contract,
        functionName: "lockDuration",
        args: [],
      },
      {
        ...contract,
        functionName: "lockedSupply",
        args: [],
      },
      {
        ...contract,
        functionName: "lockingBoostMultiplerInBips",
        args: [],
      },
      {
        ...contract,
        functionName: "maxLocks",
        args: [],
      },
      {
        ...contract,
        functionName: "minLockAmount",
        args: [],
      },
      {
        ...contract,
        functionName: "nextEpoch",
        args: [],
      },
      {
        ...contract,
        functionName: "nextUnlockTime",
        args: [],
      },
      {
        ...contract,
        functionName: "paused",
        args: [],
      },
      {
        ...contract,
        functionName: "remainingEpochTime",
        args: [],
      },
      {
        ...contract,
        functionName: "rewardsDuration",
        args: [],
      },
      {
        ...contract,
        functionName: "stakingTokenBalance",
        args: [],
      },
      {
        ...contract,
        functionName: "totalSupply",
        args: [],
      },
      {
        ...contract,
        functionName: "unlockedSupply",
        args: [],
      },
      {
        ...contract,
        functionName: "rewardPerToken",
        args: [rewardToken0Address],
      },
      {
        ...contract,
        functionName: "rewardsForDuration",
        args: [rewardToken0Address],
      },
      {
        ...contract,
        functionName: "rewardPerToken",
        args: [rewardToken1Address],
      },
      {
        ...contract,
        functionName: "rewardsForDuration",
        args: [rewardToken1Address],
      },
    ],
  });

  return {
    paused: paused.result,
    startOfEpoch: Number(epoch.result),
    nextEpoch: Number(nextEpoch.result),
    remainingEpochTime: Number(remainingEpochTime.result),
    totalSupply: totalSupply.result,
    lockedSupply: lockedSupply.result,
    unlockedSupply: unlockedSupply.result,
    stakingTokenBalance: stakingTokenBalance.result,
    maxLocks: maxLocks.result,
    minLockAmount: minLockAmount.result,
    lockDuration: Number(lockDuration.result),
    nextUnlockTime: Number(nextUnlockTime.result),
    multiplerBoost: lockingBoostMultiplerInBips.result,
    rewardsPerToken: [
      {
        totalReward: rewardPerToken0.result,
        rewardsForDuration: rewardsForDurationToken0.result,
      },
      {
        totalReward: rewardPerToken1.result,
        rewardsForDuration: rewardsForDurationToken1.result,
      }
    ],
    rewardsDuration: Number(rewardsDuration.result),
  };
};
