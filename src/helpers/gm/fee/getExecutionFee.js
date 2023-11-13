import { getGasPrice } from "./getGasPrice";
import { applyFactor } from "./applyFactor";

export const estimateExecuteDepositGasLimit = async (gasLimits) => {
  const gasPerSwap = gasLimits.singleSwap;
  const depositGasLimit = gasLimits.depositSingleToken;
  return depositGasLimit.add(gasPerSwap);
};

export const estimateExecuteWithdrawalGasLimit = async (gasLimits) => {
  return gasLimits.withdrawalMultiToken;
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
