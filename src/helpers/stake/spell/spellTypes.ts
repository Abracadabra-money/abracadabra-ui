import type { Contract } from "viem/dist/types/types/multicall";

export type SpellStakingApr = {
  sSpellApr: string;
  mSpellApr: string;
};

export type MSpellConfig = {
  name: string;
  icon: string;
  rate: number;
  lockTimestamp: number;
  contract: Contract | null;
  balance: string;
  claimableAmount: number;
  approvedAmount: number;
  unsupportedChain?: boolean;
  price: number;
};

export type SSpellConfig = {
  name: string;
  icon: string;
  rate: number;
  lockTimestamp: number;
  contract: Contract | null;
  balance: string;
  approvedAmount: number;
  unsupportedChain?: boolean;
  price: number;
};

export type SpellConfig = {
  icon: string;
  name: string;
  sSpellRate: number;
  balance: string;
  price: number;
};
