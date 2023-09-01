import { multicall } from "@wagmi/core";
import type { AdditionalInfo } from "@/types/magicApe/additionalInfo";

export const getAdditionalInfoViem = async (
  config: any
): Promise<AdditionalInfo> => {
  const { mainToken, chainLink, rewardToken } = config;

  const [feePercent, rewardTokenPrice]: any = await multicall({
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

  return {
    feePercent: feePercent?.result ? feePercent.result / 10000 : 0,
    rewardTokenPrice: rewardTokenPrice.result ? rewardTokenPrice.result : 0n,
    rewardToken,
  };
};
