import type { Address } from "viem";
import type { PoolConfig } from "@/configs/pools/types";

type UserFeeRate = {
  lpFeeRate: bigint;
  mtFeeRate: bigint;
};

export enum RState {
  ONE,
  ABOVE_ONE,
  BELOW_ONE,
};

export type PMMState = {
  i: bigint;
  K: bigint;
  B: bigint;
  Q: bigint;
  B0: bigint;
  Q0: bigint;
  R: RState;
};

export type MagicLPInfo = {
  config: PoolConfig;
  baseTokenPrice: number;
  quoteTokenPrice: number;
  contract: {
    address: Address;
    abi: any;
  };
  name: String;
  decimals: number;
  vaultReserve: any;
  totalSupply: bigint;
  midPrice: number;
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
  poolAPR?: any;
  price?: number;
} & PoolConfig;

export type MagicLPInfoUserInfo = {
  allowance: bigint;
  balance: bigint;
  userFeeRate: UserFeeRate;
};
