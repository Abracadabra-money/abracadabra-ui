import moment from "moment";
import { formatUnits } from "viem";
import { useImage } from "@/helpers/useImage";
import type { Address, PublicClient } from "viem";
import { ONE_ETHER_VIEM } from "@/constants/global";
import type { SpellStakeConfig } from "@/configs/stake/spellConfig";
import type { MSpellInfo, SpellInfo } from "@/helpers/stake/spell/types";

export const getMSpellInfo = async (
  { mSpell }: SpellStakeConfig,
  spell: SpellInfo,
  price: bigint,
  account: Address,
  publicClient: PublicClient
): Promise<MSpellInfo> => {
  const [approvedAmount, totalSupply, mSpellUserInfo, rewardAmount] =
    await publicClient.multicall({
      contracts: [
        {
          ...spell.contract,
          functionName: "allowance",
          args: [account, mSpell.contract.address],
        },
        {
          ...spell.contract,
          functionName: "balanceOf",
          args: [mSpell.contract.address],
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

  const [userMSpellBalance, _, lastAdded] = mSpellUserInfo.result as bigint[];
  const formatLastAdded = Number(formatUnits(lastAdded, 0));
  const currentTimestamp = moment();
  const lastAddedTimestamp = formatLastAdded
    ? moment.unix(formatLastAdded).add(1, "d")
    : moment.unix(0);
  const isLocked = lastAddedTimestamp.isAfter(currentTimestamp);
  const lockTimestamp = isLocked ? lastAddedTimestamp.unix().toString() : "0";

  return {
    name: mSpell.name,
    icon: mSpell.icon,
    rateIcon: useImage("assets/images/mspell-icon.svg"),
    decimals: mSpell.decimals,
    contract: mSpell.contract,
    price: price,
    rate: ONE_ETHER_VIEM,
    lockTimestamp,
    balance: userMSpellBalance,
    approvedAmount: approvedAmount.result as bigint,
    claimableAmount: rewardAmount.result as bigint,
    totalSupply: totalSupply.result as bigint,
  };
};
