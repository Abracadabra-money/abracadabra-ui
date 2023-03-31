import adjustForDecimals from "../utils/adjust-for-decimals";
import getFeeBasisPoints from "./get-fee-basis-points";
import bigNumberify from "../utils/big-numberify";
import {
  GLP_DECIMALS,
  PRECISION,
  BASIS_POINTS_DIVISOR,
  TAX_BASIS_POINTS,
  MINT_BURN_FEE_BASIS_POINTS,
} from "../constants";

export default (
  toAmount,
  fromTokenAddress,
  infoTokens,
  glpPrice,
  usdgSupply,
  totalTokenWeights
) => {
  const defaultValue = { amount: bigNumberify(0) };
  if (
    !toAmount ||
    !fromTokenAddress ||
    !infoTokens ||
    !glpPrice ||
    !usdgSupply ||
    !totalTokenWeights
  ) {
    return defaultValue;
  }

  const fromToken = infoTokens[fromTokenAddress];
  if (!fromToken || !fromToken.minPrice) {
    return defaultValue;
  }

  let fromAmount = toAmount.mul(glpPrice).div(fromToken.minPrice);
  fromAmount = adjustForDecimals(fromAmount, GLP_DECIMALS, fromToken.decimals);

  const usdgAmount = toAmount.mul(glpPrice).div(PRECISION);
  const feeBasisPoints = getFeeBasisPoints(
    fromToken,
    fromToken.usdgAmount,
    usdgAmount,
    MINT_BURN_FEE_BASIS_POINTS,
    TAX_BASIS_POINTS,
    true,
    usdgSupply,
    totalTokenWeights
  );

  fromAmount = fromAmount
    .mul(BASIS_POINTS_DIVISOR)
    .div(BASIS_POINTS_DIVISOR - feeBasisPoints);

  return { amount: fromAmount, feeBasisPoints };
};
