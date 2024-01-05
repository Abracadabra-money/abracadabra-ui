export type EmptyTokenState = {
  icon: string;
  name: string;
  balance: bigint;
  rate?: bigint;
  price?: bigint;
  decimals?: number;
  apr?: string;
};

export type EmptySpellState = {
  chainId: number;
  spell: EmptyTokenState;
  sSpell: EmptyTokenState;
  mSpell: EmptyTokenState;
};
