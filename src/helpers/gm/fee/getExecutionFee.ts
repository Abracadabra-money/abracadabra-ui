import type { BigNumber, providers } from "ethers";
import { getGasPrice } from "./getGasPrice";
import { applyFactor } from "./applyFactor";
import type { GasLimits } from "../types";

export const estimateExecuteDepositGasLimit = (gasLimits: GasLimits): BigNumber => {
  const gasPerSwap = gasLimits.singleSwap;
  const depositGasLimit = gasLimits.depositSingleToken;
  return depositGasLimit.add(gasPerSwap);
};

export const estimateExecuteWithdrawalGasLimit = (
  gasLimits: GasLimits,
  callbackGasLimit: BigNumber
): BigNumber => {
  const swapCount = 1;
  return gasLimits.withdrawalMultiToken.add(callbackGasLimit).add(gasLimits.singleSwap.mul(swapCount));
};

export const getExecutionFee = async (
  gasLimts: GasLimits,
  estimatedGasLimit: BigNumber,
  provider: providers.BaseProvider
) => {
  const gasPrice = await getGasPrice(provider);

  const baseGasLimit = gasLimts.estimatedFeeBaseGasLimit;
  const multiplierFactor = gasLimts.estimatedFeeMultiplierFactor;
  const adjustedGasLimit = baseGasLimit.add(
    applyFactor(estimatedGasLimit, multiplierFactor)
  );

  const feeTokenAmount = adjustedGasLimit.mul(gasPrice);

  // NOTICE: To be sure that the fee is enough to cover the gas cost
  const defaultBufferBps = 15000;
  const BASIS_POINTS_DIVISOR = 10000;
  const buffer = feeTokenAmount.mul(defaultBufferBps).div(BASIS_POINTS_DIVISOR); // 50%

  return feeTokenAmount.add(buffer);
};
