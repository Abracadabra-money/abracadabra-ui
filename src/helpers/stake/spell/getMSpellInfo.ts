import moment from "moment";
import { utils } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { MSpellInfo, SpellInfo } from "@/helpers/stake/spell/types";
import { mSpellEmptyState } from "@/helpers/stake/spell/emptyStates";

export const getMSpellInfo = async (
  contracts: any,
  account: string | undefined,
  spellInfo: SpellInfo
): Promise<MSpellInfo> => {
  const { mSpell, spell } = contracts;
  if (!mSpell || !account) return mSpellEmptyState;

  const [allowanceAmount, mSpellUserInfo, rewardAmount] = await Promise.all([
    spell.allowance(account, mSpell.address),
    mSpell.userInfo(account),
    mSpell.pendingReward(account),
  ]);

  const lockTimestamp = +mSpellUserInfo.lastAdded
    ? moment.unix(mSpellUserInfo.lastAdded.toString()).add(1, "d")
    : moment.unix(0);

  const currentTimestamp = moment();
  const isLocked = lockTimestamp.isAfter(currentTimestamp);

  return {
    name: spellConfig.mSpell.name,
    icon: spellConfig.mSpell.icon,
    contract: mSpell,
    price: spellInfo.price,
    rate: 1,
    lockTimestamp: isLocked ? lockTimestamp.unix().toString() : "0",
    balance: utils.formatUnits(mSpellUserInfo.amount),
    allowanceAmount: utils.formatUnits(allowanceAmount),
    claimableAmount: utils.formatUnits(rewardAmount),
  };
};
