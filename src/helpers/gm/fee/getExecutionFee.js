import { getGasPrice } from "./getGasPrice";
import { applyFactor } from "./applyFactor";

export const estimateExecuteDepositGasLimit = async (gasLimits) => {
  const gasPerSwap = gasLimits.singleSwap;
  const depositGasLimit = gasLimits.depositSingleToken;
  return depositGasLimit.add(gasPerSwap);
};

export const estimateExecuteWithdrawalGasLimit = async (
  gasLimits,
  callbackGasLimit
) => {
  const swapCount = 1; // TODO check
  return gasLimits.withdrawalMultiToken.add(callbackGasLimit).add(gasLimits.singleSwap.mul(swapCount));
};

export const getExecutionFee = async (
  gasLimts,
  estimatedGasLimit,
  provider
) => {
  const gasPrice = await getGasPrice(provider);

  const baseGasLimit = gasLimts.estimatedFeeBaseGasLimit;
  const multiplierFactor = gasLimts.estimatedFeeMultiplierFactor;
  const adjustedGasLimit = baseGasLimit.add(
    applyFactor(estimatedGasLimit, multiplierFactor)
  );

  const feeTokenAmount = adjustedGasLimit.mul(gasPrice);

  return feeTokenAmount;
};
