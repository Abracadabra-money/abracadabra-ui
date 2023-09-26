export type EmptyTokenState = {
  icon: string;
  name: string;
  balance: bigint;
  rate: bigint;
};

export type EmptySpellState = {
  spell: EmptyTokenState;
  sSpell: EmptyTokenState;
  mSpell: EmptyTokenState;
};
