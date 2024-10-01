import type { ContractInfo } from "@/types/global";

export type PoolConfig = {
  id: number;
  chainId: number;
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  baseToken: TokenConfig;
  quoteToken: TokenConfig;
  lockContract?: ContractInfo;
  stakeContract?: ContractInfo;
  rewardTokens?: TokenConfig[];
  settings: PoolSettings;
};

// TODO: may be changed in future
type PoolSettings = {
  isNew: boolean;
  isDeprecated: boolean;
  isMim: boolean;
  isPointsLogic?: boolean;
};

export type TokenConfig = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  isPopular?: boolean;
};
