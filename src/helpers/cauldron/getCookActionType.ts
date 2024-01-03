import type { ActionConfig } from "@/helpers/cauldron/types";

const ACTION_UNKNOWN = 0;
const ACTION_DEPOSIT = 1;
const ACTION_BORROW = 2;
const ACTION_DEPOSIT_AND_BORROW = 3;
const ACTION_REPAY = 4;
const ACTION_REMOVE_COLLATERAL = 5;
const ACTION_REPAY_AND_REMOVE_COLLATERAL = 6;
const ACTION_LEVERAGE = 7;
const ACTION_DELEVERAGE = 8;

export const ACTION_TYPES = {
  ACTION_UNKNOWN,
  ACTION_DEPOSIT,
  ACTION_BORROW,
  ACTION_DEPOSIT_AND_BORROW,
  ACTION_REPAY,
  ACTION_REMOVE_COLLATERAL,
  ACTION_REPAY_AND_REMOVE_COLLATERAL,
  ACTION_LEVERAGE,
  ACTION_DELEVERAGE,
};

export const getCookTypeByAction = (
  actionConfig: ActionConfig,
  action: "borrow" | "repay"
) => {
  if (action === "borrow") return geBorrowCookType(actionConfig);

  if (action === "repay") return geRepayCookType(actionConfig);

  return ACTION_UNKNOWN;
};

const geBorrowCookType = (actionConfig: ActionConfig) => {
  if (actionConfig.useLeverage) return ACTION_LEVERAGE;

  const { depositAmounts, borrowAmount } = actionConfig.amounts;

  const hasDepositAmount = depositAmounts.collateralTokenAmount.gt(0);
  const hasBorrowAmount = borrowAmount.gt(0);

  if (hasDepositAmount && hasBorrowAmount) return ACTION_DEPOSIT_AND_BORROW;
  if (hasDepositAmount) return ACTION_DEPOSIT;
  if (hasBorrowAmount) return ACTION_BORROW;

  return ACTION_UNKNOWN;
};

const geRepayCookType = (actionConfig: ActionConfig) => {
  if (actionConfig.useDeleverage) return ACTION_DELEVERAGE;

  const { repayAmount, withdrawAmount } = actionConfig.amounts;

  const hasRepayAmount = repayAmount.gt(0);
  const hasWithdrawAmount = withdrawAmount.gt(0);

  if (hasRepayAmount && hasWithdrawAmount)
    return ACTION_REPAY_AND_REMOVE_COLLATERAL;
  if (hasRepayAmount) return ACTION_REPAY;
  if (hasWithdrawAmount) return ACTION_REMOVE_COLLATERAL;

  return ACTION_UNKNOWN;
};
