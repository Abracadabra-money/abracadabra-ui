import { readContracts } from "@wagmi/core";
import { useImage } from "@/helpers/useImage";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { EmptySpellState, EmptyTokenState } from "@/types/spell/empyState";
import { ONE_ETHER_VIEM } from "@/constants/global";

const config = spellConfig[1 as keyof typeof spellConfig];
const { spell, sSpell, mSpell }: any = config;

let spellToSSpellRate;

try {
  const [spellSSpellBalance, totalSupply]: any = await readContracts({
    contracts: [
      {
        address: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
        abi: spell.abi,
        functionName: "balanceOf",
        args: [sSpell.contract.address],
      },
      {
        ...sSpell.contract,
        functionName: "totalSupply",
        args: [],
      },
    ],
  });

  spellToSSpellRate =
    (spellSSpellBalance.result * ONE_ETHER_VIEM) / totalSupply.result;
} catch (error) {
  spellToSSpellRate = 1000000000000000000n;
}

export const sSpellEmptyState: EmptyTokenState = {
  icon: sSpell?.icon || useImage("assets/images/sspell-icon.svg"),
  name: sSpell?.name || "sSpell",
  balance: 0n,
  rate: spellToSSpellRate,
  price: 1000000000000000000n,
  decimals: 18,
};

const spellEmptyState: EmptyTokenState = {
  icon: spell.icon,
  name: spell.name,
  balance: 0n,
  price: 1000000000000000000n,
  rate: 1000000000000000000n,
  decimals: 18,
};

const mSpellEmptyState: EmptyTokenState = {
  icon: mSpell.icon,
  name: mSpell.name,
  balance: 0n,
  price: 1000000000000000000n,
  rate: 1000000000000000000n,
  decimals: 18,
};

export const emptyState: EmptySpellState = {
  spell: spellEmptyState,
  sSpell: sSpellEmptyState,
  mSpell: mSpellEmptyState,
};
