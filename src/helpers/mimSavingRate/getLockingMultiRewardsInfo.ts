import type { Address } from "viem";
import type { ContractInfo, PublicClient } from "@/types/global";

type LockingMultiRewardsInfo = {
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
  totalReward: bigint;
  rewardsForDuration: bigint;
  rewardsDuration: number;
};

export const getLockingMultiRewardsInfo = async (
  publicClient: PublicClient,
  contract: ContractInfo,
  rewardTokenAddress: Address
): Promise<LockingMultiRewardsInfo> => {
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
    totalReward,
    rewardsForDuration,
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
        args: [rewardTokenAddress],
      },
      {
        ...contract,
        functionName: "rewardsForDuration",
        args: [rewardTokenAddress],
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
    totalReward: totalReward.result,
    rewardsForDuration: rewardsForDuration.result,
    rewardsDuration: Number(rewardsDuration.result),
  };
};
