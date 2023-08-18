import { utils } from "ethers";

export const getAdditionalInfo = async (contracts: any, config: any) => {
  const { magicApeContract, chainLinkContract } = contracts;
  const { rewardToken } = config;

  const [feePercent, rewardTokenPrice] = await Promise.all([
    magicApeContract.feePercentBips(),
    chainLinkContract.latestAnswer(),
  ]);

  return {
    feePercent: feePercent / 10000,
    rewardTokenPrice: utils.formatUnits(rewardTokenPrice, 8),
    rewardToken,
  };
};
