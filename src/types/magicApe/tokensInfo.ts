export type TokensInfo = {
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
  tokensRate: bigint;
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
};

export type StakeTokenInfo = {
  name: string;
  icon: string;
  decimals: number;
  price: bigint;
  balance: bigint;
  balanceUsd: bigint;
  approvedAmount: bigint;
};
