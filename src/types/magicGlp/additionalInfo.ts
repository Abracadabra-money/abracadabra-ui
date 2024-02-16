export type EmptyState = {
  mainToken: EmptyStateItem;
  stakeToken: EmptyStateItem;
};

export type EmptyStateItem = {
  name: string;
  icon: string;
  rateIcon?: string;
  balance: bigint;
  balanceUsd?: bigint;
  rate?: bigint;
  price: bigint;
  decimals?: number;
  totalSupply?: bigint;
  totalSupplyUsd?: bigint;
};

export type AdditionalInfo = {
  feePercent: number;
  rewardToken: RewardTokenInfo;
  leverageInfo: any;
};

export type RewardTokenInfo = {
  symbol: string;
  icon: string;
  amount: string;
  amountUsd: number;
};
