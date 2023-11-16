import { applyFactor } from "../fee/applyFactor";

export const getSwapFee = (marketInfo, swapAmount, forPositiveImpact) => {
  const factor = forPositiveImpact
    ? marketInfo.swapFeeFactorForPositiveImpact
    : marketInfo.swapFeeFactorForNegativeImpact;
    
  return applyFactor(swapAmount, factor);
};
