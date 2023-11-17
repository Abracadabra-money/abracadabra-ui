import { parseUnits } from "viem";
import { getAccount } from "@wagmi/core";
import { spellConfig } from "@/utils/stake/spellConfig";
import { tokensChainLink } from "@/utils/chainLink/config";
import type { SpellStakeInfo } from "@/types/spell/stakeInfo";
import { getSpellInfo } from "@/helpers/stake/spell/getSpellInfo";
import { getMSpellInfo } from "@/helpers/stake/spell/getMSpellInfo";
import { getSSpellInfo } from "@/helpers/stake/spell/getSSpellInfo";
import { getSpellEmptyState } from "@/helpers/stake/spell/emptyState";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

export const getStakeInfo = async (
  chainId: number
): Promise<SpellStakeInfo> => {
  const account = getAccount().address;
  const config = spellConfig[chainId as keyof typeof spellConfig];
  if (!config || !account) return await getSpellEmptyState();

  const price: number = await getTokenPriceByChain(
    tokensChainLink.spell.chainId,
    tokensChainLink.spell.address
  );

  const spellPrice = parseUnits(price.toString(), 18);

  const spell = await getSpellInfo(config, spellPrice, account);
  const mSpell = await getMSpellInfo(config, spell, spellPrice, account);
  const sSpell = await getSSpellInfo(config, spell, spellPrice, account);

  const { sSpellApr, mSpellApr } = await getSpellStakingApr();

  return {
    spell,
    mSpell: { ...mSpell, apr: mSpellApr },
    sSpell: { ...sSpell, apr: sSpellApr },
  };
};
