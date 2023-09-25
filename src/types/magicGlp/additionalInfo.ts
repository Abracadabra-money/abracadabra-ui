export type EmptyState = {
  mainToken: EmptyStateItem;
  stakeToken: EmptyStateItem;
};

export type EmptyStateItem = {
  name: string;
  icon: string;
  balance: BigInt;
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
