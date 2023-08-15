import {
  GLP_DECIMALS,
  SECONDS_PER_YEAR,
  BASIS_POINTS_DIVISOR,
} from "@/helpers/collateralsApy/getMegicGlpApy/constants";
import { BigNumber, utils } from "ethers";

const precision = BigNumber.from(Math.pow(10, GLP_DECIMALS).toString());
const zero = BigNumber.from(0);

export const calculatedApy = async (
  stakingData: any,
  aum: BigNumber,
  prices: any,
  glpSupply: BigNumber,
  fees: any
) => {
  const glpPrice =
    glpSupply && glpSupply.gt(0) ? aum.mul(precision).div(glpSupply) : zero;

  const glpSupplyUsd = glpSupply.mul(glpPrice).div(precision);

  const stakedGlpTrackerAnnualRewardsUsd =
    stakingData.stakedGlpTracker.tokensPerInterval
      .mul(SECONDS_PER_YEAR)
      .mul(prices.gmxPrice)
      .div(precision);

  const glpAprForEsGmx =
    glpSupplyUsd && glpSupplyUsd.gt(0)
      ? stakedGlpTrackerAnnualRewardsUsd
          .mul(BASIS_POINTS_DIVISOR)
          .div(glpSupplyUsd)
      : zero;

  const feeGlpTrackerAnnualRewardsUsd =
    stakingData.feeGlpTracker.tokensPerInterval
      .mul(SECONDS_PER_YEAR)
      .mul(prices.nativeTokenPrice)
      .div(precision);

  const glpAprForNativeToken =
    glpSupplyUsd && glpSupplyUsd.gt(0)
      ? feeGlpTrackerAnnualRewardsUsd
          .mul(BASIS_POINTS_DIVISOR)
          .div(glpSupplyUsd)
      : zero;

  const glpAprTotal = glpAprForNativeToken.add(glpAprForEsGmx);
  const parseAmount = +utils.formatUnits(glpAprTotal, 2);

  const glpApy = parseAmount * (1 - fees.feePercent);

  const magicGlpApy =
    (Math.pow(1 + parseAmount / 100 / 730, 730) - 1) *
    100 *
    (1 - fees.feePercentBips);

  return { glpApy, magicGlpApy };
};
