import type { ContractInfo } from "@/types/global";

export type SpellConfigs = {
  1: ChainSpellConfig;
  250: ChainSpellConfig;
  42161: ChainSpellConfig;
  43114: ChainSpellConfig;
};

export type ChainSpellConfig = {
  spell: DefaultConfig;
  sSpell?: SSpellConfig;
  mSpell: MSpellConfig;
};

export type DefaultConfig = {
  name: string;
  decimals: number;
  icon: string;
  abi?: any;
};

export type SSpellConfig = {
  name: string;
  decimals: number;
  icon: string;
  contract: ContractInfo;
  leverageInfo: any;
};

export type MSpellConfig = {
  name: string;
  decimals: number;
  icon: string;
  contract: ContractInfo;
  leverageInfo: any;
};
