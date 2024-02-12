import type { ActionConfig, CauldronInfo } from "@/helpers/cauldron/types";
import { getCookTypeByAction, ACTION_TYPES } from "./getCookActionType";
import { getExpectedPostition } from "./getExpectedPosition";
import { expandDecimals } from "../gm/fee/expandDecials";
import { getMaxToBorrow, getMaxCollateralToRemove } from "./utils";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import { getAccount } from "@wagmi/core";
import { utils } from "ethers";

export const WARNING_TYPES = {
  DEPOSIT_ALLOWANCE: 0,
  DEPOSIT_BALANCE: 1,
  REPAY_ALLOWANCE: 2,
  REPAY_BALANCE: 3,
  CAULDRON_MIM_LEFT: 4,
  WITHDRAWABLE_AMOUNT: 5,
  USER_MAX_TO_BORROW: 6,
  POSITION_LIQUIDATION: 7,
  POSITION_MAX_TO_BORROW: 8,
  POSITION_MAX_TO_REPAY: 9,
  POSITION_MAX_TO_REMOVE: 10,
  SWITCH_CHAIN: 11,
  SSPELL_LOCKED: 12,
  CONNECTION: 13,
  ACTIVE_ORDER: 14,
};

const WARNINGS_BTN_TEXT = {
  [WARNING_TYPES.DEPOSIT_ALLOWANCE]: "Approve",
  [WARNING_TYPES.DEPOSIT_BALANCE]: "Insufficient balance",
  [WARNING_TYPES.REPAY_ALLOWANCE]: "Approve",
  [WARNING_TYPES.REPAY_BALANCE]: "Insufficient balance",
  [WARNING_TYPES.CAULDRON_MIM_LEFT]: "Cauldron`s MIM balance exceed",
  [WARNING_TYPES.WITHDRAWABLE_AMOUNT]: "Withdrawable amount exceed",
  [WARNING_TYPES.USER_MAX_TO_BORROW]: "MIM borrow limit exceed",
  [WARNING_TYPES.POSITION_LIQUIDATION]: "Instant liquidation",
  [WARNING_TYPES.POSITION_MAX_TO_BORROW]: "Max borrow amount exceed",
  [WARNING_TYPES.POSITION_MAX_TO_REPAY]: "Max repay amount exceed",
  [WARNING_TYPES.POSITION_MAX_TO_REMOVE]: "Max remove amount exceed",
  [WARNING_TYPES.SWITCH_CHAIN]: "Switch Chain",
  [WARNING_TYPES.SSPELL_LOCKED]: "sSpell is locked",
  [WARNING_TYPES.CONNECTION]: "Connect wallet",
  [WARNING_TYPES.ACTIVE_ORDER]: "Close the active order",
};

const ACTIONS_BTN_TEXT = {
  [ACTION_TYPES.ACTION_UNKNOWN]: "Nothing to do",
  [ACTION_TYPES.ACTION_DEPOSIT]: "Add collateral",
  [ACTION_TYPES.ACTION_BORROW]: "Borrow",
  [ACTION_TYPES.ACTION_DEPOSIT_AND_BORROW]: "Add collateral and borrow",
  [ACTION_TYPES.ACTION_REPAY]: "Repay",
  [ACTION_TYPES.ACTION_REMOVE_COLLATERAL]: "Remove collateral",
  [ACTION_TYPES.ACTION_REPAY_AND_REMOVE_COLLATERAL]: "Remove and Repay",
  [ACTION_TYPES.ACTION_LEVERAGE]: "Leverage Up",
  [ACTION_TYPES.ACTION_DELEVERAGE]: "Flash Repay",
};

export const validateCookByAction = (
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  action: "borrow" | "repay",
  chainId: number
) => {
  const cookType = getCookTypeByAction(actionConfig, action);

  const expectedPosition = getExpectedPostition(cauldron, actionConfig, action);

  let validationErrors: any = [];

  validationErrors = validateConnection(validationErrors);
  validationErrors = validateChain(validationErrors, cauldron, chainId);

  validationErrors = validatePosition(
    validationErrors,
    cauldron,
    expectedPosition
  );

  validationErrors = validateSSpellLocked(
    validationErrors,
    cauldron,
    actionConfig
  );

  validationErrors = validateGmOrderCreation(validationErrors, cauldron);

  switch (cookType) {
    case ACTION_TYPES.ACTION_DEPOSIT:
      validationErrors = validateDeposit(
        validationErrors,
        cauldron,
        actionConfig
      );
      break;
    case ACTION_TYPES.ACTION_BORROW:
      validationErrors = validateBorrow(
        validationErrors,
        cauldron,
        actionConfig,
        expectedPosition
      );
      break;
    case ACTION_TYPES.ACTION_DEPOSIT_AND_BORROW:
      validationErrors = validateDepositAndBorrow(
        validationErrors,
        cauldron,
        actionConfig,
        expectedPosition
      );
      break;
    case ACTION_TYPES.ACTION_REPAY:
      validationErrors = validateRepay(
        validationErrors,
        cauldron,
        actionConfig
      );
      break;
    case ACTION_TYPES.ACTION_REMOVE_COLLATERAL:
      validationErrors = validateRemoveCollateral(
        validationErrors,
        cauldron,
        actionConfig,
        expectedPosition
      );
      break;
    case ACTION_TYPES.ACTION_REPAY_AND_REMOVE_COLLATERAL:
      validationErrors = validateRepayAndRemoveCollateral(
        validationErrors,
        cauldron,
        actionConfig,
        expectedPosition
      );
      break;
    case ACTION_TYPES.ACTION_LEVERAGE:
      validationErrors = validateLeverage(
        validationErrors,
        cauldron,
        actionConfig,
        expectedPosition
      );
      break;
    case ACTION_TYPES.ACTION_DELEVERAGE:
      validationErrors = validateDeleverage(
        validationErrors,
        cauldron,
        actionConfig,
        expectedPosition
      );
      break;
  }

  const validationResult = getValidationResult(validationErrors, cookType);

  return validationResult;
};

const validatePosition = (
  validationErrors: any,
  cauldron: CauldronInfo,
  expectPosition: any
) => {
  const { oracleExchangeRate } = cauldron.mainParams;
  //@ts-ignore
  const { decimals } = cauldron.config.collateralInfo;

  const { liquidationPrice } = expectPosition;

  // TODO: get from CauldronInfo
  const collateralPrice = expandDecimals(1, 18 + decimals).div(
    oracleExchangeRate
  );

  const liquidationCheck = liquidationPrice.lt(collateralPrice);

  if (!liquidationCheck)
    validationErrors.push(WARNING_TYPES.POSITION_LIQUIDATION);

  return validationErrors;
};

const validateDeposit = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  const { useNativeToken, useUnwrapToken } = actionConfig;

  const {
    collateralBalance,
    collateralAllowance,
    unwrappedTokenAllowance,
    unwrappedTokenBalance,
    nativeTokenBalance,
  } = cauldron.userTokensInfo!;

  const { collateralTokenAmount, unwrapTokenAmount } =
    actionConfig.amounts.depositAmounts;

  if (useNativeToken) {
    const depositBalanceCheck = collateralTokenAmount.lte(nativeTokenBalance);

    if (!depositBalanceCheck)
      validationErrors.push(WARNING_TYPES.DEPOSIT_BALANCE);

    return validationErrors;
  }

  if (useUnwrapToken) {
    const depositBalanceCheck = unwrapTokenAmount.lte(unwrappedTokenBalance!);
    const depositAllowanceCheck = unwrapTokenAmount.lte(
      unwrappedTokenAllowance!
    );

    if (!depositBalanceCheck)
      validationErrors.push(WARNING_TYPES.DEPOSIT_BALANCE);

    if (!depositAllowanceCheck)
      validationErrors.push(WARNING_TYPES.DEPOSIT_ALLOWANCE);

    return validationErrors;
  }

  const depositBalanceCheck = collateralTokenAmount.lte(collateralBalance);
  const depositAllowanceCheck = collateralTokenAmount.lte(collateralAllowance);

  if (!depositBalanceCheck)
    validationErrors.push(WARNING_TYPES.DEPOSIT_BALANCE);

  if (!depositAllowanceCheck)
    validationErrors.push(WARNING_TYPES.DEPOSIT_ALLOWANCE);

  return validationErrors;
};

const validateBorrow = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  expectedPosition: any
) => {
  const { useLeverage, amounts } = actionConfig;
  const { borrowAmount, leverageAmounts } = amounts;
  const { mimLeftToBorrow, userMaxBorrow, oracleExchangeRate } =
    cauldron.mainParams;
  const { userBorrowAmount } = cauldron.userPosition.borrowInfo;

  //@ts-ignore
  const mcr = expandDecimals(cauldron.config.mcr, PERCENT_PRESITION);

  const maxToBorrow = getMaxToBorrow(
    expectedPosition.collateralAmount,
    userBorrowAmount,
    mcr,
    oracleExchangeRate
  );

  const mimToBorrow = useLeverage ? leverageAmounts.amountFrom : borrowAmount;

  const cauldronMimLeftCheck = mimToBorrow.lte(mimLeftToBorrow);
  const userMaxBorrowCheck = mimToBorrow.lte(userMaxBorrow);
  const positionMaxToBorrowCheck = mimToBorrow.lte(maxToBorrow);

  if (!positionMaxToBorrowCheck)
    validationErrors.push(WARNING_TYPES.POSITION_MAX_TO_BORROW);
  if (!cauldronMimLeftCheck)
    validationErrors.push(WARNING_TYPES.CAULDRON_MIM_LEFT);
  if (!userMaxBorrowCheck)
    validationErrors.push(WARNING_TYPES.USER_MAX_TO_BORROW);

  return validationErrors;
};

const validateDepositAndBorrow = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  expectedPosition: any
) => {
  validationErrors = validateDeposit(validationErrors, cauldron, actionConfig);

  validationErrors = validateBorrow(
    validationErrors,
    cauldron,
    actionConfig,
    expectedPosition
  );

  return validationErrors;
};

const validateLeverage = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  expectedPosition: any
) => {
  validationErrors = validateDeposit(validationErrors, cauldron, actionConfig);

  validationErrors = validateBorrow(
    validationErrors,
    cauldron,
    actionConfig,
    expectedPosition
  );

  return validationErrors;
};

const validateRemoveCollateral = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  expectPosition: any
) => {
  //@ts-ignore
  const { hasWithdrawableLimit } = cauldron.config!.cauldronSettings;
  const { maxWithdrawAmount } = cauldron.additionalInfo;
  const { oracleExchangeRate } = cauldron.mainParams;
  const { useDeleverage, amounts } = actionConfig;
  const { withdrawAmount, deleverageAmounts } = amounts;
  const { userCollateralAmount } = cauldron.userPosition.collateralInfo;

  //@ts-ignore
  const mcr = expandDecimals(cauldron.config!.mcr, PERCENT_PRESITION);

  let withdrawableAmountCheck = true;

  if (hasWithdrawableLimit) {
    withdrawableAmountCheck = useDeleverage
      ? withdrawAmount.lte(maxWithdrawAmount) &&
        deleverageAmounts.amountFrom.lte(maxWithdrawAmount)
      : withdrawAmount.lte(maxWithdrawAmount);
  }

  const maxToRemove = getMaxCollateralToRemove(
    userCollateralAmount,
    expectPosition.mimAmount,
    mcr,
    oracleExchangeRate
  );

  const positionMaxToRemoveCheck = withdrawAmount.lte(maxToRemove);

  if (!withdrawableAmountCheck)
    validationErrors.push(WARNING_TYPES.WITHDRAWABLE_AMOUNT);
  if (!positionMaxToRemoveCheck)
    validationErrors.push(WARNING_TYPES.POSITION_MAX_TO_REMOVE);

  return validationErrors;
};

const validateRepay = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  const { userBorrowAmount } = cauldron.userPosition.borrowInfo;
  //@ts-ignore
  const { mimBalance, mimAllowance } = cauldron.userTokensInfo;
  const { repayAmount } = actionConfig.amounts;

  const repayBalanceCheck = repayAmount.lte(mimBalance);
  const repayAllowanceCheck = repayAmount.lte(mimAllowance);
  const positionMaxRepayCheck = repayAmount.lte(userBorrowAmount);

  if (!repayBalanceCheck) validationErrors.push(WARNING_TYPES.REPAY_BALANCE);
  if (!repayAllowanceCheck)
    validationErrors.push(WARNING_TYPES.REPAY_ALLOWANCE);
  if (!positionMaxRepayCheck)
    validationErrors.push(WARNING_TYPES.POSITION_MAX_TO_REPAY);

  return validationErrors;
};

const validateGmOrderCreation = (
  validationErrors: any,
  cauldron: CauldronInfo
) => {
  const { hasActiveGmOrder } = cauldron.additionalInfo;
  if (hasActiveGmOrder) validationErrors.push(WARNING_TYPES.ACTIVE_ORDER);

  return validationErrors;
};

// TODO
const validateGmMaxCap = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  return validationErrors;
};

const validateRepayAndRemoveCollateral = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  expectedPosition: any
) => {
  validationErrors = validateRepay(validationErrors, cauldron, actionConfig);

  validationErrors = validateRemoveCollateral(
    validationErrors,
    cauldron,
    actionConfig,
    expectedPosition
  );
  return validationErrors;
};

const validateDeleverage = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig,
  expectedPosition: any
) => {
  const mimToRepay = utils.formatUnits(
    actionConfig.amounts.deleverageAmounts.amountToMin
  );

  // @ts-ignore
  if (Number(mimToRepay) > cauldron.userPosition.mimBorrowed)
    validationErrors.push(WARNING_TYPES.REPAY_BALANCE);

  validationErrors = validateRemoveCollateral(
    validationErrors,
    cauldron,
    actionConfig,
    expectedPosition
  );

  return validationErrors;
};

const validateSSpellLocked = (
  validationErrors: any,
  cauldron: CauldronInfo,
  actionConfig: ActionConfig
) => {
  const { isCollateralLocked } = cauldron.additionalInfo;

  const { collateralTokenAmount } = actionConfig.amounts.depositAmounts;

  if (isCollateralLocked && collateralTokenAmount.gt(0))
    validationErrors.push(WARNING_TYPES.SSPELL_LOCKED);

  return validationErrors;
};

const validateChain = (
  validationErrors: any,
  cauldron: CauldronInfo,
  chainId: number
) => {
  //@ts-ignore
  const isValidChain = cauldron.config.chainId === chainId;
  if (!isValidChain) validationErrors.push(WARNING_TYPES.SWITCH_CHAIN);

  return validationErrors;
};

const validateConnection = (validationErrors: any) => {
  const { isConnected } = getAccount();

  if (!isConnected) validationErrors.push(WARNING_TYPES.CONNECTION);

  return validationErrors;
};

const getValidationResult = (validationErrors: any, cookType: any) => {
  if (validationErrors.length === 0)
    return {
      btnText: ACTIONS_BTN_TEXT[cookType],
      isAllowed: cookType !== ACTION_TYPES.ACTION_UNKNOWN,
    };

  const exceptions = [
    WARNING_TYPES.DEPOSIT_ALLOWANCE,
    WARNING_TYPES.REPAY_ALLOWANCE,
    WARNING_TYPES.SWITCH_CHAIN,
    WARNING_TYPES.CONNECTION,
  ];

  const isException = exceptions.indexOf(validationErrors[0]) !== -1;

  return {
    isAllowed: isException, // allowed for approvals, chain swich and connect
    btnText: WARNINGS_BTN_TEXT[validationErrors[0]],
    errorType: validationErrors[0],
  };
};
