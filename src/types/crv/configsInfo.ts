import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";

export type CrvStakeConfig = {
  1: {
    mainToken: CrvTokenConfig;
    stakeToken: CrvTokenConfig;
    tokensRate: bigint;
  };
};

export type CrvTokenConfig = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
};

export type CollateralConfig = {
  id: Number;
  chain: Number;
  title: String;
  type: String;
  data: {
    address?: Address;
    isThreeCrypto?: boolean;
    label?: string;
  };
};
