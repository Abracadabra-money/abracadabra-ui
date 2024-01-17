import moment from "moment";
import { useImage } from "@/helpers/useImage";
import { formatUnits, type Address } from "viem";
import { ONE_ETHER_VIEM } from "@/constants/global";
import type { EmptyTokenState } from "@/types/spell/empyState";
import type { ChainSpellConfig } from "@/types/spell/configsInfo";
import { getSSpellEmptyState } from "@/helpers/stake/spell/emptyState";
import type { SSpellInfo, SpellInfo } from "@/types/spell/stakeInfo";

export const getSSpellInfo = async (
  { sSpell }: ChainSpellConfig,
  spell: SpellInfo,
  spellPrice: bigint,
  account: Address,
  publicClient: any
): Promise<SSpellInfo | EmptyTokenState> => {
  if (!sSpell) return await getSSpellEmptyState();

  const [
    approvedAmount,
    spellSSpellBalance,
    aSpellUserBalance,
    sSpellUserInfo,
    totalSupply,
  ]: any = await publicClient.multicall({
    contracts: [
      {
        ...spell.contract,
        functionName: "allowance",
        args: [account, sSpell.contract.address],
      },
      {
        ...spell.contract,
        functionName: "balanceOf",
        args: [sSpell.contract.address],
      },
      {
        ...sSpell.contract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...sSpell.contract,
        functionName: "users",
        args: [account],
      },
      {
        ...sSpell.contract,
        functionName: "totalSupply",
        args: [],
      },
    ],
  });

  const spellToSSpellRate =
    (spellSSpellBalance.result * ONE_ETHER_VIEM) / totalSupply.result;

  const sSpellPrice = (spellPrice * spellToSSpellRate) / ONE_ETHER_VIEM;

  const currentTimestamp = moment();
  const [_, lockedUntil]: any = sSpellUserInfo.result;
  const formatLockedUntil = +formatUnits(lockedUntil, 0);
  const lockedUntilTimestamp = formatLockedUntil
    ? moment.unix(formatLockedUntil)
    : moment.unix(0);

  const isLocked = lockedUntilTimestamp.isAfter(currentTimestamp);
  const lockTimestamp = isLocked ? lockedUntilTimestamp.unix().toString() : "0";

  return {
    name: sSpell.name,
    icon: sSpell.icon,
    rateIcon: useImage("assets/images/sspell-icon.svg"),
    decimals: sSpell.decimals,
    contract: sSpell.contract,
    price: sSpellPrice,
    rate: spellToSSpellRate,
    lockTimestamp,
    balance: aSpellUserBalance.result,
    approvedAmount: approvedAmount.result,
  };
};
