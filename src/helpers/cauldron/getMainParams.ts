import type { providers } from "ethers";
import lensAbi from "@/abis/marketLens.js";
import { Contract, BigNumber, utils } from "ethers";
import type { MainParams } from "@/helpers/cauldron/types";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

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
        ? lensContract
            .getMarketInfoCauldronV2(config.contract.address)
            .catch(() => null)
        : lensContract
            .getMarketInfoCauldronV3(config.contract.address)
            .catch(() => null)
    )
  );

  const contractExchangeRate: BigNumber[] | null = cauldron
    ? await Promise.all([cauldron?.exchangeRate()])
    : null;

  return marketInfoResp.map((info: any, index) => {
    const localInterest: any = configs[index].interest;

    if (!info)
      return {
        borrowFee: 0,
        interest: +localInterest ? +localInterest : 0,
        liquidationFee: 0,
        collateralPrice: BigNumber.from(0),
        mimLeftToBorrow: BigNumber.from(0),
        maximumCollateralRatio: BigNumber.from(0),
        oracleExchangeRate: utils.parseUnits(
          "1",
          configs[index].collateralInfo.decimals
        ),
        totalBorrowed: BigNumber.from(0),
        tvl: BigNumber.from(0),
        userMaxBorrow: BigNumber.from(0),
        updatePrice: false,
      };

    const updatePrice = contractExchangeRate
      ? !contractExchangeRate[0].eq(info.oracleExchangeRate)
      : false;

    const interest = localInterest
      ? localInterest
      : Number(info.interestPerYear) / 100;

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
