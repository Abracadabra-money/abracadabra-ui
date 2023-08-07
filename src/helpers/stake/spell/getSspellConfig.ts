import moment from "moment";
import { utils, BigNumber } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import type { SSpellConfig } from "@/helpers/stake/spell/spellTypes";

const zero = BigNumber.from("0");

const sSpellEmptyState = {
  name: spellConfig.sSpell.name,
  icon: spellConfig.sSpell.icon,
  rate: 1,
  lockTimestamp: "0",
  contract: null,
  balance: "0",
  isTokenApproved: false,
  approvedAmount: "0",
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
  const { decimals, name, icon }: any = spellConfig.sSpell;

  const isTokenApproved = account ? spell.allowance(account, address) : zero;
  const getBalance = account ? sSpell.balanceOf(account) : "0x00";
  const getUserInfo = account ? sSpell.users(account) : { lockedUntil: "0" };

  const multicallArr = [isTokenApproved, getBalance, getUserInfo];
  const response = await Promise.all(multicallArr);

  const sSpellPrice = +price * +sSpellRate;

  const lockTimestamp = moment
    .unix(response[2]?.lockedUntil?.toString() || 0)
    .add(1, "d");
  const currentTimestamp = moment();
  const isLocked = lockTimestamp.isAfter(currentTimestamp);

  return {
    name,
    icon,
    rate: sSpellRate,
    lockTimestamp: isLocked ? lockTimestamp.unix().toString() : "0",
    contract: sSpell,
    balance: utils.formatUnits(response[1], decimals),
    isTokenApproved: response[0].toString() > 0,
    approvedAmount: utils.formatUnits(response[0], decimals),
    price: sSpellPrice,
  };
};
