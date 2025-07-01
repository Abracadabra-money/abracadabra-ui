// @/helpers/cauldron/utils.ts

import { parseUnits, formatUnits } from "viem";
import { applySlippageToMinOutBigInt } from "../gm/applySlippageToMinOut";
import type { AlternativePositionHealth } from "../cauldron/types";

const MIM_DECIMALS = 18;
const COLATERIZATION_PRECISION = 5;
const BORROW_OPENING_FEE_PRECISION = 5;
export const PERCENT_PRESITION = 2;

const FENCING_AGAINST_LIQUIDATION = parseUnits("1", PERCENT_PRESITION); // 1% of mcr

type SwapAmountsBigint = {
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

// @/helpers/cauldron/utils.ts
export const getMaxToBorrowBigint = (
  collateralAmount: bigint,
  userBorrowAmount: bigint,
  mcr: bigint,
  oracleExchangeRate: bigint
): bigint => {
  const collateralInMim =
    expandDecimals(collateralAmount, MIM_DECIMALS) / oracleExchangeRate;

  const maxToBorrow =
    (collateralInMim * (mcr - FENCING_AGAINST_LIQUIDATION)) /
    (100n * parseUnits("1", PERCENT_PRESITION));

  const maxToBorrowLeft = maxToBorrow - userBorrowAmount;
  return maxToBorrowLeft < 0n ? 0n : maxToBorrowLeft;
};

export const getUserLtvBigint = (
  collateralAmount: bigint,
  userBorrowAmount: bigint,
  oracleExchangeRate: bigint
): bigint => {
  if (collateralAmount === 0n) return 0n;

  const collateralInMim =
    expandDecimals(collateralAmount, MIM_DECIMALS) / oracleExchangeRate;

  const ltv =
    (expandDecimals(userBorrowAmount, PERCENT_PRESITION) * 100n) /
    collateralInMim;

  return ltv;
};

export const getMimToBorrowByLtvBigint = (
  ltv: bigint,
  mcr: bigint,
  collateralAmount: bigint,
  userBorrowAmount: bigint,
  oracleExchangeRate: bigint
): bigint => {
  if (ltv > mcr) return 0n;

  const currentLtv = getUserLtvBigint(
    collateralAmount,
    userBorrowAmount,
    oracleExchangeRate
  );

  if (ltv <= currentLtv) return 0n;

  const collateralInMim =
    expandDecimals(collateralAmount, MIM_DECIMALS) / oracleExchangeRate;

  const leftToBorrow = getMaxToBorrowBigint(
    collateralAmount,
    userBorrowAmount,
    mcr,
    oracleExchangeRate
  );
  const mimPerPercent = collateralInMim / 100n;

  const mimToBorrow =
    (mimPerPercent * (ltv - currentLtv)) / parseUnits("1", PERCENT_PRESITION);

  return mimToBorrow > leftToBorrow ? leftToBorrow : mimToBorrow;
};

export const getMaxCollateralToRemoveBigint = (
  collateralAmount: bigint,
  userBorrowAmount: bigint,
  mcr: bigint,
  oracleExchangeRate: bigint
): bigint => {
  if (userBorrowAmount === 0n) return collateralAmount;

  const currentLtv = getUserLtvBigint(
    collateralAmount,
    userBorrowAmount,
    oracleExchangeRate
  );

  const minCollateralAmount =
    (currentLtv * collateralAmount) / (mcr - FENCING_AGAINST_LIQUIDATION);

  const maxToRemoveLeft = collateralAmount - minCollateralAmount;

  const maxToRemove = maxToRemoveLeft < 0n ? 0n : maxToRemoveLeft;

  return maxToRemove > collateralAmount ? collateralAmount : maxToRemove;
};

export const getPositionHealthBigint = (
  liquidationPrice: bigint,
  oracleExchangeRate: bigint,
  collateralDecimals: number
): AlternativePositionHealth => {
  if (oracleExchangeRate === 0n) return { percent: 0n, status: "safe" };

  const collateralPrice =
    parseUnits("1", 18 + collateralDecimals) / oracleExchangeRate;

  const percent =
    (liquidationPrice * parseUnits("1", PERCENT_PRESITION) * 100n) /
    collateralPrice;

  const status = getHealthStatusBigint(percent);

  return { percent, status };
};

const getHealthStatusBigint = (
  riskPercent: bigint
): "safe" | "medium" | "high" => {
  const percent = Number(formatUnits(riskPercent, PERCENT_PRESITION));

  if (percent >= 0 && percent <= 70) return "safe";
  if (percent > 70 && percent <= 90) return "medium";
  return "high";
};

export const getLeverageAmounts = (
  collateralAmount: bigint,
  leverageMultiplyer: bigint,
  slippage: bigint,
  oracleExchangeRate: bigint
): SwapAmountsBigint => {
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

export const getDeleverageAmountsBigint = (
  mimToRepayAmount: bigint,
  slippage: bigint, // 1e2
  oracleExchangeRate: bigint
): SwapAmountsBigint => {
  if (mimToRepayAmount === 0n) return { amountFrom: 0n, amountToMin: 0n };

  const collateralToSwapMin =
    (mimToRepayAmount * oracleExchangeRate) / expandDecimals(1n, MIM_DECIMALS);

  const additionalSlippageAmount =
    (collateralToSwapMin * slippage) / expandDecimals(100n, PERCENT_PRESITION);

  const collateralToSwapAmount = collateralToSwapMin + additionalSlippageAmount;

  return {
    amountFrom: collateralToSwapAmount, // collateral amount to remove & swap
    amountToMin: mimToRepayAmount, // min expected MIM amount
  };
};

export const applyBorrowFeeBigint = (
  borrowAmount: bigint,
  borrowOpeningFee: number // 1% === 1000
): bigint => {
  if (borrowAmount === 0n) return 0n;

  const fee =
    (borrowAmount * parseUnits(borrowOpeningFee.toString(), 0)) /
    parseUnits("1", BORROW_OPENING_FEE_PRECISION);

  return borrowAmount + fee;
};

// NOTICE: we expect unwrapped token decimals = wrapped decimals
export const applyTokenWrapperRateBigint = (
  unwrappedTokenAmount: bigint,
  tokensRate: bigint,
  unwrappedTokenDecimals: number
): bigint => {
  return (
    expandDecimals(unwrappedTokenAmount, unwrappedTokenDecimals) / tokensRate
  );
};
