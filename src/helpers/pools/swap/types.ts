import type { Address } from "viem";

type UserFeeRate = {
  lpFeeRate: bigint;
  mtFeeRate: bigint;
};

export type PMMState = {
  i: bigint;
  K: bigint;
  B: bigint;
  Q: bigint;
  B0: bigint;
  Q0: bigint;
  R: number;
};

export type MagicLPInfo = {
  contract: {
    address: Address;
    abi: any;
  };
  name: String;
  decimals: number;
  vaultReserve: any;
  totalSupply: bigint;
  midPrice: bigint;
  MAX_I: bigint;
  MAX_K: bigint;
  PMMState: PMMState;
  baseToken: Address;
  quoteToken: Address;
  icon: string;
  balances: {
    baseBalance: bigint;
    quoteBalance: bigint;
  };
  lpFeeRate: bigint;
  userInfo: MagicLPInfoUserInfo;
  statisticsData: any; // NOTICE: will update when we have the data
};

export type MagicLPInfoUserInfo = {
  allowance: bigint;
  balance: bigint;
  userFeeRate: UserFeeRate;
};
