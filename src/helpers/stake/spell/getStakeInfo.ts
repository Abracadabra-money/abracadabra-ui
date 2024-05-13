import { parseUnits } from "viem";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { spellConfig } from "@/configs/stake/spellConfig";
import { tokensChainLink } from "@/configs/chainLink/config";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getSpellInfo } from "@/helpers/stake/spell/getSpellInfo";
import { getMSpellInfo } from "@/helpers/stake/spell/getMSpellInfo";
import { getSSpellInfo } from "@/helpers/stake/spell/getSSpellInfo";
import { getSpellEmptyState } from "@/helpers/stake/spell/emptyState";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

export const getStakeInfo = async () => {
  const { address } = await getAccountHelper();

  if (!address) {
    return await Promise.all(
      Object.keys(spellConfig).map(async (chainId: any) => {
        return await getSpellEmptyState(Number(chainId));
      })
    );
  }

  const price: number = await getTokenPriceByChain(
    tokensChainLink.spell.chainId,
    tokensChainLink.spell.address
  );

  const spellPrice = parseUnits(price.toString(), 18);

  return await Promise.all(
    Object.keys(spellConfig).map(async (chainId: string) => {
      const currentChainId = Number(chainId);
      const config = spellConfig[currentChainId as keyof typeof spellConfig];

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

      const { sSpellApr, mSpellApr } = await getSpellStakingApr();

      return {
        chainId: currentChainId,
        spell,
        mSpell: { ...mSpell, apr: mSpellApr },
        sSpell: { ...sSpell, apr: sSpellApr },
      };
    })
  );
};
