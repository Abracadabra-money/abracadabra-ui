import type { MainParams } from "@/helpers/cauldron/types";

export const getMainParams = async (
  configs: Array<Object | undefined>,
  { lens }: any
): Promise<Array<MainParams>> => {
  const marketInfoResp = await Promise.all(
    configs.map((config: any) =>
      config.version === 2
        ? lens.getMarketInfoCauldronV2(config.contract.address)
        : lens.getMarketInfoCauldronV3(config.contract.address)
    )
  );

  return marketInfoResp.map((info: any) => {
    return {
      borrowFee: Number(info.borrowFee) / 100,
      interest: Number(info.interestPerYear) / 100,
      liquidationFee: Number(info.liquidationFee) / 100,
      collateralPrice: info.collateralPrice,
      mimLeftToBorrow: info.marketMaxBorrow,
      maximumCollateralRatio: info.maximumCollateralRatio,
      oracleExchangeRate: info.oracleExchangeRate,
      totalBorrowed: info.totalBorrowed,
      tvl: info.totalCollateral.value,
      userMaxBorrow: info.userMaxBorrow,
    };
  });
};
