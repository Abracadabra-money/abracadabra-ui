import type { Address } from "viem";
import type { ContractInfo, PublicClient } from "@/types/global";

type UserInfo = {
  totalBalance: bigint;
  balances: {
    locked: bigint;
    unlocked: bigint;
  };
  earned: bigint;
  locked: bigint;
  unlocked: bigint;
  userLocks: bigint[];
  lastLockIndex: bigint;
  userLocksLength: bigint;
  rewards: bigint;
  rewardData: {
    exists: boolean;
    lastUpdateTime: bigint;
    periodFinish: bigint;
    rewardPerTokenStored: bigint;
    rewardRate: bigint;
  };
  userRewardLock: {
    items: bigint[];
    unlockTime: bigint;
  };
  userRewardPerTokenPaid: bigint;
};

const emptyState = {
  totalBalance: 0n,
  balances: {
    locked: 0n,
    unlocked: 0n,
  },
  earned: 0n,
  locked: 0n,
  unlocked: 0n,
  userLocks: [],
  lastLockIndex: 0n,
  userLocksLength: 0n,
  rewards: 0n,
  rewardData: {
    exists: true,
    lastUpdateTime: 0n,
    periodFinish: 0n,
    rewardPerTokenStored: 0n,
    rewardRate: 0n,
  },
  userRewardLock: {
    items: [],
    unlockTime: 0n,
  },
  userRewardPerTokenPaid: 0n,
};

export const getUserInfo = async (
  publicClient: PublicClient,
  account: Address,
  contract: ContractInfo,
  rewardTokenAddress: Address
): Promise<UserInfo> => {
  if (!account) return emptyState;

  const [
    totalBalance,
    balances,
    earned,
    lastLockIndex,
    locked,
    rewardData,
    rewards,
    unlocked,
    userLocks,
    userLocksLength,
    userRewardLock,
    userRewardPerTokenPaid,
  ]: any = await publicClient.multicall({
    contracts: [
      {
        ...contract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...contract,
        functionName: "balances",
        args: [account],
      },
      {
        ...contract,
        functionName: "earned",
        args: [account, rewardTokenAddress],
      },
      {
        ...contract,
        functionName: "lastLockIndex",
        args: [account],
      },
      {
        ...contract,
        functionName: "locked",
        args: [account],
      },
      {
        ...contract,
        functionName: "rewardData",
        args: [rewardTokenAddress],
      },
      {
        ...contract,
        functionName: "rewards",
        args: [account, rewardTokenAddress],
      },
      {
        ...contract,
        functionName: "unlocked",
        args: [account],
      },
      {
        ...contract,
        functionName: "userLocks",
        args: [account],
      },
      {
        ...contract,
        functionName: "userLocksLength",
        args: [account],
      },
      {
        ...contract,
        functionName: "userRewardLock",
        args: [account],
      },
      {
        ...contract,
        functionName: "userRewardPerTokenPaid",
        args: [account, rewardTokenAddress],
      },
    ],
  });

  return {
    totalBalance: totalBalance.result,
    balances: balances.result,
    earned: earned.result,
    locked: locked.result,
    unlocked: unlocked.result,
    userLocks: userLocks.result, //todo type
    lastLockIndex: lastLockIndex.result,
    userLocksLength: userLocksLength.result,
    rewards: rewards.result,
    rewardData: rewardData.result,
    userRewardLock: userRewardLock.result, //todo type
    userRewardPerTokenPaid: userRewardPerTokenPaid.result,
  };
};
