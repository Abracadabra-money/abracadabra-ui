export type EmptyTokenState = {
  icon: string;
  name: string;
  balance: bigint;
  rate?: bigint;
  price?: bigint;
  decimals?: number;
};

export type EmptySpellState = {
  spell: EmptyTokenState;
  sSpell: EmptyTokenState;
  mSpell: EmptyTokenState;
};
