import { BigNumber, utils } from "ethers";
import { expandDecimals } from "../gm/fee/expandDecials";
import { applySlippageToMinOut } from "../gm/applySlippageToMinOut";

const FENCING_AGAINST_LIQUIDATION = 1; // 1% of mcr
const MIM_DECIMALS = 18;

const COLATERIZATION_PRESITION = 5;
const BORROW_OPENING_FEE_PRECISION = 5;
const BPS_PRESITION = 4;

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

export const getMaxToBorrow = (
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  mcr: number,
  oracleExchangeRate: BigNumber
): BigNumber => {
  const collateralInMim = collateralAmount
    .mul(expandDecimals(1, MIM_DECIMALS))
    .div(oracleExchangeRate);

  const maxToBorrow = collateralInMim.div(100).mul(mcr);

  return maxToBorrow.sub(userBorrowAmount);
};

export const getUserLtv = (
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  oracleExchangeRate: BigNumber
): BigNumber => {
  if (collateralAmount.isZero()) return BigNumber.from(0);

  const collateralInMim = collateralAmount
    .mul(expandDecimals(1, MIM_DECIMALS))
    .div(oracleExchangeRate);

  const ltvBps = userBorrowAmount
    .mul(expandDecimals(1, BPS_PRESITION))
    .div(collateralInMim);
  return ltvBps;
};

export const getMimToBorrowByLtv = (
  ltv: number,
  mcr: number,
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  oracleExchangeRate: BigNumber
): BigNumber => {
  if (ltv > mcr) return BigNumber.from(0);

  const mcrBps = expandDecimals(mcr, BPS_PRESITION);
  const ltvBps = expandDecimals(ltv, BPS_PRESITION);

  const currentLtvBps = getUserLtv(
    collateralAmount,
    userBorrowAmount,
    oracleExchangeRate
  );

  if (ltvBps.div(100).lte(currentLtvBps)) return BigNumber.from(0);

  const collateralInMim = collateralAmount
    .mul(expandDecimals(1, MIM_DECIMALS))
    .div(oracleExchangeRate);

  const maxToBorrow = collateralInMim.div(100).mul(mcr);

  const leftToBorrow = maxToBorrow
    .sub(userBorrowAmount)
    .mul(expandDecimals(1, MIM_DECIMALS))
    .div(
      mcrBps
        .sub(currentLtvBps.mul(expandDecimals(1, 2)))
        .div(10000)
        .mul(expandDecimals(1, 14))
    )
    .mul(ltvBps.sub(currentLtvBps.mul(expandDecimals(1, 2))).div(10000))
    .div(expandDecimals(1, BPS_PRESITION));

  const mimPerPercent = collateralInMim.div(100);

  const mimToBorrow = mimPerPercent
    .mul(ltvBps.sub(currentLtvBps))
    .div(expandDecimals(1, BPS_PRESITION));

  if (mimToBorrow.gt(leftToBorrow)) return leftToBorrow;

  return mimToBorrow;
};

// export const getMimToBorrowByLtv = (
//   ltv: number,
//   mcr: number,
//   collateralAmount: BigNumber,
//   userBorrowAmount: BigNumber,
//   oracleExchangeRate: BigNumber
// ): BigNumber => {
//   if (ltv > mcr) return BigNumber.from(0);
//   const ltvBps = expandDecimals(ltv, BPS_PRESITION);

//   const currentLtvBps = getUserLtv(
//     collateralAmount,
//     userBorrowAmount,
//     oracleExchangeRate
//   );

//   if (ltvBps.lte(currentLtvBps)) return BigNumber.from(0);

//   const collateralInMim = collateralAmount
//     .mul(expandDecimals(1, MIM_DECIMALS))
//     .div(oracleExchangeRate);

//   const maxToBorrow = collateralInMim.div(100).mul(mcr);
//   const leftToBorrow = maxToBorrow.sub(userBorrowAmount);
//   const mimPerPercent = collateralInMim.div(100);

//   const mimToBorrow = mimPerPercent
//     .mul(ltvBps.sub(currentLtvBps))
//     .div(expandDecimals(1, BPS_PRESITION));

//   if (mimToBorrow.gt(leftToBorrow)) return leftToBorrow;
//   return mimToBorrow;
// };

export const getMaxCollateralToRemove = (
  collateralAmount: BigNumber,
  userBorrowAmount: BigNumber,
  mcr: number,
  oracleExchangeRate: BigNumber,
  collateralDecimals: number
): BigNumber => {
  const leftToBorrow = getMaxToBorrow(
    collateralAmount,
    userBorrowAmount,
    mcr,
    oracleExchangeRate
  );

  const getMaxCollateralToRemove = leftToBorrow
    // .mul(expandDecimals(1, collateralDecimals))
    .mul(oracleExchangeRate)
    .div(expandDecimals(mcr, collateralDecimals))
    .mul(100);
  // .div(expandDecimals(1, MIM_DECIMALS));

  return getMaxCollateralToRemove;
};

export const getPositionHealth = (
  liquidationPrice: BigNumber,
  oracleExchangeRate: BigNumber,
  collateralDecimals: number
  // healthMultiplier: number // ?
) => {
  const collateralPrice = expandDecimals(1, 18 + collateralDecimals).div(
    oracleExchangeRate
  );

  const currentRiskPercent = expandDecimals(liquidationPrice, BPS_PRESITION)
    .div(collateralPrice)
    .mul(100)
    .div(expandDecimals(1, BPS_PRESITION));

  const percent = utils.formatUnits(currentRiskPercent, BPS_PRESITION);

  return currentRiskPercent; // TODO test
};

export const getLeverageAmounts = (
  collateralAmount: BigNumber,
  leverageMultiplyerBps: number, // 1.36x == 136
  slippageBps: number, // 1% === 100
  oracleExchangeRate: BigNumber
): SwapAmounts => {
  if (collateralAmount.eq(0))
    return { amountFrom: BigNumber.from(0), amountToMin: BigNumber.from(0) };

  const collateralToSwap = collateralAmount
    .mul(leverageMultiplyerBps)
    .div(expandDecimals(1, 2))
    .sub(collateralAmount);

  const amountFrom = expandDecimals(collateralToSwap, MIM_DECIMALS).div(
    oracleExchangeRate
  );

  const amountToMin = applySlippageToMinOut(slippageBps, collateralToSwap);

  return {
    amountFrom, // MIM amount to borrow & swap
    amountToMin, // min expected collateral amount
  };
};

export const getDeleverageAmounts = (
  mimToRepayAmount: BigNumber,
  slippageBps: number,
  oracleExchangeRate: BigNumber
): SwapAmounts => {
  if (mimToRepayAmount.eq(0))
    return { amountFrom: BigNumber.from(0), amountToMin: BigNumber.from(0) };

  const collateralToSwapMin = mimToRepayAmount
    .mul(oracleExchangeRate)
    .div(expandDecimals(1, MIM_DECIMALS));

  // slippage here is how much more we need remove collateral to repay
  const additionalSlippageAmount = collateralToSwapMin
    .mul(slippageBps)
    .div(expandDecimals(1, BPS_PRESITION));

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
