import type {
  ActionConfig,
  CauldronInfo,
  UserPositions,
} from "@/helpers/cauldron/types";
import {
  applyBorrowFee,
  alternativeApplyBorrowFee,
  getLiquidationPrice,
  getAlternativeLiquidationPrice,
  getPositionHealth,
  getAlternativePositionHealth,
} from "@/helpers/cauldron/utils";
import { BigNumber } from "ethers";
import { parseUnits } from "viem";

// todo validateCookByAction
export const getExpectedPostition = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  action: "borrow" | "repay"
) => {
  const { userPosition } = cauldron;
  const { borrowFee } = cauldron.mainParams;

  let collateralAmount = userPosition.collateralInfo.userCollateralAmount;
  let mimAmount = userPosition.borrowInfo.userBorrowAmount;

  if (action === "borrow") {
    collateralAmount = expectedBorrowCollateralAmount(
      userPosition,
      actionConfig
    );
    mimAmount = expectedBorrowMimAmount(userPosition, actionConfig, borrowFee);
  }

  if (action === "repay") {
    collateralAmount = expectedRepayCollateralAmount(
      userPosition,
      actionConfig
    );
    mimAmount = expectedRepayMimAmount(userPosition, actionConfig);
  }

  const liquidationPrice = getLiquidationPrice(
    mimAmount,
    collateralAmount,
    //@ts-ignore
    cauldron.config!.mcr,
    //@ts-ignore
    cauldron.config!.collateralInfo.decimals
  );

  const positionHealth = getPositionHealth(
    liquidationPrice,
    cauldron.mainParams.oracleExchangeRate,
    //@ts-ignore
    cauldron.config!.collateralInfo.decimals
  );

  return {
    collateralAmount,
    mimAmount,
    liquidationPrice,
    positionHealth,
  };
};

export const getAlternativeExpectedPostition = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  action: string
) => {
  const { userPosition, mainParams, config } = cauldron;
  const { borrowFee } = mainParams;
  const { oracleExchangeRate } = mainParams.alternativeData;
  const { userBorrowAmount } = userPosition.alternativeData.borrowInfo;
  const { userCollateralAmount } = userPosition.alternativeData.collateralInfo;

  let mimAmount = userBorrowAmount;
  let collateralAmount = userCollateralAmount;

  if (action === "borrow") {
    collateralAmount = expectedAlternativeBorrowCollateralAmount(
      userCollateralAmount,
      actionConfig
    );

    mimAmount = expectedAlternativeBorrowMimAmount(
      userBorrowAmount,
      actionConfig,
      borrowFee
    );
  }

  if (action === "repay") {
    collateralAmount = expectedAlternativeRepayCollateralAmount(
      userCollateralAmount,
      actionConfig
    );

    mimAmount = expectedAlternativeRepayMimAmount(
      userBorrowAmount,
      actionConfig
    );
  }

  const liquidationPrice = getAlternativeLiquidationPrice(
    mimAmount,
    collateralAmount,
    config.mcr,
    config.collateralInfo.decimals
  );

  const positionHealth = getAlternativePositionHealth(
    liquidationPrice,
    oracleExchangeRate,
    config.collateralInfo.decimals
  );

  return {
    collateralAmount,
    mimAmount,
    liquidationPrice,
    positionHealth,
  };
};

const expectedRepayCollateralAmount = (
  userPosition: UserPositions,
  actionConfig: ActionConfig
) => {
  const { userCollateralAmount } = userPosition.collateralInfo;

  const { withdrawAmount, deleverageAmounts } = actionConfig.amounts;

  const expectedCollateralAmount = actionConfig.useDeleverage
    ? userCollateralAmount.sub(withdrawAmount).sub(deleverageAmounts.amountFrom)
    : userCollateralAmount.sub(withdrawAmount);

  return expectedCollateralAmount.lt(0)
    ? BigNumber.from(0)
    : expectedCollateralAmount;
};

const expectedAlternativeRepayCollateralAmount = (
  userCollateralAmount: bigint,
  actionConfig: ActionConfig
): bigint => {
  const withdrawAmount = parseUnits(
    actionConfig.amounts.withdrawAmount.toString(),
    0
  );
  const amountFrom = parseUnits(
    actionConfig.amounts.deleverageAmounts.amountFrom.toString(),
    0
  );

  const expectedCollateralAmount = actionConfig.useDeleverage
    ? userCollateralAmount - withdrawAmount - amountFrom
    : userCollateralAmount - withdrawAmount;

  return expectedCollateralAmount < 0n ? 0n : expectedCollateralAmount;
};

const expectedRepayMimAmount = (
  userPosition: UserPositions,
  actionConfig: ActionConfig
) => {
  const { userBorrowAmount } = userPosition.borrowInfo;
  const { repayAmount, deleverageAmounts } = actionConfig.amounts;

  const expectedMimAmount = actionConfig.useDeleverage
    ? userBorrowAmount.sub(deleverageAmounts.amountToMin)
    : userBorrowAmount.sub(repayAmount);

  return expectedMimAmount.lt(0) ? BigNumber.from(0) : expectedMimAmount;
};

const expectedAlternativeRepayMimAmount = (
  userBorrowAmount: bigint,
  actionConfig: ActionConfig
) => {
  const repayAmount = parseUnits(
    actionConfig.amounts.repayAmount.toString(),
    0
  );
  const amountToMin = parseUnits(
    actionConfig.amounts.deleverageAmounts.amountToMin.toString(),
    0
  );

  const expectedMimAmount = actionConfig.useDeleverage
    ? userBorrowAmount - amountToMin
    : userBorrowAmount - repayAmount;

  return expectedMimAmount < 0n ? 0n : expectedMimAmount;
};

const expectedBorrowCollateralAmount = (
  userPosition: UserPositions,
  actionConfig: ActionConfig
) => {
  const { userCollateralAmount } = userPosition.collateralInfo;

  const { depositAmounts, leverageAmounts } = actionConfig.amounts;

  if (actionConfig.useLeverage)
    return userCollateralAmount
      .add(depositAmounts.collateralTokenAmount)
      .add(leverageAmounts.amountToMin);

  return userCollateralAmount.add(depositAmounts.collateralTokenAmount);
};

const expectedAlternativeBorrowCollateralAmount = (
  userCollateralAmount: bigint,
  actionConfig: ActionConfig
) => {
  const { depositAmounts, leverageAmounts } = actionConfig.amounts;

  const collateralTokenAmount = parseUnits(
    depositAmounts.collateralTokenAmount.toString(),
    0
  );

  const amountToMin = parseUnits(leverageAmounts.amountToMin.toString(), 0);

  if (actionConfig.useLeverage)
    return userCollateralAmount + collateralTokenAmount + amountToMin;

  return userCollateralAmount + collateralTokenAmount;
};

const expectedBorrowMimAmount = (
  userPosition: UserPositions,
  actionConfig: ActionConfig,
  borrowFee: number
) => {
  const { userBorrowAmount } = userPosition.borrowInfo;
  const { leverageAmounts, borrowAmount } = actionConfig.amounts;

  if (actionConfig.useLeverage)
    return applyBorrowFee(leverageAmounts.amountFrom, borrowFee * 1000).add(
      userBorrowAmount
    );

  return applyBorrowFee(borrowAmount, borrowFee * 1000).add(userBorrowAmount);
};

export const expectedAlternativeBorrowMimAmount = (
  userBorrowAmount: bigint,
  actionConfig: ActionConfig,
  borrowFee: number
) => {
  const amountFrom = parseUnits(
    actionConfig.amounts.leverageAmounts.amountFrom.toString(),
    0
  );

  const borrowAmount = parseUnits(
    actionConfig.amounts.borrowAmount.toString(),
    0
  );

  if (actionConfig.useLeverage) {
    return (
      alternativeApplyBorrowFee(amountFrom, borrowFee * 1000) + userBorrowAmount
    );
  }

  return (
    alternativeApplyBorrowFee(borrowAmount, borrowFee * 1000) + userBorrowAmount
  );
};
