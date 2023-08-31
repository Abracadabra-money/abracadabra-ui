import { multicall } from "@wagmi/core";

export const getAdditionalInfoViem = async (config: any) => {
  const { mainToken, chainLink, rewardToken } = config;

  const [feePercent, rewardTokenPrice] = await multicall({
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

  //todo
  // const feePercentResult = feePercent.result / 10000;

  return {
    // feePercent: feePercent / 10000,
    feePercent: feePercent,
    rewardTokenPrice: rewardTokenPrice.result,
    rewardToken,
  };
};
