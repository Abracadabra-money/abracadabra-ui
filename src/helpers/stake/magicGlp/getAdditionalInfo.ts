import { utils } from "ethers";
import { BIPS } from "@/constants/global";

export const getAdditionalInfo = async (contracts: any, config: any) => {
  const { harvestorContract, chainLinkContract } = contracts;
  const { rewardToken, leverageInfo } = config.additionalInfo;

  const multicallArr = [
    harvestorContract.feePercentBips(),
    chainLinkContract.latestAnswer(),
  ];

  const [feePercentBips, rewardTokenPrice] = await Promise.all(multicallArr);

  return {
    feePercent: feePercentBips / BIPS,
    rewardTokenPrice: +utils.formatUnits(rewardTokenPrice, 8),
    rewardToken,
    leverageInfo,
  };
};
