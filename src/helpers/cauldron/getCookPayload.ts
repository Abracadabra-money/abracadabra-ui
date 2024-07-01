// NOTICE: this version of the file is used for backward compatibility of v3 ui with cooks logic
// the update will follow the improvement of cooks

import type { ActionConfig, CauldronInfo } from "@/helpers/cauldron/types";
import { getCookTypeByAction, ACTION_TYPES } from "./getCookActionType";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import { utils } from "ethers";
import type { Address } from "viem";

export const getCookPayload = async (
  account: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  action: "borrow" | "repay"
) => {
  const cookType = getCookTypeByAction(actionConfig, action);

  switch (cookType) {
    case ACTION_TYPES.ACTION_DEPOSIT:
      return getAddCollateralPayload(cauldron, actionConfig, account);
    case ACTION_TYPES.ACTION_BORROW:
      return getBorrowPayload(cauldron, actionConfig, account);
    case ACTION_TYPES.ACTION_DEPOSIT_AND_BORROW:
      return getAddCollateralAndBorrowPayload(cauldron, actionConfig, account);
    case ACTION_TYPES.ACTION_REPAY:
      return getRepayPayload(cauldron, actionConfig, account);
    case ACTION_TYPES.ACTION_REMOVE_COLLATERAL:
      return getRemoveCollateralPayload(cauldron, actionConfig, account);
    case ACTION_TYPES.ACTION_REPAY_AND_REMOVE_COLLATERAL:
      return getRemoveCollateralAndRepayPayload(
        cauldron,
        actionConfig,
        account
      );
    case ACTION_TYPES.ACTION_LEVERAGE:
      return await getLeveragePayload(cauldron, actionConfig, account);
    case ACTION_TYPES.ACTION_DELEVERAGE:
      return await getDeleveragePayload(cauldron, actionConfig, account);
  }

  return [];
};

const getAddCollateralPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  const { amounts, useNativeToken, useUnwrapToken } = actionConfig;
  const { unwrapTokenAmount, collateralTokenAmount } = amounts.depositAmounts;

  const amount = useUnwrapToken ? unwrapTokenAmount : collateralTokenAmount;

  const payload = {
    amount,
    useNativeToken,
    useWrapper: useUnwrapToken,
    to,
  };

  return [payload, cauldron];
};

const getBorrowPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  const { amounts } = actionConfig;

  const amount = amounts.borrowAmount;

  const payload = {
    amount,
    to,
  };

  return [payload, cauldron];
};

const getAddCollateralAndBorrowPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  const { amounts, useNativeToken, useUnwrapToken } = actionConfig;
  const { unwrapTokenAmount, collateralTokenAmount } = amounts.depositAmounts;
  const { isMasterContractApproved } = cauldron.additionalInfo;

  // TODO: update cauldron types
  //@ts-ignore
  const { updatePrice } = cauldron.mainParams;

  const collateralAmount = useUnwrapToken
    ? unwrapTokenAmount
    : collateralTokenAmount;
  const amount = amounts.borrowAmount;

  const payload = {
    collateralAmount,
    mimAmount: amount,
    useNativeToken,
    useWrapper: useUnwrapToken,
    to,
  };

  return [payload, cauldron];
};

const getRepayPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  const { userBorrowAmount } = cauldron.userPosition.borrowInfo;
  const { repayAmount } = actionConfig.amounts;

  const itsMax = repayAmount.eq(userBorrowAmount);

  const payload = {
    amount: repayAmount,
    itsMax,
    to,
  };

  return [payload, cauldron];
};

const getRemoveCollateralPayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  const { isMasterContractApproved } = cauldron.additionalInfo;
  //@ts-ignore
  const { bentoBox } = cauldron.contracts;
  //@ts-ignore
  const { address } = cauldron.config.collateralInfo;

  const { withdrawUnwrapToken } = actionConfig;
  const { withdrawAmount } = actionConfig.amounts;
  const { userCollateralAmount } = cauldron.userPosition.collateralInfo;

  const itsMax = userCollateralAmount.lte(withdrawAmount); // TODO: make it eq

  const amount = itsMax ? userCollateralAmount : withdrawAmount;

  const share = await bentoBox.toShare(address, amount, true);

  const payload = {
    collateralShare: share,
    to,
    withdrawUnwrapToken,
  };

  return [payload, cauldron];
};

const getRemoveCollateralAndRepayPayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  // TODO: update cauldron types
  //@ts-ignore
  const { updatePrice } = cauldron.mainParams;
  const { isMasterContractApproved } = cauldron.additionalInfo;

  //@ts-ignore
  const { bentoBox } = cauldron.contracts;
  //@ts-ignore
  const { address } = cauldron.config.collateralInfo;

  const { withdrawUnwrapToken } = actionConfig;
  const { withdrawAmount, repayAmount } = actionConfig.amounts;
  const { userCollateralAmount } = cauldron.userPosition.collateralInfo;
  const { userBorrowAmount } = cauldron.userPosition.borrowInfo;

  const itsMaxRemove = userCollateralAmount.lte(withdrawAmount); // TODO: make it eq
  const itsMaxRepay = repayAmount.eq(userBorrowAmount);

  const amount = itsMaxRemove ? userCollateralAmount : withdrawAmount;

  const share = await bentoBox.toShare(address, amount, true);

  const payload = {
    collateralShare: share, // TODO: update after fix this in cook
    mimPart: repayAmount, // TODO: update after fix this in cook
    itsMax: itsMaxRepay,
    to,
    withdrawUnwrapToken,
  };

  return [payload, cauldron];
};

// TODO: GM payload
const getLeveragePayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  //@ts-ignore
  const { bentoBox } = cauldron.contracts;

  //@ts-ignore
  const { address } = cauldron.config.collateralInfo;

  const { useUnwrapToken, useNativeToken } = actionConfig;
  const { leverageAmounts, depositAmounts } = actionConfig.amounts;

  const shareToMin = await bentoBox.toShare(
    address,
    leverageAmounts.amountToMin,
    true
  );

  const collateralAmount = useUnwrapToken
    ? depositAmounts.unwrapTokenAmount
    : depositAmounts.collateralTokenAmount;

  const slippage = utils.formatUnits(
    actionConfig.amounts.slippage,
    PERCENT_PRESITION
  );

  const payload = {
    collateralAmount,
    mimAmount: leverageAmounts.amountFrom,
    shareToMin,
    useNativeToken,
    slipage: slippage, // TODO: naming
    useWrapper: useUnwrapToken,
    to,
  };

  return [payload, cauldron];
};

// TODO: GM payload
const getDeleveragePayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  to: Address
) => {
  //@ts-ignore
  const { bentoBox } = cauldron.contracts;
  //@ts-ignore
  const { address } = cauldron.config.collateralInfo;

  const { withdrawUnwrapToken } = actionConfig;

  const { deleverageAmounts, withdrawAmount } = actionConfig.amounts;

  const { userBorrowAmount } = cauldron.userPosition.borrowInfo;

  const isMaxRepay = userBorrowAmount.lte(deleverageAmounts.amountToMin);

  const repayAmount = isMaxRepay
    ? userBorrowAmount
    : deleverageAmounts.amountToMin;

  const shareFrom = await bentoBox.toShare(
    address,
    deleverageAmounts.amountFrom,
    false
  );

  const withdrawShare = await bentoBox.toShare(address, withdrawAmount, false);

  const slippage = utils.formatUnits(
    actionConfig.amounts.slippage,
    PERCENT_PRESITION
  );

  const payload = {
    repayAmount,
    collateralShare: shareFrom,
    removeCollateralShare: withdrawShare,
    itsMax: isMaxRepay,
    slipage: slippage,
    to,
    withdrawUnwrapToken,
  };

  return [payload, cauldron];
};
