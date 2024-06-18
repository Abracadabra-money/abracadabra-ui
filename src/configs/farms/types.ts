import type { UserInfo } from "@/helpers/farm/getFarmUserInfo";
import type { Address } from "viem";

type RewardToken = {
  name: String;
  icon: String;
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
  rewardTokens?: Array<RewardToken>;
};

export type FarmItem = {
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
};

export type FarmAccountInfo = {
  allowance: string;
  userInfo: UserInfo;
  userReward: string;
  tokensBalanceInfo: {
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
  balance: string;
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
