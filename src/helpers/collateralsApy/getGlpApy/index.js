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
  getMagicFeePercent
} = require("./helpers");

const { expandDecimals, formatAmount } = require("./utils");

const getGlpApy = async (itsMagic = false) => {
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

  if(itsMagic) {
    const fee = await getMagicFeePercent() / 10000;
    return ((Math.pow((1 + ((parseAmount/100) / 730)), 730) -1) * 100) * (1 - fee);
  } 

  const feePercent = await getFeePercent();

  const fee = feePercent / 100;

  return parseAmount * (1 - fee);
};

export { getGlpApy };
