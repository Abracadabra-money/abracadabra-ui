import type { ContractInfo } from "@/types/global";

export type PoolCreationTokenConfig = {
  name: string;
  chainId: number;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  isPopular?: boolean;
};

export type PoolCreationTokenInfo = {
  config: PoolCreationTokenConfig;
  userInfo: TokenUserInfo;
};

export type TokenUserInfo = {
  balance: bigint;
  allowance: bigint;
};
