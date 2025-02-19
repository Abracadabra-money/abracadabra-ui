import {
  GLP_DECIMALS,
  SECONDS_PER_YEAR,
  BASIS_POINTS_DIVISOR,
} from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import { formatUnits, parseUnits } from "viem";

const precision = parseUnits("1", GLP_DECIMALS);

export const calculatedApy = async (
  stakingData: any,
  aum: bigint,
  prices: any,
  glpSupply: bigint,
  fees: any
) => {
  const glpPrice =
    glpSupply && glpSupply > 0n ? (aum * precision) / glpSupply : 0n;

  const glpSupplyUsd = (glpPrice * glpSupply) / precision;

  const stakedGlpTrackerAnnualRewardsUsd =
    (stakingData.stakedGlpTracker.tokensPerInterval
      * BigInt(SECONDS_PER_YEAR)
      * prices.gmxPrice) / (precision);

  const glpAprForEsGmx =
    glpSupplyUsd && glpSupplyUsd > 0n
      ? (stakedGlpTrackerAnnualRewardsUsd
        * BigInt(BASIS_POINTS_DIVISOR))
      / glpSupplyUsd
      : 0n;

  const feeGlpTrackerAnnualRewardsUsd =
    (stakingData.feeGlpTracker.tokensPerInterval
      * BigInt(SECONDS_PER_YEAR)
      * prices.nativeTokenPrice)
    / precision;

  const glpAprForNativeToken =
    glpSupplyUsd && glpSupplyUsd > 0n
      ? (feeGlpTrackerAnnualRewardsUsd
        * BigInt(BASIS_POINTS_DIVISOR))
      / glpSupplyUsd
      : 0n;

  const glpAprTotal = glpAprForNativeToken + glpAprForEsGmx;
  const parseAmount = Number(formatUnits(glpAprTotal, 2));

  const glpApy = parseAmount * (1 - fees.feePercent);

  const magicGlpApy =
    (Math.pow(1 + parseAmount / 100 / 730, 730) - 1) *
    100 *
    (1 - fees.feePercentBips);

  return { glpApy, magicGlpApy };
};
