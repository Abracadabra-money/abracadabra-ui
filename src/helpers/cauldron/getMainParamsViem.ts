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
      const { contract, interest } = configs[index];

      const contractExchangeRate = await publicClient.readContract({
        ...contract,
        functionName: "exchangeRate",
        args: [],
      });

      const updatePrice = contractExchangeRate
        ? contractExchangeRate !== marketInfo.oracleExchangeRate
        : false;

      return {
        updatePrice,
        borrowFee: Number(marketInfo.borrowFee) / 100,
        liquidationFee: Number(marketInfo.liquidationFee) / 100,
        interest: interest || Number(marketInfo.interestPerYear) / 100,
        collateralPrice: marketInfo.collateralPrice,
        mimLeftToBorrow: marketInfo.marketMaxBorrow,
        maximumCollateralRatio: marketInfo.maximumCollateralRatio,
        oracleExchangeRate: marketInfo.oracleExchangeRate,
        totalBorrowed: marketInfo.totalBorrowed,
        tvl: marketInfo.totalCollateral.value,
        userMaxBorrow: marketInfo.userMaxBorrow,
      };
    })
  );
};
