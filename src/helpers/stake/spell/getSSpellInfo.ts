import moment from "moment";
import { useImage } from "@/helpers/useImage";
import { ONE_ETHER_VIEM } from "@/constants/global";
import { formatUnits, type Address, type PublicClient } from "viem";
import type { SpellStakeConfig } from "@/configs/stake/spellConfig";
import type { SSpellInfo, SpellInfo } from "@/helpers/stake/spell/types";

export const getSSpellInfo = async (
  { sSpell }: SpellStakeConfig,
  spell: SpellInfo,
  spellPrice: bigint,
  account: Address,
  publicClient: PublicClient
): Promise<SSpellInfo> => {
  if (!sSpell)
    return {
      name: "sSPELL",
      icon: useImage("assets/images/tokens/sSPELL.png"),
      rateIcon: useImage("assets/images/sspell-icon.svg"),
      decimals: 18,
      contract: {
        address: "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9",
        abi: [],
      },
      price: 1n,
      rate: 1n,
      lockTimestamp: "0",
      balance: 0n,
      approvedAmount: 0n,
      totalSupply: 0n,
    };

  const [
    approvedAmount,
    spellSSpellBalance,
    aSpellUserBalance,
    sSpellUserInfo,
    totalSupply,
  ] = await publicClient.multicall({
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
    ((spellSSpellBalance.result as bigint) * ONE_ETHER_VIEM) /
    (totalSupply.result as bigint);

  const sSpellPrice = (spellPrice * spellToSSpellRate) / ONE_ETHER_VIEM;

  const currentTimestamp = moment();
  const [_, lockedUntil] = sSpellUserInfo.result as bigint[];
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
    balance: aSpellUserBalance.result as bigint,
    approvedAmount: approvedAmount.result as bigint,
    totalSupply: totalSupply.result as bigint,
  };
};
