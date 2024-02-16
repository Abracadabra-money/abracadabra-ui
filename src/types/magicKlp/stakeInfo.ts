import type {
  MainTokenInfo,
  StakeTokenInfo,
} from "@/types/magicKlp/tokensInfo";

export type EmptyState = {
  mainToken: EmptyStateItem;
  stakeToken: EmptyStateItem;
};

export type EmptyStateItem = {
  name: string;
  icon: string;
  rate?: bigint;
  balance: BigInt;
  balanceUsd: bigint;
  price: bigint;
  rateIcon?: string;
  decimals?: number;
  totalSupply?: bigint;
  totalSupplyUsd?: bigint;
};

export type StakeInfo = {
  chainId: number;
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
};
