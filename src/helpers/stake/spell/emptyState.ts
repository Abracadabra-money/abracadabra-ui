import { useImage } from "@/helpers/useImage";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { ChainSpellConfig } from "@/types/spell/configsInfo";
import type { EmptySpellState, EmptyTokenState } from "@/types/spell/empyState";

const config = spellConfig[1 as keyof typeof spellConfig];
const { spell, sSpell, mSpell }: ChainSpellConfig = config;

export const sSpellEmptyState: EmptyTokenState = {
  icon: sSpell?.icon || useImage("assets/images/sspell-icon.svg"),
  name: sSpell?.name || "sSpell",
  balance: 0n,
  rate: 1n,
};

const spellEmptyState: EmptyTokenState = {
  icon: spell.icon,
  name: spell.name,
  balance: 0n,
  rate: 1n,
};

const mSpellEmptyState: EmptyTokenState = {
  icon: mSpell.icon,
  name: mSpell.name,
  balance: 0n,
  rate: 1n,
};

export const emptyState: EmptySpellState = {
  spell: spellEmptyState,
  sSpell: sSpellEmptyState,
  mSpell: mSpellEmptyState,
};
