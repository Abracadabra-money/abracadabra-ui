import { utils } from "ethers";

export const getAdditionalInfo = async (contracts: any, config: any) => {
  const { harvestorContract, chainLinkContract } = contracts;
  const { rewardToken, leverageInfo } = config.additionalInfo;

  const multicallArr = [
    harvestorContract.feePercentBips(),
    chainLinkContract.latestAnswer(),
  ];

  const [feePercentBips, rewardTokenPrice] = await Promise.all(multicallArr);

  return {
    feePercent: feePercentBips / 10000,
    rewardTokenPrice: +utils.formatUnits(rewardTokenPrice, 8),
    rewardToken,
    leverageInfo,
  };
};
