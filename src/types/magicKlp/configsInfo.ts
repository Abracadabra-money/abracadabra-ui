import type { ContractInfo } from "@/types/global";

export type MagicKlpConfigs = {
  2222: ChainConfig;
};

export type ChainConfig = {
  mainToken: {
    name: string;
    decimals: number;
    icon: string;
    rateIcon: string;
    contract: ContractInfo;
  };
  stakeToken: {
    name: string;
    decimals: number;
    icon: string;
    contract: ContractInfo;
  };
  manager: {
    contract: ContractInfo;
  };
  reader: {
    contract: ContractInfo;
  };
};
