import type { ContractInfo } from "@/types/global";

export type TokensInfo = {
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
};

export type MainTokenInfo = {
  name: string;
  icon: string;
  rateIcon: string;
  decimals: number;
  price: bigint;
  rate: bigint;
  totalSupply: bigint;
  totalSupplyUsd: bigint;
  balance: bigint;
  balanceUsd: bigint;
  approvedAmount: bigint;
  contract: ContractInfo;
};

export type StakeTokenInfo = {
  name: string;
  icon: string;
  decimals: number;
  price: bigint;
  balance: bigint;
  balanceUsd: bigint;
  contract: ContractInfo;
};
