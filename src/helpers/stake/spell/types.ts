import type { Contract } from "viem/dist/types/types/multicall";

export type SpellStakingApr = {
  sSpellApr: string;
  mSpellApr: string;
};

export type MSpellInfo = {
  name: string;
  icon: string;
  rate: number;
  lockTimestamp: string;
  contract: Contract | null;
  balance: string;
  claimableAmount: string;
  allowanceAmount: string;
  unsupportedChain?: boolean;
  price: number;
};

export type SSpellInfo = {
  name: string;
  icon: string;
  rate: number;
  lockTimestamp: string;
  contract: Contract | null;
  balance: string;
  allowanceAmount: string;
  unsupportedChain?: boolean;
  price: number;
};

export type SpellInfo = {
  icon: string;
  name: string;
  balance: string;
  price: number;
};
