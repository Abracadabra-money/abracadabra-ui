import type { BigNumber } from "ethers";
export const DEFAULT_SLIPPAGE_AMOUNT = 30; // 0.3% slippage
export const BASIS_POINTS_DIVISOR = 10000;
export const BASIS_POINTS_DIVISOR_BIG_INT = 10000n;

export function applySlippageToMinOut(
  allowedSlippage: number,
  minOutputAmount: BigNumber
): BigNumber {
  const slippageBasisPoints = BASIS_POINTS_DIVISOR - allowedSlippage;

  return minOutputAmount.mul(slippageBasisPoints).div(BASIS_POINTS_DIVISOR);
}

export function applySlippageToMinOutBigInt(
  allowedSlippage: BigInt,
  minOutputAmount: BigInt
): BigInt {
  const slippageBasisPoints = BASIS_POINTS_DIVISOR_BIG_INT - allowedSlippage;

  return (minOutputAmount * slippageBasisPoints) / BASIS_POINTS_DIVISOR_BIG_INT;
}
