import type { Address } from "viem";

export type SpellInfo = {
  icon: string;
  name: string;
  decimals: number;
  balance: bigint;
  price: bigint;
  contract: {
    address: Address;
    abi: any;
  };
};

export type MSpellInfo = {
  name: string;
  icon: string;
  rateIcon: string;
  decimals: number;
  contract: {
    address: Address;
    abi: any;
  };
  price: bigint;
  rate: bigint;
  lockTimestamp: string;
  balance: bigint;
  approvedAmount: bigint;
  claimableAmount: bigint;
  apr?: string;
  totalSupply: bigint;
};

export type SSpellInfo = {
  name: string;
  icon: string;
  rateIcon: string;
  decimals: number;
  contract: {
    address: Address;
    abi: any;
  };
  price: bigint;
  rate: bigint;
  lockTimestamp: string;
  balance: bigint;
  approvedAmount: bigint;
  apr?: string;
  totalSupply: bigint;
};

export type SpellStakeInfo = {
  chainId: number;
  spell: SpellInfo;
  mSpell: MSpellInfo;
  sSpell: SSpellInfo;
};
