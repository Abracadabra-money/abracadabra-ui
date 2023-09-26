import { Contract, BigNumber } from "ethers";
import type { providers } from "ethers";
import type { MainParams } from "@/helpers/cauldron/types";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";
import lensAbi from "@/utils/abi/marketLens.js";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";

export const getMainParams = async (
  configs: Array<CauldronConfig>,
  provider: providers.BaseProvider,
  chainId: number,
  cauldron?: Contract | undefined
): Promise<Array<MainParams>> => {
  const lensAddress = getLensAddress(chainId);
  const lensContract = new Contract(lensAddress, lensAbi, provider);

  const marketInfoResp = await Promise.all(
    configs.map((config: any) =>
      config.version === 2
        ? lensContract.getMarketInfoCauldronV2(config.contract.address)
        : lensContract.getMarketInfoCauldronV3(config.contract.address)
    )
  );

  const contractExchangeRate: BigNumber[] | null = cauldron
    ? await Promise.all([cauldron?.exchangeRate()])
    : null;

  return marketInfoResp.map((info: any, index) => {
    const updatePrice = contractExchangeRate
      ? !contractExchangeRate[0].eq(info.oracleExchangeRate)
      : false;

    const localInterest = configs[index].interest;
    const interest = localInterest ? localInterest : Number(info.interestPerYear) / 100;

    return {
      borrowFee: Number(info.borrowFee) / 100,
      interest,
      liquidationFee: Number(info.liquidationFee) / 100,
      collateralPrice: info.collateralPrice,
      mimLeftToBorrow: info.marketMaxBorrow,
      maximumCollateralRatio: info.maximumCollateralRatio,
      oracleExchangeRate: info.oracleExchangeRate,
      totalBorrowed: info.totalBorrowed,
      tvl: info.totalCollateral.value,
      userMaxBorrow: info.userMaxBorrow,
      updatePrice,
    };
  });
};
