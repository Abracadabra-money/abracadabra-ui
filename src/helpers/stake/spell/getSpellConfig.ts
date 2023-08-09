import { utils, BigNumber } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import { getTokenPriceByAddress } from "@/helpers/priceHelper";
import type { SpellConfig } from "@/helpers/stake/spell/spellTypes";

const zero = BigNumber.from("0");
const mainnetSpellAddress = "0x090185f2135308BaD17527004364eBcC2D37e5F6";
const { decimals, name, icon }: any = spellConfig.spell;

const spellEmptyState: SpellConfig = {
  name,
  icon,
  sSpellRate: 1,
  balance: "0",
  price: 1,
};

export const getSpellConfig = async (
  contracts: any,
  account: string | undefined
): Promise<SpellConfig> => {
  const { spell, sSpell } = contracts;

  if (!spell) return spellEmptyState;

  const getBalance = sSpell ? spell.balanceOf(sSpell?.address) : zero;
  const getTotalSupply = sSpell ? sSpell.totalSupply() : zero;
  const spellBalance = account ? spell.balanceOf(account) : zero;

  const multicallArr = [getBalance, getTotalSupply, spellBalance];
  const response = await Promise.all(multicallArr);

  const precision = BigNumber.from(Math.pow(10, decimals).toString());

  const sSpellRate = +response[0].toString()
    ? +utils.formatUnits(response[0].mul(precision).div(response[1], decimals))
    : 0;

  const price = await getTokenPriceByAddress(1, mainnetSpellAddress);

  return {
    icon,
    name,
    sSpellRate,
    balance: utils.formatUnits(response[2], decimals),
    price,
  };
};
