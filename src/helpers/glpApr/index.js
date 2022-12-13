const {
  GLP_DECIMALS,
  SECONDS_PER_YEAR,
  BASIS_POINTS_DIVISOR,
} = require("./constants");
const {
  getGmxPrice,
  getNativeTokenPrice,
  getAum,
  getStakingData,
  getBalanceAndSupplyData,
  bigNumberify,
  getFeePercent,
} = require("./helpers");

import { getCaulronTargetApy } from "./getCaulronTargetApy";

const { expandDecimals, formatAmount } = require("./utils");

const getGlpApr = async () => {
  const stakingData = await getStakingData();
  const aum = await getAum();
  const gmxPrice = await getGmxPrice();
  const nativeTokenPrice = await getNativeTokenPrice();
  const { supplyData } = await getBalanceAndSupplyData();
  const glpSupply = supplyData.glp;

  const glpPrice =
    glpSupply && glpSupply.gt(0)
      ? aum.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
      : bigNumberify(0);

  const glpSupplyUsd = glpSupply.mul(glpPrice).div(expandDecimals(1, 18));

  const stakedGlpTrackerAnnualRewardsUsd =
    stakingData.stakedGlpTracker.tokensPerInterval
      .mul(SECONDS_PER_YEAR)
      .mul(gmxPrice)
      .div(expandDecimals(1, 18));

  const glpAprForEsGmx =
    glpSupplyUsd && glpSupplyUsd.gt(0)
      ? stakedGlpTrackerAnnualRewardsUsd
          .mul(BASIS_POINTS_DIVISOR)
          .div(glpSupplyUsd)
      : bigNumberify(0);

  const feeGlpTrackerAnnualRewardsUsd =
    stakingData.feeGlpTracker.tokensPerInterval
      .mul(SECONDS_PER_YEAR)
      .mul(nativeTokenPrice)
      .div(expandDecimals(1, 18));

  const glpAprForNativeToken =
    glpSupplyUsd && glpSupplyUsd.gt(0)
      ? feeGlpTrackerAnnualRewardsUsd
          .mul(BASIS_POINTS_DIVISOR)
          .div(glpSupplyUsd)
      : bigNumberify(0);

  const glpAprTotal = glpAprForNativeToken.add(glpAprForEsGmx);
  const parseAmount = formatAmount(glpAprTotal, 2, 2, true);
  const feePercent = await getFeePercent();

  const fee = feePercent / 100;

  const WETHApy = parseAmount * (1 - fee);


  const caulronTargetApy = await getCaulronTargetApy()
  const targetApy = caulronTargetApy / 100;

  return Math.min(targetApy, WETHApy);
};

export { getGlpApr };
