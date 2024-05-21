import type { PublicClient } from "viem";
import type { ContractInfo } from "@/types/global";
import { ONE_ETHER_VIEM } from "@/constants/global";
import { MAINNET_SPELL_ADDRESS } from "@/constants/tokensAddress";

export const getSpellToSSpellRate = async (
  spell: ContractInfo,
  sSpell: ContractInfo,
  publicClient: PublicClient
) => {
  try {
    const [spellSSpellBalance, totalSupply] = await publicClient.multicall({
      contracts: [
        {
          address: MAINNET_SPELL_ADDRESS,
          abi: spell.abi,
          functionName: "balanceOf",
          args: [sSpell.address],
        },
        {
          ...sSpell,
          functionName: "totalSupply",
          args: [],
        },
      ],
    });

    return (
      ((spellSSpellBalance.result as bigint) * ONE_ETHER_VIEM) /
      (totalSupply.result as bigint)
    );
  } catch (error) {
    return ONE_ETHER_VIEM;
  }
};
