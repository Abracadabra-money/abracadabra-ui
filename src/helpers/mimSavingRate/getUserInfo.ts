import type { Address } from "viem";
import type { ContractInfo, PublicClient } from "@/types/global";
import type { RewardTokenConfig } from "@/configs/stake/mimSavingRateConfig";


export type UserLock = {
  amount: bigint;
  unlockTime: bigint;
  account?: Address;
  chainId?: number;
  fromStorage?: boolean;
};

export type UserInfo = {
  stakeToken: {
    balance: bigint;
    approvedAmount: bigint;
  };
  totalBalance: bigint;
  balances: {
    locked: bigint;
    unlocked: bigint;
  };
  earned: {
    token0: bigint;
    token1: bigint;
    token2: bigint;
  };
  locked: bigint;
  unlocked: bigint;
  userLocks: UserLock[];
  lastLockIndex: bigint;
  userLocksLength: bigint;
  rewards: {
    token0: bigint;
    token1: bigint;
    token2: bigint;
  };
  // rewardData: {
  //   token0: RewardData;
  //   token1: RewardData;
  // };
  userRewardLock: UserRewardLock;
  userRewardPerTokenPaid: {
    token0: bigint;
    token1: bigint;
    token2: bigint;
  };
};

export type RewardData = {
  exists: boolean;
  lastUpdateTime: bigint;
  periodFinish: bigint;
  rewardPerTokenStored: bigint;
  rewardRate: bigint;
};

export type UserRewardLock = {
  items: UserRewardLockToken[];
  unlockTime: bigint;
};

type UserRewardLockToken = {
  amount: bigint;
  token: Address;
};

const emptyState = {
  stakeToken: {
    balance: 0n,
    approvedAmount: 0n,
  },
  totalBalance: 0n,
  balances: {
    locked: 0n,
    unlocked: 0n,
  },
  earned: { token0: 0n, token1: 0n, token2: 0n },
  locked: 0n,
  unlocked: 0n,
  userLocks: [],
  lastLockIndex: 0n,
  userLocksLength: 0n,
  rewards: { token0: 0n, token1: 0n, token2: 0n },
  // rewardData: {
  //   token0: {
  //     exists: true,
  //     lastUpdateTime: 0n,
  //     periodFinish: 0n,
  //     rewardPerTokenStored: 0n,
  //     rewardRate: 0n,
  //   },
  //   token1: {
  //     exists: true,
  //     lastUpdateTime: 0n,
  //     periodFinish: 0n,
  //     rewardPerTokenStored: 0n,
  //     rewardRate: 0n,
  //   },
  // },
  userRewardLock: {
    items: [],
    unlockTime: 0n,
  },
  userRewardPerTokenPaid: { token0: 0n, token1: 0n, token2: 0n },
};

export const getUserInfo = async (
  publicClient: PublicClient,
  account: Address,
  contract: ContractInfo,
  rewardTokens: RewardTokenConfig[],
  stakingTokenContract: ContractInfo
): Promise<UserInfo> => {
  if (!account) return emptyState;

  const rewardToken0Address = rewardTokens[0].contract.address;
  const rewardToken1Address = rewardTokens[1].contract.address;
  const rewardToken2Address = rewardTokens[2].contract.address;

  const [
    totalBalance,
    balances,
    earnedToken0,
    earnedToken1,
    earnedToken2,
    lastLockIndex,
    locked,
    // rewardDataToken0,
    // rewardDataToken1,
    rewardsToken0,
    rewardsToken1,
    rewardsToken2,
    unlocked,
    userLocks,
    userLocksLength,
    userRewardLock,
    userRewardPerToken0Paid,
    userRewardPerToken1Paid,
    userRewardPerToken2Paid,
    stakeTokenBalance,
    stakeTokenApprovedAmount,
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
        args: [account, rewardToken0Address],
      },
      {
        ...contract,
        functionName: "earned",
        args: [account, rewardToken1Address],
      },
      {
        ...contract,
        functionName: "earned",
        args: [account, rewardToken2Address],
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
      // {
      //   ...contract,
      //   functionName: "rewardData",
      //   args: [rewardToken0Address],
      // },
      // {
      //   ...contract,
      //   functionName: "rewardData",
      //   args: [rewardToken1Address],
      // },
      {
        ...contract,
        functionName: "rewards",
        args: [account, rewardToken0Address],
      },
      {
        ...contract,
        functionName: "rewards",
        args: [account, rewardToken1Address],
      },
      {
        ...contract,
        functionName: "rewards",
        args: [account, rewardToken2Address],
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
        args: [account, rewardToken0Address],
      },
      {
        ...contract,
        functionName: "userRewardPerTokenPaid",
        args: [account, rewardToken1Address],
      },
      {
        ...contract,
        functionName: "userRewardPerTokenPaid",
        args: [account, rewardToken2Address],
      },
      {
        ...stakingTokenContract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...stakingTokenContract,
        functionName: "allowance",
        args: [account, contract.address],
      },
    ],
  });

  return {
    stakeToken: {
      balance: stakeTokenBalance.result,
      approvedAmount: stakeTokenApprovedAmount.result,
    },
    totalBalance: totalBalance.result,
    balances: balances.result,
    earned: { token0: earnedToken0.result, token1: earnedToken1.result, token2: earnedToken2.result },
    locked: locked.result,
    unlocked: unlocked.result,
    userLocks: userLocks.result,
    lastLockIndex: lastLockIndex.result,
    userLocksLength: userLocksLength.result,
    rewards: { token0: rewardsToken0.result, token1: rewardsToken1.result, token2: rewardsToken2.result },
    // rewardData: {
    //   token0: rewardDataToken0.result,
    //   token1: rewardDataToken1.result,
    // },
    userRewardLock: userRewardLock.result, //todo type
    userRewardPerTokenPaid: {
      token0: userRewardPerToken0Paid.result,
      token1: userRewardPerToken1Paid.result,
      token2: userRewardPerToken2Paid.result,
    },
  };
};
