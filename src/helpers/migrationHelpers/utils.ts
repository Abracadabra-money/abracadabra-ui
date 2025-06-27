// @/helpers/cauldron/utils.ts

import { parseUnits } from "viem";
import { applySlippageToMinOutBigInt } from "../gm/applySlippageToMinOut";

const MIM_DECIMALS = 18;
const COLATERIZATION_PRECISION = 5;
const BORROW_OPENING_FEE_PRECISION = 5;
export const PERCENT_PRESITION = 2;

type SwapAmounts = {
  amountFrom: bigint;
  amountToMin: bigint;
};

// @/helpers/gm/fee/expandDecials
export function expandDecimals(n: bigint, decimals: number): bigint {
  return n * BigInt(Math.pow(10, decimals));
}

export const getLiquidationPrice = (
  borrowAmount: bigint,
  collateralAmount: bigint,
  mcr: number,
  collateralDecimals: number
): bigint => {
  if (borrowAmount === 0n || collateralAmount === 0n) return 0n;

  const colaterizationValue = parseUnits("1", COLATERIZATION_PRECISION);
  const colaterizationRate = (BigInt(mcr) * colaterizationValue) / 100n;

  const scaledBorrowAmount =
    borrowAmount * expandDecimals(colaterizationValue, collateralDecimals);

  return scaledBorrowAmount / collateralAmount / colaterizationRate;
};

// getAlternativeLiquidationPrice

// getMaxToBorrow

// getUserLtv

// getMimToBorrowByLtv

// getMaxCollateralToRemove

// getPositionHealth

// getAlternativePositionHealth

// getHealthStatus

// getAlternativeHealthStatus

export const getLeverageAmounts = (
  collateralAmount: bigint,
  leverageMultiplyer: bigint,
  slippage: bigint,
  oracleExchangeRate: bigint
): SwapAmounts => {
  if (collateralAmount === 0n) return { amountFrom: 0n, amountToMin: 0n };

  const collateralToSwap =
    (collateralAmount * leverageMultiplyer) / 100n - collateralAmount;

  const amountFrom =
    expandDecimals(collateralToSwap, MIM_DECIMALS) / oracleExchangeRate;

  const amountToMin = applySlippageToMinOutBigInt(slippage, collateralToSwap);

  return {
    amountFrom, // MIM amount to borrow & swap
    amountToMin, // min expected collateral amount
  };
};

// getDeleverageAmounts

// applyBorrowFee

// alternativeApplyBorrowFee

// applyTokenWrapperRate
