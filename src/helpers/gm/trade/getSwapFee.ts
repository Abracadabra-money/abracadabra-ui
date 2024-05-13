import { applyFactor } from "../fee/applyFactor";
import type { SwapMarketInfo } from "../types";
import type { BigNumber } from "ethers";

export const getSwapFee = (
  marketInfo: SwapMarketInfo,
  swapAmount: BigNumber,
  forPositiveImpact: boolean
): BigNumber => {
  const factor = forPositiveImpact
    ? marketInfo.swapFeeFactorForPositiveImpact
    : marketInfo.swapFeeFactorForNegativeImpact;

  return applyFactor(swapAmount, factor);
};
