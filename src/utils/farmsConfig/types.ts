import type { BigNumber, Contract } from "ethers";

export type FarmConfig = {
  name: string;
  icon: string;
  contractChain: number;
  id: number;
  farmId: number;
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
    address: string;
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
  farmId: number;
  earnedTokenPrice: number;
  stakingToken: {
    link: string;
    name: string;
    type: string;
    contract: Contract;
  };
  depositedBalance: number;
  contractInstance: Contract;
  contractAddress: string;
  farmRoi: number;
  lpPrice: number;
  isDepreciated: boolean;
  accountInfo?: FarmAccountInfo;
  farmTvl?: number;
};

export type FarmAccountInfo = {
  allowance: BigNumber;
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
