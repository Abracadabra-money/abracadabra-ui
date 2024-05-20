import type { Address, PublicClient } from "viem";
import type { SpellInfo } from "@/helpers/stake/spell/types";
import type { SpellStakeConfig } from "@/configs/stake/spellConfig";

export const getSpellInfo = async (
  { mSpell, spell }: SpellStakeConfig,
  price: bigint,
  account: Address,
  publicClient: PublicClient
): Promise<SpellInfo> => {
  const spellAddress = (await publicClient.readContract({
    ...mSpell.contract,
    functionName: "spell",
    args: [],
  })) as Address;

  const spellUserBalance = (await publicClient.readContract({
    address: spellAddress,
    abi: spell.abi,
    functionName: "balanceOf",
    args: [account],
  })) as bigint;

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
