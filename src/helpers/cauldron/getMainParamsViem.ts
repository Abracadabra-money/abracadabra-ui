import { formatUnits } from "viem";
import type { PublicClient } from "viem";
import type { MainParams } from "@/types/cauldron";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";
import { getLensContractViem } from "@/helpers/cauldron/getLensContractViem";

export const getMainParamsViem = async (
  configs: CauldronConfig[],
  publicClient: PublicClient
): Promise<MainParams[]> => {
  const cauldronMarketInfo = await Promise.all(
    configs.map(({ version, contract }: CauldronConfig) => {
      return publicClient.readContract({
        ...getLensContractViem(publicClient.chain!.id),
        functionName: `getMarketInfoCauldronV${version === 2 ? 2 : 3}`,
        args: [contract.address],
      });
    })
  );

  return await Promise.all(
    cauldronMarketInfo.map(async (marketInfo: any, index: number) => {
      const { contract, interest: localInterest } = configs[index];

      const contractExchangeRate = await publicClient.readContract({
        ...contract,
        functionName: "exchangeRate",
        args: [],
      });

      const updatePrice = contractExchangeRate
        ? contractExchangeRate !== marketInfo.oracleExchangeRate
        : false;

      const interest = localInterest
        ? localInterest
        : +formatUnits(marketInfo.interestPerYear, 0) / 100;

      return {
        borrowFee: +formatUnits(marketInfo.borrowFee, 0) / 100,
        interest,
        liquidationFee: +formatUnits(marketInfo.liquidationFee, 2),
        collateralPrice: marketInfo.collateralPrice,
        mimLeftToBorrow: marketInfo.marketMaxBorrow,
        maximumCollateralRatio: marketInfo.maximumCollateralRatio,
        oracleExchangeRate: marketInfo.oracleExchangeRate,
        totalBorrowed: marketInfo.totalBorrowed,
        tvl: marketInfo.totalCollateral.value,
        userMaxBorrow: marketInfo.userMaxBorrow,
        updatePrice,
      };
    })
  );
};
