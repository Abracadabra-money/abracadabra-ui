import type { ContractInfo } from "@/types/global";

export type TokensInfo = {
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
};

export type StakeTokenInfo = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  approvedAmount: bigint;
  price: bigint;
  balance: bigint;
  balanceUsd: bigint;

  rateIcon?: string;
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

export type RewardTokenInfo = {
  amount: bigint;
  amountUsd: bigint;
  symbol: string;
  decimals?: number;
  icon: string;
};

export type AdditionalConfig = {
  title: string;
  tooltip: string;
  icon: string;
  decimals: number;
  amount: bigint;
  amountUsd: bigint;
};

export type ChartConfig = {
  icon: string;
  title: string;
  type: string;
  typeButtons?: string[];
  feePercent?: number;
  intervalButtons?: {
    label: string;
    time: number;
  }[];
};

export type LeverageInfo = {
  id?: number;
  label: string;
};

export type AdditionalInfo = {
  feePercent: number;
  rewardToken: RewardTokenInfo;
  leverageInfo: LeverageInfo;
};

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: string[] | number[];
    borderColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointRadius: number;
    borderWidth: number;
  }[];
};
