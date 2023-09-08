import type { ContractInfo } from "../global";

export type CrvStakeConfig = {
  1: {
    mainToken: CrvTokenConfig;
    stakeToken: CrvTokenConfig;
    tokensRate: bigint;
  };
};

type CrvTokenConfig = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
};
