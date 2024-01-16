import { BigNumber, utils } from "ethers";
import { expandDecimals } from "../gm/fee/expandDecials";
import { applySlippageToMinOut } from "../gm/applySlippageToMinOut";

const MIM_DECIMALS = 18;
const COLATERIZATION_PRESITION = 5;
const BORROW_OPENING_FEE_PRECISION = 5;
export const PERCENT_PRESITION = 2;

const FENCING_AGAINST_LIQUIDATION = expandDecimals(1, PERCENT_PRESITION); // 1% of mcr

type SwapAmounts = {
  amountFrom: BigNumber;
  amountToMin: BigNumber;
};

export const getLiquidationPrice = (
  borrowAmount: BigNumber,
  collateralAmount: BigNumber,
  mcr: number,
  collateralDecimals: number
): BigNumber => {
  if (borrowAmount.eq(0) || collateralAmount.eq(0)) return BigNumber.from(0);

  const colaterizationRate = BigNumber.from(mcr)
    .mul(expandDecimals(1, COLATERIZATION_PRESITION))
    .div(100);

  const liquidationPrice = borrowAmount
    .mul(expandDecimals(1, collateralDecimals + COLATERIZATION_PRESITION))
    .div(collateralAmount)
    .div(colaterizationRate);

  return liquidationPrice;
};

// TODO: add userMaxBorrow check
export const getMaxToBorrow = (
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  mcr: BigNumber,
  oracleExchangeRate: BigNumber
): BigNumber => {
  const collateralInMim = expandDecimals(collateralAmount, MIM_DECIMALS).div(
    oracleExchangeRate
  );

  const maxToBorrow = collateralInMim
    .div(100)
    .mul(mcr.sub(FENCING_AGAINST_LIQUIDATION))
    .div(expandDecimals(1, PERCENT_PRESITION));

  const maxToBorrowLeft = maxToBorrow.sub(userBorrowAmount);

  return maxToBorrowLeft.lt(0) ? BigNumber.from(0) : maxToBorrowLeft;
};

export const getUserLtv = (
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  oracleExchangeRate: BigNumber
): BigNumber => {
  if (collateralAmount.isZero()) return BigNumber.from(0);

  const collateralInMim = expandDecimals(collateralAmount, MIM_DECIMALS).div(
    oracleExchangeRate
  );

  const ltv = expandDecimals(userBorrowAmount, PERCENT_PRESITION)
    .mul(100)
    .div(collateralInMim);

  return ltv;
};

export const getMimToBorrowByLtv = (
  ltv: BigNumber,
  mcr: BigNumber,
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  oracleExchangeRate: BigNumber
): BigNumber => {
  if (ltv.gt(mcr)) return BigNumber.from(0);

  const currentLtv = getUserLtv(
    collateralAmount,
    userBorrowAmount,
    oracleExchangeRate
  );

  if (ltv.lte(currentLtv)) return BigNumber.from(0);

  const collateralInMim = expandDecimals(collateralAmount, MIM_DECIMALS).div(
    oracleExchangeRate
  );

  const leftToBorrow = getMaxToBorrow(
    collateralAmount,
    userBorrowAmount,
    mcr,
    oracleExchangeRate
  );
  const mimPerPercent = collateralInMim.div(100);

  const mimToBorrow = mimPerPercent
    .mul(ltv.sub(currentLtv))
    .div(expandDecimals(1, PERCENT_PRESITION));

  if (mimToBorrow.gt(leftToBorrow)) return leftToBorrow;
  return mimToBorrow;
};

export const getMaxCollateralToRemove = (
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  mcr: BigNumber,
  oracleExchangeRate: BigNumber
) => {
  if (userBorrowAmount.eq(0)) return collateralAmount;

  const currentLtv = getUserLtv(
    collateralAmount,
    userBorrowAmount,
    oracleExchangeRate
  );

  const minCollateralAmount = currentLtv
    .mul(collateralAmount)
    .div(mcr.sub(FENCING_AGAINST_LIQUIDATION));

  const maxToRemoveLeft = collateralAmount.sub(minCollateralAmount);

  const maxToRemove = maxToRemoveLeft.lt(0)
    ? BigNumber.from(0)
    : maxToRemoveLeft;

  return maxToRemove.gt(collateralAmount) ? collateralAmount : maxToRemove;
};

export const getPositionHealth = (
  liquidationPrice: BigNumber,
  oracleExchangeRate: BigNumber,
  collateralDecimals: number
  // healthMultiplier: number // ?
) => {
  if (oracleExchangeRate.eq(0))
    return { percent: BigNumber.from(0), status: "safe" };

  const collateralPrice = expandDecimals(1, 18 + collateralDecimals).div(
    oracleExchangeRate
  );

  const percent = expandDecimals(liquidationPrice, PERCENT_PRESITION)
    .mul(100)
    .div(collateralPrice);

  const status = getHealthStatus(percent);

  return { percent, status };
};

const getHealthStatus = (riskPercent: BigNumber) => {
  const percent = Number(utils.formatUnits(riskPercent, PERCENT_PRESITION));

  if (percent >= 0 && percent <= 70) return "safe";
  if (percent > 70 && percent <= 90) return "medium";
  return "high";
};

export const getLeverageAmounts = (
  collateralAmount: BigNumber,
  leverageMultiplyer: BigNumber, // 1e2
  slippage: BigNumber, // 1e2
  oracleExchangeRate: BigNumber
): SwapAmounts => {
  if (collateralAmount.eq(0))
    return { amountFrom: BigNumber.from(0), amountToMin: BigNumber.from(0) };

  const collateralToSwap = collateralAmount
    .mul(leverageMultiplyer)
    .div(expandDecimals(1, 2))
    .sub(collateralAmount);

  const amountFrom = expandDecimals(collateralToSwap, MIM_DECIMALS).div(
    oracleExchangeRate
  );

  const amountToMin = applySlippageToMinOut(Number(slippage), collateralToSwap);

  return {
    amountFrom, // MIM amount to borrow & swap
    amountToMin, // min expected collateral amount
  };
};

export const getDeleverageAmounts = (
  mimToRepayAmount: BigNumber,
  slippage: BigNumber, // 1e2
  oracleExchangeRate: BigNumber
): SwapAmounts => {
  if (mimToRepayAmount.eq(0))
    return { amountFrom: BigNumber.from(0), amountToMin: BigNumber.from(0) };

  const collateralToSwapMin = mimToRepayAmount
    .mul(oracleExchangeRate)
    .div(expandDecimals(1, MIM_DECIMALS));

  const additionalSlippageAmount = collateralToSwapMin
    .mul(slippage)
    .div(expandDecimals(100, PERCENT_PRESITION));

  const collaterapToSwapAmount = collateralToSwapMin.add(
    additionalSlippageAmount
  );

  return {
    amountFrom: collaterapToSwapAmount, // collateral amount to remove & swap
    amountToMin: mimToRepayAmount, // min expected MIM amount
  };
};

export const applyBorrowFee = (
  borrowAmount: BigNumber,
  borrowOpeningFee: number // 1% === 1000
): BigNumber => {
  if (borrowAmount.isZero()) return BigNumber.from(0);

  const fee = borrowAmount
    .mul(borrowOpeningFee)
    .div(expandDecimals(1, BORROW_OPENING_FEE_PRECISION));

  return borrowAmount.add(fee);
};

// NOTICE: we expect unwrapped token decimals = wrapped decimals
export const applyTokenWrapperRate = (
  unwrappedTokenAmount: BigNumber,
  tokensRate: BigNumber,
  unwrappedTokenDecimals: number
): BigNumber => {
  return expandDecimals(unwrappedTokenAmount, unwrappedTokenDecimals).div(
    tokensRate
  );
};
