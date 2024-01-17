import type {
  ActionConfig,
  CauldronInfo,
  UserPositions,
} from "@/helpers/cauldron/types";

import { BigNumber } from "ethers";
import {
  applyBorrowFee,
  getLiquidationPrice,
  getPositionHealth,
} from "@/helpers/cauldron/utils";

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
