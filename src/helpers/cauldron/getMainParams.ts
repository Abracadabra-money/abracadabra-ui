import { Contract } from "ethers";
import type { providers } from "ethers";
import type { MainParams } from "@/helpers/cauldron/types";
import lensAbi from "@/utils/abi/marketLens.js";
const lensAddress = "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";

export const getMainParams = async (
  configs: Array<Object | undefined>,
  provider: providers.BaseProvider
): Promise<Array<MainParams>> => {
  const lensContract = new Contract(lensAddress, lensAbi, provider);

  const marketInfoResp = await Promise.all(
    configs.map((config: any) =>
      config.version === 2
        ? lensContract.getMarketInfoCauldronV2(config.contract.address)
        : lensContract.getMarketInfoCauldronV3(config.contract.address)
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
