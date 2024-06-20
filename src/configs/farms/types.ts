import type { UserInfo } from "@/helpers/farm/getFarmUserInfo";
import type { Address } from "viem";

export type RewardToken = {
  name: string;
  icon: string;
  address: Address;
  decimals: number;
  abi: any;
  oracle: Address;
};

export type FarmConfig = {
  name: string;
  icon: string;
  contractChain: number;
  id: number;
  poolId?: number;
  isMultiReward?: boolean;
  isNew?: boolean;
  stakingToken: {
    name: string;
    address?: Address;
    decimals?: number;
    type: string;
    link: string;
    abi: any;
  };
  earnedToken?: {
    name: string;
    abi: any;
  };
  contract: {
    name: string;
    address: Address;
    abi: any;
  };
  depositedBalance?: {
    token0: {
      name: string;
      icon: string;
    };
    token1: {
      name: string;
      icon: string;
    };
  };
  rewardTokens?: RewardToken[];
};

export type FarmItem = {
  config?: FarmConfig;
  name: string;
  icon: string;
  id: number;
  chainId: number;
  poolId?: number;
  earnedTokenPrice?: number;
  stakingToken: {
    link: string;
    name: string;
    type: string;
    contractInfo: ContractInfo;
  };
  depositedBalance?: {
    token0: { name: string; icon: string };
    token1: { name: string; icon: string };
  };
  contractInfo: ContractInfo;
  farmRoi: number;
  lpPrice: number;
  isDeprecated: boolean;
  isNew?: boolean;
  isMultiReward?: boolean;
  farmYield?: number;
  accountInfo?: FarmAccountInfo;
  farmTvl?: number;
  tokensApr?: TokenApr[];
};

export type FarmAccountInfo = {
  allowance: string;
  userInfo: UserInfo;
  userReward: string;
  tokensBalanceInfo?: {
    token0: {
      name: string;
      amount: number;
      amountInUsd: number;
    };
    token1: {
      name: string;
      amount: number;
      amountInUsd: number;
    };
  } | null;
  rewardTokensInfo?: RewardTokenInfo[];
  balance: string | bigint;
  depositedBalance: string;
  depositedBalanceBigInt: bigint;
};

export type PoolInfo = {
  stakingToken: Address;
  stakingTokenTotalAmount: bigint;
  accIcePerShare: bigint;
  lastRewardTime: number;
  allocPoint: number;
};

export type ContractInfo = {
  address: Address;
  abi: any;
};

export type TokenApr = {
  address: Address;
  apr: number;
};

export type RewardTokenInfo = {
  earned: string | number;
  price: number;
  balance: string | number;
  allowance: string | number;
  rewards: string | number;
  usd: string | number;
} & RewardToken;
