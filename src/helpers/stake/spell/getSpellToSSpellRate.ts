import { readContracts } from "@wagmi/core";
import { ONE_ETHER_VIEM } from "@/constants/global";
import type { ContractInfo } from "@/types/global";

export const getSpellToSSpellRate = async (
  spell: ContractInfo,
  sSpell: ContractInfo
) => {
  try {
    const [spellSSpellBalance, totalSupply]: any = await readContracts({
      contracts: [
        {
          address: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
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

    return (spellSSpellBalance.result * ONE_ETHER_VIEM) / totalSupply.result;
  } catch (error) {
    return ONE_ETHER_VIEM;
  }
};
