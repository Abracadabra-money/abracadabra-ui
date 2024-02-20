export type EmptyTokenState = {
  icon: string;
  name: string;
  rateIcon?: string;
  balance: bigint;
  claimableAmount?: bigint;
  rate?: bigint;
  price?: bigint;
  decimals?: number;
  apr?: string;
  totalSupply?: bigint
};

export type EmptySpellState = {
  chainId: number;
  spell: EmptyTokenState;
  sSpell: EmptyTokenState;
  mSpell: EmptyTokenState;
};
