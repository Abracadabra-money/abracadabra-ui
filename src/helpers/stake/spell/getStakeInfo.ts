import { createPublicClient, http, parseUnits } from "viem";
import { getAccount } from "@wagmi/core";
import { spellConfig } from "@/configs/stake/spellConfig";
import { tokensChainLink } from "@/utils/chainLink/config";
import { getSpellInfo } from "@/helpers/stake/spell/getSpellInfo";
import { getMSpellInfo } from "@/helpers/stake/spell/getMSpellInfo";
import { getSSpellInfo } from "@/helpers/stake/spell/getSSpellInfo";
import { getSpellEmptyState } from "@/helpers/stake/spell/emptyState";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";
import { chainsList } from "@/helpers/chains";

export const getStakeInfo = async () => {
  const account: any = getAccount().address;

  if (!account) {
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
    Object.keys(spellConfig).map(async (chainId: any) => {
      const config = spellConfig[chainId as keyof typeof spellConfig];

      const chain: any = chainsList[chainId as keyof typeof chainsList];

      const publicClient = createPublicClient({
        batch: {
          multicall: true,
        },
        chain: chain,
        transport: http(),
      });

      const spell = await getSpellInfo(
        config,
        spellPrice,
        account,
        publicClient
      );

      const mSpell = await getMSpellInfo(
        config,
        spell,
        spellPrice,
        account,
        publicClient
      );

      const sSpell = await getSSpellInfo(
        config,
        spell,
        spellPrice,
        account,
        publicClient
      );

      const { sSpellApr, mSpellApr } = await getSpellStakingApr();

      return {
        chainId: Number(chainId),
        spell,
        mSpell: { ...mSpell, apr: mSpellApr },
        sSpell: { ...sSpell, apr: sSpellApr },
      };
    })
  );
};
