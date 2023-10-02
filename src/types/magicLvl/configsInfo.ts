import type { ContractInfo } from "@/types/global";

export type MagicLvlConfig = {
  56: MagicLvlChainConfig;
};

export type MagicLvlChainConfig = {
  master: ContractInfo;
  harvestor: ContractInfo;
  tokensConfig: Array<MagicLvlTokensConfig>;
};

export type MagicLvlTokensConfig = {
  name: string;
  mainToken: MagicLvlTokenConfig;
  stakeToken: MagicLvlTokenConfig;
  oracle: ContractInfo;
  pid: number;
};

export type MagicLvlTokenConfig = {
  name: string;
  decimals: number;
  icon: string;
  contract: ContractInfo;
};
