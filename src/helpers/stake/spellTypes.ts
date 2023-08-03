import type { Contract } from "viem/dist/types/types/multicall";

export type SpellStakingApr = {
  sSpellApr: string;
  mSpellApr: string;
};

export type MSpellConfig = {
  name: string;
  icon: string;
  rate: number;
  lockTimestamp: string;
  contract: Contract | null;
  balance: string;
  claimableAmount: string;
  isTokenApproved: boolean;
  approvedAmount: string;
  unsupportedChain?: boolean;
};

export type SSpellConfig = {
  name: string;
  icon: string;
  rate: number;
  lockTimestamp: string;
  contract: Contract | null;
  balance: string;
  isTokenApproved: boolean;
  approvedAmount: string;
  unsupportedChain?: boolean;
};

export type SpellConfig = {
  icon: string;
  name: string;
  sSpellRate: number;
  balance: string;
};
