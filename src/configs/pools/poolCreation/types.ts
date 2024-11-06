import type { Address } from "viem";

export type PoolCreationTokenConfig = {
  chainId: number;
  address?: Address;
  name: string;
  symbol: string;
  decimals: number;
  icon?: string;
  logoURI?: string;
  isPopular?: boolean;
  isNative?: boolean;
  abi: any;
};

export type PoolCreationTokenInfo = {
  config: PoolCreationTokenConfig;
  price: number;
  userInfo: TokenUserInfo;
};

export type TokenUserInfo = {
  balance: bigint;
  allowance: bigint;
};
