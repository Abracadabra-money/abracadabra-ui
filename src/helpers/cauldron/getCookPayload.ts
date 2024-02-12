// NOTICE: this version of the file is used for backward compatibility of v3 ui with cooks logic
// the update will follow the improvement of cooks

import type { ActionConfig, CauldronInfo } from "@/helpers/cauldron/types";
import { getCookTypeByAction, ACTION_TYPES } from "./getCookActionType";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import { utils } from "ethers";

export const getCookPayload = async (
  account: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  action: "borrow" | "repay"
) => {
  const cookType = getCookTypeByAction(actionConfig, action);

  switch (cookType) {
    case ACTION_TYPES.ACTION_DEPOSIT:
      return getAddCollateralPayload(cauldron, actionConfig);
    case ACTION_TYPES.ACTION_BORROW:
      return getBorrowPayload(cauldron, actionConfig);
    case ACTION_TYPES.ACTION_DEPOSIT_AND_BORROW:
      return getAddCollateralAndBorrowPayload(cauldron, actionConfig);
    case ACTION_TYPES.ACTION_REPAY:
      return getRepayPayload(cauldron, actionConfig);
    case ACTION_TYPES.ACTION_REMOVE_COLLATERAL:
      return getRemoveCollateralPayload(cauldron, actionConfig);
    case ACTION_TYPES.ACTION_REPAY_AND_REMOVE_COLLATERAL:
      return getRemoveCollateralAndRepayPayload(cauldron, actionConfig);
    case ACTION_TYPES.ACTION_LEVERAGE:
      return await getLeveragePayload(cauldron, actionConfig);
    case ACTION_TYPES.ACTION_DELEVERAGE:
      return await getDeleveragePayload(cauldron, actionConfig, account);
  }

  return [];
};

const getAddCollateralPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  const { amounts, useNativeToken, useUnwrapToken } = actionConfig;
  const { unwrapTokenAmount, collateralTokenAmount } = amounts.depositAmounts;
  const { isMasterContractApproved } = cauldron.additionalInfo;

  // TODO: update cauldron types
  //@ts-ignore
  const { updatePrice } = cauldron.mainParams;

  const amount = useUnwrapToken ? unwrapTokenAmount : collateralTokenAmount;

  const payload = {
    amount,
    updatePrice,
    itsDefaultBalance: useNativeToken,
  };

  return [
    payload,
    isMasterContractApproved,
    cauldron,
    useUnwrapToken,
    useUnwrapToken,
  ];
};

const getBorrowPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  const { amounts } = actionConfig;

  const { isMasterContractApproved } = cauldron.additionalInfo;

  // TODO: update cauldron types
  //@ts-ignore
  const { updatePrice } = cauldron.mainParams;

  const amount = amounts.borrowAmount;

  const payload = {
    amount,
    updatePrice,
  };

  return [payload, isMasterContractApproved, cauldron];
};

const getAddCollateralAndBorrowPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
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
    amount,
    updatePrice,
    itsDefaultBalance: useNativeToken,
  };

  return [
    payload,
    isMasterContractApproved,
    cauldron,
    useUnwrapToken,
    useUnwrapToken,
  ];
};

const getRepayPayload = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  // TODO: update cauldron types
  //@ts-ignore
  const { updatePrice } = cauldron.mainParams;
  const { isMasterContractApproved } = cauldron.additionalInfo;

  const { userBorrowAmount } = cauldron.userPosition.borrowInfo;

  const { repayAmount } = actionConfig.amounts;

  const itsMax = repayAmount.eq(userBorrowAmount);

  const payload = {
    amount: repayAmount,
    itsMax,
    updatePrice,
  };

  return [payload, isMasterContractApproved, cauldron];
};

const getRemoveCollateralPayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
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
  const { withdrawAmount } = actionConfig.amounts;
  const { userCollateralAmount } = cauldron.userPosition.collateralInfo;

  const itsMax = userCollateralAmount.lte(withdrawAmount); // TODO: make it eq

  const amount = itsMax ? userCollateralAmount : withdrawAmount;

  const share = await bentoBox.toShare(address, amount, true);

  const payload = {
    amount: share,
    updatePrice,
    withdrawUnwrapToken,
  };

  return [payload, isMasterContractApproved, cauldron];
};

const getRemoveCollateralAndRepayPayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
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
    amount: share, // TODO: update after fix this in cook
    collateralAmount: repayAmount, // TODO: update after fix this in cook
    updatePrice,
    itsMax: itsMaxRepay,
    withdrawUnwrapToken,
  };

  return [payload, isMasterContractApproved, cauldron];
};

// TODO: GM payload
const getLeveragePayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  // TODO: update cauldron types
  //@ts-ignore
  const { updatePrice } = cauldron.mainParams;
  const { isMasterContractApproved } = cauldron.additionalInfo;

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
    amount: leverageAmounts.amountFrom,
    minExpected: shareToMin,
    updatePrice,
    itsDefaultBalance: useNativeToken,
    slipage: slippage, // TODO: naming
  };

  return [payload, isMasterContractApproved, cauldron, useUnwrapToken];
};

// TODO: GM payload
const getDeleveragePayload = async (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  account: any
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

  const { deleverageAmounts, withdrawAmount } = actionConfig.amounts;

  const { userCollateralAmount } = cauldron.userPosition.collateralInfo;
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
    borrowAmount: repayAmount, // TODO: update after fix this in cook
    collateralAmount: shareFrom, // TODO: update after fix this in cook
    removeCollateralAmount: withdrawShare, // TODO: update after fix this in cook
    updatePrice,
    itsMax: isMaxRepay,
    slipage: slippage,
    withdrawUnwrapToken,
  };

  return [payload, isMasterContractApproved, cauldron, account];
};
