import moment from "moment";
import { utils, BigNumber } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { MSpellConfig } from "@/helpers/stake/spell/spellTypes";

const zero = BigNumber.from("0");
const { name, icon, decimals } = spellConfig.mSpell;

const mSpellEmptyState = {
  name,
  icon,
  rate: 1,
  lockTimestamp: 0,
  contract: null,
  balance: "0",
  claimableAmount: 0,
  approvedAmount: 0,
  unsupportedChain: true,
  price: 1,
};

export const getMspellConfig = async (
  contracts: any,
  account: string | undefined,
  spellInfo: any
): Promise<MSpellConfig> => {
  if (!contracts.mSpell) return mSpellEmptyState;
  const { mSpell, spell } = contracts;

  const allowanceAmount = account
    ? spell.allowance(account, mSpell.address)
    : "0x00";

  const userInfo = account ? mSpell.userInfo(account) : { lastAdded: 0 };
  const claimableAmount = account ? mSpell.pendingReward(account) : "0x00";

  const multicallArr = [allowanceAmount, userInfo, claimableAmount];

  const response = await Promise.all(multicallArr);

  const { lastAdded } = response[1];
  const lockTimestamp = moment.unix(lastAdded.toString() || 0).add(1, "d");
  const currentTimestamp = moment();
  const isLocked = lockTimestamp.isAfter(currentTimestamp);

  return {
    name,
    icon,
    rate: 1,
    lockTimestamp: isLocked ? +lockTimestamp.unix().toString() : 0,
    contract: mSpell,
    balance: utils.formatUnits(response[1]?.amount || zero, decimals),
    claimableAmount: +utils.formatUnits(response[2], decimals),
    approvedAmount: +utils.formatUnits(response[0], decimals),
    price: spellInfo.price,
  };
};
