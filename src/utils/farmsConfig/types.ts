import type { Address } from "viem";

export type FarmConfig = {
  name: string;
  icon: string;
  contractChain: number;
  id: number;
  poolId: number;
  stakingToken: {
    name: string;
    type: string;
    link: string;
    abi: any;
  };
  earnedToken: {
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
};

export type FarmItem = {
  name: string;
  icon: string;
  id: number;
  poolId: number;
  earnedTokenPrice: number;
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
  isDepreciated: boolean;
  farmYield: number;
  accountInfo?: FarmAccountInfo;
  farmTvl?: number;
};

export type FarmAccountInfo = {
  allowance: string;
  userInfo: object;
  userReward: string;
  tokensBalanceInfo: {
    token0: {
      name: any;
      amount: number;
      amountInUsd: number;
    };
    token1: {
      name: any;
      amount: number;
      amountInUsd: number;
    };
  } | null;
  balance: string;
  depositedBalance: string;
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
