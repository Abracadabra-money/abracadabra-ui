import type { ContractInfo } from "@/types/global";
import type { EmptyTokenState } from "@/types/spell/empyState";

export type SpellInfo = {
  icon: string;
  name: string;
  decimals: number;
  balance: bigint;
  price: bigint;
  contract: ContractInfo;
};

export type MSpellInfo = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  price: bigint;
  rate: bigint;
  lockTimestamp: string;
  balance: bigint;
  allowanceAmount: bigint;
  claimableAmount: bigint;
  apr?: string;
};

export type SSpellInfo = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  price: bigint;
  rate: bigint;
  lockTimestamp: string;
  balance: bigint;
  allowanceAmount: bigint;
  claimableAmount: bigint;
  apr?: string;
};

export type SpellStakeInfo = {
  spell: SpellInfo | EmptyTokenState;
  mSpell: MSpellInfo | EmptyTokenState;
  sSpell: SSpellInfo | EmptyTokenState;
};
