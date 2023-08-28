import { Contract } from "ethers";
import type { providers } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";

export const getContracts = async (
  provider: providers.BaseProvider,
  chainId: number
) => {
  const { spell, sSpell, mSpell }: any = spellConfig;

  const mSpellAddress = mSpell.addresses[chainId];

  const sSpellAddress = sSpell.addresses[chainId];

  const sSpellContract = sSpellAddress
    ? new Contract(sSpellAddress, JSON.stringify(sSpell.abi), provider)
    : null;

  const mSpellContract = mSpellAddress
    ? new Contract(mSpellAddress, JSON.stringify(mSpell.abi), provider)
    : null;

  const spellAddress = mSpellContract ? await mSpellContract?.spell() : null;
  const spellContract = spellAddress
    ? new Contract(spellAddress, JSON.stringify(spell.abi), provider)
    : null;

  return {
    spell: spellContract,
    sSpell: sSpellContract,
    mSpell: mSpellContract,
  };
};
