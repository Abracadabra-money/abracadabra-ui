import moment from "moment";
import { utils, BigNumber } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { SSpellConfig } from "@/helpers/stake/spell/spellTypes";

const zero = BigNumber.from("0");
const { decimals, name, icon }: any = spellConfig.sSpell;

const sSpellEmptyState: SSpellConfig = {
  name,
  icon,
  rate: 1,
  lockTimestamp: 0,
  contract: null,
  balance: "0",
  approvedAmount: 0,
  unsupportedChain: true,
  price: 1,
};

export const getSspellConfig = async (
  contracts: any,
  account: string | undefined,
  spellInfo: any
): Promise<SSpellConfig> => {
  if (!contracts.sSpell) return sSpellEmptyState;

  const { sSpellRate, price } = spellInfo;
  const { sSpell, spell } = contracts;
  const { address } = sSpell;

  const allowanceAmount = account ? spell.allowance(account, address) : zero;
  const getBalance = account ? sSpell.balanceOf(account) : "0x00";
  const getUserInfo = account ? sSpell.users(account) : { lockedUntil: 0 };

  const multicallArr = [allowanceAmount, getBalance, getUserInfo];
  const response = await Promise.all(multicallArr);

  const sSpellPrice = price * sSpellRate;

  const lockTimestamp = moment
    .unix(response[2]?.lockedUntil?.toString() || 0)
    .add(1, "d");
  const currentTimestamp = moment();
  const isLocked = lockTimestamp.isAfter(currentTimestamp);

  return {
    name,
    icon,
    rate: sSpellRate,
    lockTimestamp: isLocked ? +lockTimestamp.unix().toString() : 0,
    contract: sSpell,
    balance: utils.formatUnits(response[1], decimals),
    approvedAmount: +utils.formatUnits(response[0], decimals),
    price: sSpellPrice,
  };
};
