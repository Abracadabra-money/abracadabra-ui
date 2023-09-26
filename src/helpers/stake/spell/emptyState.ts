import { useImage } from "@/helpers/useImage";
import { ONE_ETHER_VIEM } from "@/constants/global";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { EmptySpellState, EmptyTokenState } from "@/types/spell/empyState";
import { getSpellToSSpellRate } from "@/helpers/stake/spell/getSpellToSSpellRate";

const config = spellConfig[1 as keyof typeof spellConfig];
const { spell, sSpell, mSpell }: any = config;

export const sSpellEmptyState: EmptyTokenState = {
  icon: sSpell?.icon || useImage("assets/images/sspell-icon.svg"),
  name: sSpell?.name || "sSpell",
  balance: 0n,
  rate: await getSpellToSSpellRate(spell, sSpell.contract),
  price: ONE_ETHER_VIEM,
  decimals: 18,
};

const spellEmptyState: EmptyTokenState = {
  icon: spell.icon,
  name: spell.name,
  balance: 0n,
  price: ONE_ETHER_VIEM,
  rate: ONE_ETHER_VIEM,
  decimals: 18,
};

const mSpellEmptyState: EmptyTokenState = {
  icon: mSpell.icon,
  name: mSpell.name,
  balance: 0n,
  price: ONE_ETHER_VIEM,
  rate: ONE_ETHER_VIEM,
  decimals: 18,
};

export const emptyState: EmptySpellState = {
  spell: spellEmptyState,
  sSpell: sSpellEmptyState,
  mSpell: mSpellEmptyState,
};
