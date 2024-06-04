import { parseUnits, type PublicClient } from "viem";
import type { AdditionalInfo } from "@/helpers/stake/types";
import type { MagicApeConfig } from "@/configs/stake/magicApeConfig";
import { getTotalRewards } from "@/helpers/stake/magicApe/subgraph/getTotalRewards";

export const getAdditionalInfo = async (
  config: MagicApeConfig,
  publicClient: PublicClient
): Promise<AdditionalInfo> => {
  const { mainToken, chainLink } = config;
  const { rewardToken, leverageInfo } = config.additionalInfo;

  const [feePercent, rewardTokenPrice] = await publicClient.multicall({
    contracts: [
      {
        ...mainToken.contract,
        functionName: "feePercentBips",
        args: [],
      },
      {
        ...chainLink,
        functionName: "latestAnswer",
        args: [],
      },
    ],
  });

  const totalReward = await getTotalRewards();
  const totalRewardAmount = parseUnits(totalReward, rewardToken.decimals);
  const totalRewardUsd =
    (totalRewardAmount * (rewardTokenPrice.result as bigint)) / 100000000n;

  const rewardTokenInfo = {
    ...rewardToken,
    amount: totalRewardAmount,
    amountUsd: totalRewardUsd,
  };

  return {
    feePercent: feePercent?.result ? (feePercent.result as number) / 10000 : 0,
    rewardToken: rewardTokenInfo,
    leverageInfo,
  };
};
