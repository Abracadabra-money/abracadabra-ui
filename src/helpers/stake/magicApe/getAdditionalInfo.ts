import { parseUnits } from "viem";
import { getTotalRewards } from "./subgraph/getTotalRewards";
import type { AdditionalInfo } from "@/types/magicApe/additionalInfo";

export const getAdditionalInfo = async (
  config: any,
  publicClient: any
): Promise<AdditionalInfo> => {
  const { mainToken, chainLink } = config;
  const { rewardToken, leverageInfo } = config.additionalInfo;

  const [feePercent, rewardTokenPrice]: any = await publicClient.multicall({
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

  const totalReward: string = await getTotalRewards();
  const totalRewardAmount = parseUnits(totalReward, rewardToken.decimals);
  const totalRewardUsd =
    (totalRewardAmount * rewardTokenPrice.result) / 100000000n;

  const rewardTokenInfo = {
    ...rewardToken,
    amount: totalRewardAmount,
    amountUsd: totalRewardUsd,
  };

  return {
    feePercent: feePercent?.result ? feePercent.result / 10000 : 0,
    rewardToken: rewardTokenInfo,
    leverageInfo,
  };
};
