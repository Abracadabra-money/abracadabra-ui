import { readContract, type Address } from "@wagmi/core";
import type { SpellInfo } from "@/types/spell/stakeInfo";
import type { ChainSpellConfig } from "@/types/spell/configsInfo";

export const getSpellInfo = async (
  { mSpell, spell }: ChainSpellConfig,
  price: bigint,
  account: Address
): Promise<SpellInfo> => {
  const spellAddress: any = await readContract({
    ...mSpell.contract,
    functionName: "spell",
    args: [],
  });

  const spellUserBalance: any = await readContract({
    address: spellAddress,
    abi: spell.abi,
    functionName: "balanceOf",
    args: [account],
  });

  return {
    icon: spell.icon,
    name: spell.name,
    decimals: spell.decimals,
    balance: spellUserBalance,
    price,
    contract: {
      address: spellAddress,
      abi: spell.abi,
    },
  };
};
