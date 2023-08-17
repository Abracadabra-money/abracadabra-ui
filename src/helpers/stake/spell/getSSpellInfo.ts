import moment from "moment";
import { utils, BigNumber } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { SSpellInfo } from "@/helpers/stake/spell/types";
import { sSpellEmptyState } from "@/helpers/stake/spell/emptyStates";

const precision = BigNumber.from(Math.pow(10, 18).toString());

export const getSSpellInfo = async (
  contracts: any,
  account: string | undefined,
  spellInfo: any
): Promise<SSpellInfo> => {
  const { sSpell, spell } = contracts;
  if (!sSpell || !account) return sSpellEmptyState;

  const [
    allowanceAmount,
    aSpellUserBalance,
    sSpellUserInfo,
    spellSSpellBalance,
    totalSupply,
  ] = await Promise.all([
    spell.allowance(account, sSpell.address),
    sSpell.balanceOf(account),
    sSpell.users(account),
    spell.balanceOf(sSpell.address),
    sSpell.totalSupply(),
  ]);

  const lockTimestamp = +sSpellUserInfo.lockedUntil
    ? moment.unix(sSpellUserInfo.lockedUntil).add(1, "d")
    : moment.unix(0);

  const currentTimestamp = moment();
  const isLocked = lockTimestamp.isAfter(currentTimestamp);

  const spellToSSpellRate = +utils.formatUnits(
    spellSSpellBalance.mul(precision).div(totalSupply)
  );

  const sSpellPrice = spellInfo.price * spellToSSpellRate;

  return {
    name: spellConfig.sSpell.name,
    icon: spellConfig.sSpell.icon,
    contract: sSpell,
    price: sSpellPrice,
    rate: spellToSSpellRate,
    lockTimestamp: isLocked ? lockTimestamp.unix().toString() : "0",
    balance: utils.formatUnits(aSpellUserBalance),
    allowanceAmount: utils.formatUnits(allowanceAmount),
  };
};
