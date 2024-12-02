import type { ContractInfo } from "@/types/global";

export type PoolConfig = {
  id: string;
  isAdditionalConfig?: boolean;
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
  initialParameters: InitialParameters;
};

export type AdditionalPoolConfig = {
  id: string;
  chainId: number;
  isAdditionalConfig: boolean;
  rewardTokens?: TokenConfig[];
  settings?: {
    isNew: boolean;
    isDeprecated: boolean;
    isMim: boolean;
    rewardPointsType?: RewardPointsTypes;
  };
  stakeContract?: ContractInfo;
};

// TODO: may be changed in future
type PoolSettings = {
  isNew: boolean;
  isDeprecated: boolean;
  isMim: boolean;
  isPointsLogic?: boolean;
  rewardPointsType?: RewardPointsTypes;
};

type InitialParameters = {
  I: bigint;
  K: bigint;
  lpFeeRate: bigint;
};

export type TokenConfig = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  isPopular?: boolean;
};

export enum RewardPointsTypes {
  Elixir = "elixir",
  Pills = "pills",
}
