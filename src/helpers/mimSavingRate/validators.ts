import { getAccountHelper } from "@/helpers/walletClienHelper";

export type ActionType = "stake" | "unstake" | "stakeAndLock" | "lock";

const ACTION_UNKNOWN = "unknown";
const ACTION_STAKE = "stake";
const ACTION_LOCK = "lock";
const ACTION_STAKE_AND_LOCK = "stakeAndLock";
const ACTION_WITHDRAW = "unstake";
const ACTION_WITHDRAW_WITH_REWARDS = "withdrawWithRewards";
const ACTION_GET_REWARDS = "getRewards";

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
  AMOUNT: 9,
};

const WARNINGS_BTN_TEXT = {
  [WARNING_TYPES.STAKE_ALLOWANCE]: "Approve",
  [WARNING_TYPES.STAKE_MIN_AMOUNT]: "Minimum amount 100",
  [WARNING_TYPES.STAKE_BALANCE]: "Insufficient balance",
  [WARNING_TYPES.LOCK_MIN_AMOUNT]: "Minimum amount 100",
  [WARNING_TYPES.LOCK_AMOUNT]: "Lock amount exceed",
  [WARNING_TYPES.WITHDRAWABLE_AMOUNT]: "Withdrawable amount exceed",
  [WARNING_TYPES.REWARDS_AMOUNT]: "Reward amount exceed",
  [WARNING_TYPES.SWITCH_CHAIN]: "Switch Chain",
  [WARNING_TYPES.CONNECTION]: "Connect wallet",
  [WARNING_TYPES.AMOUNT]: "Enter amount",
};

const ACTIONS_BTN_TEXT = {
  [ACTION_TYPES.ACTION_UNKNOWN]: "Nothing to do",
  [ACTION_TYPES.ACTION_STAKE]: "Stake",
  [ACTION_TYPES.ACTION_STAKE_AND_LOCK]: "Stake and Lock",
  [ACTION_TYPES.ACTION_LOCK]: "Lock",
  [ACTION_TYPES.ACTION_WITHDRAW]: "Withdraw",
  [ACTION_TYPES.ACTION_WITHDRAW_WITH_REWARDS]: "Withdraw with rewards",
  [ACTION_TYPES.ACTION_GET_REWARDS]: "Get rewards",
};

const CONNECTION_WARNING = {
  isAllowed: false,
  isDisabled: false,
  btnText: WARNINGS_BTN_TEXT[WARNING_TYPES.CONNECTION],
};

const CHAIN_WARNING = {
  isAllowed: false,
  isDisabled: false,
  btnText: WARNINGS_BTN_TEXT[WARNING_TYPES.SWITCH_CHAIN],
};

const NO_CONTRACT_WARNING = {
  isAllowed: false,
  isDisabled: true,
  btnText: WARNINGS_BTN_TEXT[WARNING_TYPES.AMOUNT],
};

export const validateAction = (
  contractInfo: any,
  actionType: ActionType,
  chainId: number,
  actionConfig: any
) => {
  if (!contractInfo) return NO_CONTRACT_WARNING;

  if (contractInfo.chainId !== chainId) return CHAIN_WARNING;

  if (!getAccountHelper().isConnected) return CONNECTION_WARNING;

  if (actionType === ACTION_LOCK)
    return validateLock(contractInfo, actionConfig.lockAmount);

  const validationErrors: any = checkForErrors(
    contractInfo,
    actionType,
    actionConfig
  );

  return getValidationResult(validationErrors, actionType);
};

const checkForErrors = (
  contractInfo: any,
  actionType: string,
  actionConfig: any
) => {
  let validationErrors: number[] = [];

  switch (actionType) {
    case "stake":
      validationErrors = validateStake(
        validationErrors,
        contractInfo,
        actionConfig.stakeAmount
      );
      break;
    case "stakeAndLock":
      validationErrors = validateStake(
        validationErrors,
        contractInfo,
        actionConfig.stakeAmount,
        true
      );
      break;
    case "unstake":
      validationErrors = validateWithdraw(
        validationErrors,
        contractInfo,
        actionConfig.withdrawAmount
      );
      break;
  }

  return validationErrors;
};

const validateLock = (contractInfo: any, lockAmount: bigint) => {
  const { minLockAmount } = contractInfo;
  const unlockedBalance = contractInfo.userInfo.balances.unlocked;
  const isAllowed =
    lockAmount <= unlockedBalance &&
    lockAmount >= minLockAmount &&
    lockAmount > 0;

  let btnText = isAllowed
    ? ACTIONS_BTN_TEXT[ACTION_TYPES.ACTION_LOCK]
    : WARNINGS_BTN_TEXT[WARNING_TYPES.STAKE_BALANCE];

  if (lockAmount > 0n && lockAmount < minLockAmount) {
    btnText = WARNINGS_BTN_TEXT[WARNING_TYPES.LOCK_MIN_AMOUNT];
  }

  if (lockAmount == 0n) btnText = WARNINGS_BTN_TEXT[WARNING_TYPES.AMOUNT];

  return {
    isAllowed,
    isDisabled: !isAllowed,
    btnText,
  };
};

const validateStake = (
  validationErrors: any,
  contractInfo: any,
  inputAmount: bigint,
  isLock = false
) => {
  const { approvedAmount, balance } = contractInfo.userInfo.stakeToken;
  const { minLockAmount } = contractInfo;

  if (!inputAmount) validationErrors.push(WARNING_TYPES.AMOUNT);
  if (inputAmount > balance) validationErrors.push(WARNING_TYPES.STAKE_BALANCE);

  if (inputAmount < minLockAmount && isLock)
    validationErrors.push(WARNING_TYPES.STAKE_MIN_AMOUNT);

  if (inputAmount > approvedAmount)
    validationErrors.push(WARNING_TYPES.STAKE_ALLOWANCE);

  return validationErrors;
};

const validateWithdraw = (
  validationErrors: any,
  contractInfo: any,
  inputAmount: bigint
) => {
  const { unlocked } = contractInfo.userInfo;

  if (!inputAmount) validationErrors.push(WARNING_TYPES.AMOUNT);
  if (inputAmount > unlocked)
    validationErrors.push(WARNING_TYPES.WITHDRAWABLE_AMOUNT);

  return validationErrors;
};

const getValidationResult = (validationErrors: any, actionType: any) => {
  if (validationErrors.length === 0)
    return {
      isAllowed: false,
      isDisabled: false,
      btnText: ACTIONS_BTN_TEXT[actionType],
    };

  const exceptions = [WARNING_TYPES.STAKE_ALLOWANCE];

  const isException = exceptions.indexOf(validationErrors[0]) !== -1;

  return {
    isAllowed: isException,
    isDisabled: isException ? false : true,
    btnText: WARNINGS_BTN_TEXT[validationErrors[0]],
    errorType: validationErrors[0],
  };
};
