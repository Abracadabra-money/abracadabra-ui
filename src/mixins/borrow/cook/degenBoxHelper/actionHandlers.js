import { actions } from "../actions";
import { encodedHelpersActions } from "./actions";
import { getDegenBoxHelperContract } from "./getDegenBoxHelperContract";

export const repayEncodeHandler = async (
  cookData,
  cauldron,
  part,
  to,
  skim = false,
  useValue1 = false,
  useValue2 = false,
  returnValues = 0
) => {
  const useDegenBoxHelper = cauldron.config.cauldronSettings.useDegenBoxHelper;
  if (!useDegenBoxHelper) return await actions.repay(cookData, part, to, skim);

  const degenBoxHelperContract = getDegenBoxHelperContract(
    cauldron.config.chainId
  );

  return await encodedHelpersActions.repay(
    cookData,
    degenBoxHelperContract,
    to,
    cauldron.config.contract.address,
    part,
    useValue1,
    useValue2,
    returnValues
  );
};

export const bentoDepositEncodeHandler = async (
  cookData,
  cauldron,
  token,
  to,
  amount,
  share,
  value = "0",
  useValue1 = false,
  useValue2 = false,
  returnValues = 0
) => {
  const useDegenBoxHelper = cauldron.config.cauldronSettings.useDegenBoxHelper;

  if (!useDegenBoxHelper)
    return await actions.bentoDeposit(
      cookData,
      token,
      to,
      amount,
      share,
      value
    );

  const degenBoxHelperContract = getDegenBoxHelperContract(
    cauldron.config.chainId
  );

  return await encodedHelpersActions.bentoDeposit(
    cookData,
    degenBoxHelperContract,
    token,
    to,
    amount,
    share,
    useValue1,
    useValue2,
    returnValues
  );
};

export const bentoWithdrawEncodeHandler = async (
  cookData,
  cauldron,
  token,
  to,
  amount,
  share,
  useValue1 = false,
  useValue2 = false,
  returnValues = 0
) => {
  const useDegenBoxHelper = cauldron.config.cauldronSettings.useDegenBoxHelper;

  if (!useDegenBoxHelper)
    return await actions.bentoWithdraw(cookData, token, to, amount, share);

  const degenBoxHelperContract = getDegenBoxHelperContract(
    cauldron.config.chainId
  );

  return await encodedHelpersActions.bentoWithdraw(
    cookData,
    degenBoxHelperContract,
    token,
    to,
    amount,
    share,
    useValue1,
    useValue2,
    returnValues
  );
};
