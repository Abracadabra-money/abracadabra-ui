import { getAccount } from "@wagmi/core";

const ACTION_UNKNOWN = 0;
const ACTION_STAKE = 1;
const ACTION_LOCK = 2;
const ACTION_STAKE_AND_LOCK = 3;
const ACTION_WITHDRAW = 4;
const ACTION_WITHDRAW_WITH_REWARDS = 5;
const ACTION_GET_REWARDS = 6;

export const ACTION_TYPES = {
  ACTION_UNKNOWN,
  ACTION_STAKE,
  ACTION_LOCK,
  ACTION_STAKE_AND_LOCK,
  ACTION_WITHDRAW,
  ACTION_WITHDRAW_WITH_REWARDS,
  ACTION_GET_REWARDS,
};

export const WARNING_TYPES = {
  STAKE_ALLOWANCE: 0,
  STAKE_MIN_AMOUNT: 1,
  STAKE_BALANCE: 2,
  LOCK_MIN_AMOUNT: 3,
  LOCK_AMOUNT: 4,
  WITHDRAWABLE_AMOUNT: 5,
  REWARDS_AMOUNT: 6,
  SWITCH_CHAIN: 7,
  CONNECTION: 8,
};

const WARNINGS_BTN_TEXT = {
  [WARNING_TYPES.STAKE_ALLOWANCE]: "Approve",
  [WARNING_TYPES.STAKE_MIN_AMOUNT]: "Minimum amount 100",
  [WARNING_TYPES.STAKE_BALANCE]: "Insufficient balance",
  [WARNING_TYPES.LOCK_MIN_AMOUNT]: "Minimum amount 10",
  [WARNING_TYPES.LOCK_AMOUNT]: "Lock amount exceed",
  [WARNING_TYPES.WITHDRAWABLE_AMOUNT]: "Withdrawable amount exceed",
  [WARNING_TYPES.REWARDS_AMOUNT]: "Reward amount exceed",
  [WARNING_TYPES.SWITCH_CHAIN]: "Switch Chain",
  [WARNING_TYPES.CONNECTION]: "Connect wallet",
};

const ACTIONS_BTN_TEXT = {
  [ACTION_TYPES.ACTION_UNKNOWN]: "Nothing to do",
  [ACTION_TYPES.ACTION_STAKE]: "Stake",
  [ACTION_TYPES.ACTION_LOCK]: "Lock",
  [ACTION_TYPES.ACTION_WITHDRAW]: "Withdraw",
  [ACTION_TYPES.ACTION_WITHDRAW_WITH_REWARDS]: "Withdraw with rewards",
  [ACTION_TYPES.ACTION_GET_REWARDS]: "Get rewards",
};

export const validateAction = (
  contractInfo: any,
  inputAmount: bigint,
  chainId: number,
  action: "stake" | "unstake" | "lock"
) => {
  const actionType = getActionType(contractInfo, inputAmount, action);

  const validationErrors: any = checkForErrors(
    contractInfo,
    chainId,
    inputAmount,
    actionType
  );

  return getValidationResult(validationErrors, actionType);
};

const getActionType = (contractInfo: any, inputAmount: any, action: any) => {
  switch (action) {
    case "stake":
      if (inputAmount) return ACTION_STAKE;
      return ACTION_UNKNOWN;
    case "unstake":
      if (inputAmount) return ACTION_WITHDRAW;
      return ACTION_UNKNOWN;
    case "lock":
      return ACTION_LOCK;
    default:
      return ACTION_UNKNOWN;
  }
};

const checkForErrors = (
  contractInfo: any,
  chainId: any,
  inputAmount: any,
  actionType: number
) => {
  let validationErrors: number[] = [];
  const actionConfig = {
    stakeAmount: 100,
    widhdrowAmount: 200,
    lockAmount: 10,
  };

  validationErrors = validateConnection(validationErrors);

  validationErrors = validateChain(validationErrors, contractInfo, chainId);

  switch (actionType) {
    case ACTION_TYPES.ACTION_STAKE:
      validationErrors = validateStake(
        validationErrors,
        contractInfo,
        inputAmount
      );
      break;
    case ACTION_TYPES.ACTION_LOCK:
      validationErrors = validateLock(validationErrors, contractInfo);
      break;
    case ACTION_TYPES.ACTION_STAKE_AND_LOCK:
      validationErrors = validateStake(
        validationErrors,
        contractInfo,
        inputAmount,
        true
      );
      break;
    case ACTION_TYPES.ACTION_WITHDRAW:
      validationErrors = validateWithdraw(
        validationErrors,
        contractInfo,
        inputAmount
      );
      break;
  }

  return validationErrors;
};

const validateConnection = (validationErrors: any) => {
  const { isConnected } = getAccount();

  if (!isConnected) validationErrors.push(WARNING_TYPES.CONNECTION);

  return validationErrors;
};

const validateChain = (
  validationErrors: any,
  contractInfo: any,
  chainId: number
) => {
  const isValidChain = contractInfo.chainId === chainId;

  if (!isValidChain) validationErrors.push(WARNING_TYPES.SWITCH_CHAIN);

  return validationErrors;
};

const validateStake = (
  validationErrors: any,
  contractInfo: any,
  inputAmount: bigint,
  isLock = false
) => {
  const { approvedAmount, balance } = contractInfo.userInfo.stakeToken;
  const { minLockAmount } = contractInfo;

  if (inputAmount > balance) validationErrors.push(WARNING_TYPES.STAKE_BALANCE);
  if (inputAmount > approvedAmount)
    validationErrors.push(WARNING_TYPES.STAKE_ALLOWANCE);
  if (inputAmount < minLockAmount && isLock)
    validationErrors.push(WARNING_TYPES.STAKE_MIN_AMOUNT);

  return validationErrors;
};

const validateLock = (validationErrors: any, amount: any) => {
  //   if (inputAmount && inputAmount > amount)
  //     validationErrors.push(WARNING_TYPES.LOCK_AMOUNT);
  //   const { unlocked } = contractInfo.userInfo.unlocked;
  if (!amount) validationErrors.push(WARNING_TYPES.LOCK_AMOUNT);

  return validationErrors;
};

const validateWithdraw = (
  validationErrors: any,
  contractInfo: any,
  inputAmount: bigint
) => {
  const { unlocked } = contractInfo.userInfo;

  if (inputAmount > unlocked)
    validationErrors.push(WARNING_TYPES.WITHDRAWABLE_AMOUNT);

  return validationErrors;
};

const getValidationResult = (validationErrors: any, actionType: any) => {
  if (validationErrors.length === 0)
    return {
      btnText: ACTIONS_BTN_TEXT[actionType],
      isAllowed: actionType !== ACTION_TYPES.ACTION_UNKNOWN,
    };

  const exceptions = [
    WARNING_TYPES.STAKE_ALLOWANCE,
    WARNING_TYPES.SWITCH_CHAIN,
    WARNING_TYPES.CONNECTION,
  ];

  console.log("validationErrors", validationErrors);

  const isException = exceptions.indexOf(validationErrors[0]) !== -1;

  return {
    isAllowed: isException,
    btnText: WARNINGS_BTN_TEXT[validationErrors[0]],
    errorType: validationErrors[0],
  };
};
