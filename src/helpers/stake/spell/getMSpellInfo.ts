import moment from "moment";
import { formatUnits, type Address } from "viem";
import { ONE_ETHER_VIEM } from "@/constants/global";
import type { ChainSpellConfig } from "@/types/spell/configsInfo";
import type { MSpellInfo, SpellInfo } from "@/types/spell/stakeInfo";

export const getMSpellInfo = async (
  { mSpell }: ChainSpellConfig,
  spell: SpellInfo,
  price: bigint,
  account: Address,
  publicClient: any
): Promise<MSpellInfo> => {
  const [approvedAmount, mSpellUserInfo, rewardAmount]: any =
    await publicClient.multicall({
      contracts: [
        {
          ...spell.contract,
          functionName: "allowance",
          args: [account, mSpell.contract.address],
        },
        {
          ...mSpell.contract,
          functionName: "userInfo",
          args: [account],
        },
        {
          ...mSpell.contract,
          functionName: "pendingReward",
          args: [account],
        },
      ],
    });

  const [userMSpellBalance, _, lastAdded]: any = mSpellUserInfo.result;
  const formatLastAdded = +formatUnits(lastAdded, 0);
  const currentTimestamp = moment();
  const lastAddedTimestamp = formatLastAdded
    ? moment.unix(formatLastAdded).add(1, "d")
    : moment.unix(0);
  const isLocked = lastAddedTimestamp.isAfter(currentTimestamp);
  const lockTimestamp = isLocked ? lastAddedTimestamp.unix().toString() : "0";

  return {
    name: mSpell.name,
    icon: mSpell.icon,
    decimals: mSpell.decimals,
    contract: mSpell.contract,
    price: price,
    rate: ONE_ETHER_VIEM,
    lockTimestamp,
    balance: userMSpellBalance,
    approvedAmount: approvedAmount.result,
    claimableAmount: rewardAmount.result,
    leverageInfo: mSpell.leverageInfo,
  };
};
