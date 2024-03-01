import type { Address } from "viem";

type Contract = {
  address: Address;
  abi: any;
};

export type DepositedBalances = {
  unlocked: bigint;
  locked: bigint;
  total: bigint;
};

export type DepositTokenConfig = {
  name: string;
  icon: string;
  decimals: number;
  contract: Contract;
};

export type BlastStakeConfig = {
  contract: Contract;
  tokens: Array<DepositTokenConfig>;
};

export type BlastUserTokenInfo = {
  allowance: bigint;
  balance: bigint;
  balances: DepositedBalances;
  userBorrowPart: bigint;
};

export type BlastStakeTokenInfo = {
  caps: bigint;
  isSupported: boolean;
  totals: DepositedBalances;
  userInfo: BlastUserTokenInfo;
};

export type BlastStakeInfo = {
  config: BlastStakeConfig;
  state: 0 | 1 | 2; // TODO: check
  tokensInfo: Array<BlastStakeTokenInfo>;
};
