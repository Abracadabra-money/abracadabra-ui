import { BIPS } from "@/constants/global";
import { formatUnits, parseUnits, type PublicClient } from "viem";
import type { ChainConfig } from "@/configs/stake/magicGlp/magicGlpConfig";
import type { AdditionalInfo, RewardTokenInfo } from "@/helpers/stake/types";
import { getTotalRewards } from "@/helpers/stake/magicGlp/subgraph/getTotalRewards";

export const getAdditionalInfo = async (
  config: ChainConfig,
  chainId: number,
  publicClient: PublicClient
): Promise<AdditionalInfo> => {
  const { harvestor, chainLink } = config;
  const { rewardToken, leverageInfo } = config.additionalInfo;

  const [feePercentBips, rewardTokenPrice] = await publicClient.multicall({
    contracts: [
      {
        ...harvestor,
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

  const totalRewardsAmount = await getTotalRewards(chainId);
  const parseRewardTokenPrice = +formatUnits(
    rewardTokenPrice.result as bigint,
    8
  );
  const totalRewardsAmountUsd = +totalRewardsAmount * parseRewardTokenPrice;

  const rewardTokenInfo: RewardTokenInfo = {
    ...rewardToken,
    amount: parseUnits(totalRewardsAmount.toString(), 18) || 0n,
    amountUsd: parseUnits(totalRewardsAmountUsd.toString(), 18) || 0n,
  };

  return {
    feePercent: (feePercentBips.result as number) / BIPS,
    rewardToken: rewardTokenInfo,
    leverageInfo,
  };
};
