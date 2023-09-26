import type {
  AdditionalInfo,
  RewardTokenInfo,
} from "@/types/magicGlp/additionalInfo";
import { formatUnits } from "viem";
import { multicall } from "@wagmi/core";
import { BIPS } from "@/constants/global";
import type { ChainConfig } from "@/types/magicGlp/configsInfo";
import { getTotalRewards } from "@/helpers/stake/magicGlp/subgraph/getTotalRewards";

export const getAdditionalInfo = async (
  config: ChainConfig,
  chainId: number
): Promise<AdditionalInfo> => {
  const { harvestor, chainLink } = config;
  const { rewardToken, leverageInfo } = config.additionalInfo;

  const [feePercentBips, rewardTokenPrice]: any = await multicall({
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

  const totalRewardsAmount: string = await getTotalRewards(chainId);
  const parseRewardTokenPrice = +formatUnits(rewardTokenPrice.result, 8);
  const totalRewardsAmountUsd = +totalRewardsAmount * parseRewardTokenPrice;

  const rewardTokenInfo: RewardTokenInfo = {
    ...rewardToken,
    amount: totalRewardsAmount || "0",
    amountUsd: totalRewardsAmountUsd,
  };

  return {
    feePercent: feePercentBips.result / BIPS,
    rewardToken: rewardTokenInfo,
    leverageInfo,
  };
};
