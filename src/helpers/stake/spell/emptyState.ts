import { useImage } from "@/helpers/useImage";
import { ONE_ETHER_VIEM } from "@/constants/global";
import { spellConfig } from "@/configs/stake/spellConfig";
import type { EmptySpellState, EmptyTokenState } from "@/types/spell/empyState";
import { getSpellToSSpellRate } from "@/helpers/stake/spell/getSpellToSSpellRate";
import { getSpellStakingApr } from "./getSpellStakingApr";

const config = spellConfig[1 as keyof typeof spellConfig];
const { spell, sSpell, mSpell }: any = config;

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
  claimableAmount: 0n,
  price: ONE_ETHER_VIEM,
  rate: ONE_ETHER_VIEM,
  decimals: 18,
};

export const getSSpellEmptyState = async (): Promise<EmptyTokenState> => {
  const spellToSSpellRate = await getSpellToSSpellRate(spell, sSpell.contract);

  return {
    icon: sSpell?.icon || useImage("assets/images/sspell-icon.svg"),
    rateIcon: useImage("assets/images/sspell-icon.svg"),
    name: sSpell?.name || "sSpell",
    balance: 0n,
    rate: spellToSSpellRate,
    price: ONE_ETHER_VIEM,
    decimals: 18,
  };
};

export const getSpellEmptyState = async (
  chainId: number
): Promise<EmptySpellState> => {
  const sSpell = await getSSpellEmptyState();

  const { sSpellApr, mSpellApr } = await getSpellStakingApr();

  return {
    chainId,
    sSpell: { ...sSpell, apr: sSpellApr },
    spell: spellEmptyState,
    mSpell: { ...mSpellEmptyState, apr: mSpellApr },
  };
};
