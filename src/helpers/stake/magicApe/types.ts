import type { ContractInfo } from "@/types/global";

export type MagicGlpStakeInfo = {
  chainId: number;
  feePercent: number;
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
  rewardToken: RewardToken;
  leverageInfo: LeverageInfo;
};

export type TokensInfo = {
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
};

export type MainTokenInfo = {
  name: string;
  icon: string;
  contract: ContractInfo;
  rateIcon: string;
  decimals: number;
  rate: bigint;
  price: bigint;
  totalSupply: bigint;
  totalSupplyUsd: bigint;
  balanceUsd: bigint;
  balance: bigint;
};

export type StakeTokenInfo = {
  name: string;
  icon: string;
  contract: ContractInfo;
  price: bigint;
  decimals: number;
  balance: bigint;
  balanceUsd: bigint;
  approvedAmount: bigint;
};

export type AdditionalInfo = {
  feePercent: number;
  rewardToken: RewardToken;
  leverageInfo: LeverageInfo;
};

export type ChartConfig = {
  icon: string;
  title: string;
  type: string;
  typeButtons: string[];
  feePercent?: number;
  intervalButtons: {
    label: string;
    time: number;
  }[];
};

export type AdditionalConfig = {
  title: string;
  tooltip: string;
  icon: string;
  decimals: number;
  amount: bigint;
  amountUsd: bigint;
};

export type LeverageInfo = {
  id: number;
  label: string;
};

type RewardToken = {
  amount: bigint;
  amountUsd: bigint;
  symbol: string;
  decimals: number;
  icon: string;
};
