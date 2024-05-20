import { parseUnits } from "viem";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { spellStakeConfig } from "@/configs/stake/spellConfig";
import { tokensChainLink } from "@/configs/chainLink/config";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getSpellInfo } from "@/helpers/stake/spell/getSpellInfo";
import type { SpellStakeInfo } from "@/helpers/stake/spell/types";
import { getMSpellInfo } from "@/helpers/stake/spell/getMSpellInfo";
import { getSSpellInfo } from "@/helpers/stake/spell/getSSpellInfo";
import { getStakeEmptyState } from "@/helpers/stake/spell/emptyState";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

export const getStakeInfo = async (): Promise<SpellStakeInfo[]> => {
  const { address } = await getAccountHelper();

  const price: number = await getTokenPriceByChain(
    tokensChainLink.spell.chainId,
    tokensChainLink.spell.address
  );

  const spellPrice = parseUnits(price.toString(), 18);

  if (!address) {
    return await Promise.all(
      Object.keys(spellStakeConfig).map(async (chainId: string) => {
        return await getStakeEmptyState(Number(chainId), spellPrice);
      })
    );
  }

  const { sSpellApr, mSpellApr } = await getSpellStakingApr();

  return await Promise.all(
    Object.keys(spellStakeConfig).map(async (chainId: string) => {
      const currentChainId = Number(chainId);
      const config =
        spellStakeConfig[currentChainId as keyof typeof spellStakeConfig];

      const publicClient = getPublicClient(currentChainId);

      const spell = await getSpellInfo(
        config,
        spellPrice,
        address,
        publicClient
      );

      const mSpell = await getMSpellInfo(
        config,
        spell,
        spellPrice,
        address,
        publicClient
      );

      const sSpell = await getSSpellInfo(
        config,
        spell,
        spellPrice,
        address,
        publicClient
      );

      return {
        chainId: currentChainId,
        spell,
        mSpell: { ...mSpell, apr: mSpellApr },
        sSpell: { ...sSpell, apr: sSpellApr },
      };
    })
  );
};
