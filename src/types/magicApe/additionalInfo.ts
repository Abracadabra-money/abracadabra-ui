export type AdditionalInfo = {
  feePercent: number;
  rewardTokenPrice: bigint;
  rewardToken: RewardToken;
};

export type RewardToken = {
  icon: string;
  symbol: string;
};
