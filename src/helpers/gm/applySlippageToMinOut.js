export const DEFAULT_SLIPPAGE_AMOUNT = 30; // 0.3% slippage
export const BASIS_POINTS_DIVISOR = 10000;

export function applySlippageToMinOut(allowedSlippage, minOutputAmount) {
  const slippageBasisPoints = BASIS_POINTS_DIVISOR - allowedSlippage;

  return minOutputAmount.mul(slippageBasisPoints).div(BASIS_POINTS_DIVISOR);
}
