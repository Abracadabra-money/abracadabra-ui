import { utils } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import { getTokenPriceByAddress } from "@/helpers/priceHelper";
import type { SpellInfo } from "@/helpers/stake/spell/types";
import { spellEmptyState } from "@/helpers/stake/spell/emptyStates";

const mainnetSpellAddress = "0x090185f2135308BaD17527004364eBcC2D37e5F6";

export const getSpellInfo = async (
  contracts: any,
  account: string | undefined
): Promise<SpellInfo> => {
  const { spell } = contracts;

  if (!spell || !account) return spellEmptyState;

  const [spellUserBalance] = await Promise.all([spell.balanceOf(account)]);

  const price = await getTokenPriceByAddress(1, mainnetSpellAddress);

  return {
    icon: spellConfig.spell.icon,
    name: spellConfig.spell.name,
    balance: utils.formatUnits(spellUserBalance),
    price,
  };
};
