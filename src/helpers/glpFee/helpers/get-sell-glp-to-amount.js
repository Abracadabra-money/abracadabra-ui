import bigNumberify from '../utils/big-numberify';
import adjustForDecimals from '../utils/adjust-for-decimals';
import getFeeBasisPoints from './get-fee-basis-points';
import { GLP_DECIMALS, PRECISION, BASIS_POINTS_DIVISOR, TAX_BASIS_POINTS, MINT_BURN_FEE_BASIS_POINTS } from '../constants';


module.exports = (toAmount, fromTokenAddress, infoTokens, glpPrice, usdgSupply, totalTokenWeights) => {
    const defaultValue = { amount: bigNumberify(0) };
  if (!toAmount || !fromTokenAddress || !infoTokens || !glpPrice || !usdgSupply || !totalTokenWeights) {
    return defaultValue;
  }

  const fromToken = infoTokens[fromTokenAddress];
  if (!fromToken || !fromToken.maxPrice) {
    return defaultValue;
  }

  let fromAmount = toAmount.mul(glpPrice).div(fromToken.maxPrice);
  fromAmount = adjustForDecimals(fromAmount, GLP_DECIMALS, fromToken.decimals);

  const usdgAmount = toAmount.mul(glpPrice).div(PRECISION);

  // in the Vault contract, the USDG supply is reduced before the fee basis points
  // is calculated
  usdgSupply = usdgSupply.sub(usdgAmount);

  // in the Vault contract, the token.usdgAmount is reduced before the fee basis points
  // is calculated
  const feeBasisPoints = getFeeBasisPoints(
    fromToken,
    fromToken?.usdgAmount?.sub(usdgAmount),
    usdgAmount,
    MINT_BURN_FEE_BASIS_POINTS,
    TAX_BASIS_POINTS,
    false,
    usdgSupply,
    totalTokenWeights
  );

  fromAmount = fromAmount.mul(BASIS_POINTS_DIVISOR - feeBasisPoints).div(BASIS_POINTS_DIVISOR);

  return { amount: fromAmount, feeBasisPoints };
}