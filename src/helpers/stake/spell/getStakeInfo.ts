import { parseUnits } from "viem";
import { getAccount } from "@wagmi/core";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { spellConfig } from "@/utils/stake/spellConfig";
import { emptyState } from "@/helpers/stake/spell/emptyState";
import type { SpellStakeInfo } from "@/types/spell/stakeInfo";
import { getTokenPriceByAddress } from "@/helpers/priceHelper";
import { MAINNET_SPELL_ADDRESS } from "@/constants/tokensAddress";
import { getSpellInfo } from "@/helpers/stake/spell/getSpellInfo";
import { getMSpellInfo } from "@/helpers/stake/spell/getMSpellInfo";
import { getSSpellInfo } from "@/helpers/stake/spell/getSSpellInfo";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

export const getStakeInfo = async (
  chainId: number
): Promise<SpellStakeInfo> => {
  const account = getAccount().address;
  const config = spellConfig[chainId as keyof typeof spellConfig];
  if (!config || !account) return emptyState;

  const price: number = await getTokenPriceByAddress(
    MAINNET_CHAIN_ID,
    MAINNET_SPELL_ADDRESS
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
