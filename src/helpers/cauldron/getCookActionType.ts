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
  const { depositAmounts, borrowAmount, leverageAmounts } =
    actionConfig.amounts;

  const hasDepositAmount = depositAmounts.collateralTokenAmount.gt(0);
  const hasBorrowAmount = borrowAmount.gt(0);
  const hasLeverageAmount = leverageAmounts.amountFrom.gt(0);

  if (actionConfig.useLeverage && hasLeverageAmount) return ACTION_LEVERAGE;

  if (hasDepositAmount && hasBorrowAmount) return ACTION_DEPOSIT_AND_BORROW;
  if (hasDepositAmount) return ACTION_DEPOSIT;
  if (hasBorrowAmount) return ACTION_BORROW;

  return ACTION_UNKNOWN;
};

const geRepayCookType = (actionConfig: ActionConfig) => {
  const { repayAmount, withdrawAmount, deleverageAmounts } =
    actionConfig.amounts;

  const hasRepayAmount = repayAmount.gt(0);
  const hasWithdrawAmount = withdrawAmount.gt(0);
  const hasDeleverageAmount = deleverageAmounts.amountFrom.gt(0);

  if (actionConfig.useDeleverage && hasDeleverageAmount)
    return ACTION_DELEVERAGE;

  if (hasRepayAmount && hasWithdrawAmount)
    return ACTION_REPAY_AND_REMOVE_COLLATERAL;
  if (hasRepayAmount) return ACTION_REPAY;
  if (hasWithdrawAmount) return ACTION_REMOVE_COLLATERAL;

  return ACTION_UNKNOWN;
};
