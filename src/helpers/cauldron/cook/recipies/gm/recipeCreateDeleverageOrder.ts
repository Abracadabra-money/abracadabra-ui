import { getGasLimits } from "@/helpers/gm/fee/getGasLimits";
import store from "@/store";
import { Contract } from "ethers";
import { ORDER_AGENT } from "@/constants/gm";
import {
  estimateExecuteWithdrawalGasLimit,
  getExecutionFee,
} from "@/helpers/gm/fee/getExecutionFee";
import OrderAgentAbi from "@/abis/gm/OrderAgentAbi";

import { getWithdrawalAmountsByMarket } from "@/helpers/gm/getWithdrawalAmounts";
import { actions } from "@/helpers/cauldron/cook/actions";

export const recipeCreateDeleverageOrder = async (
  cookData: any,
  inputToken: any,
  inputAmount: any
) => {
  const deposit = false;
  const provider = store.getters.getProvider;
  const gasLimits = await getGasLimits(provider);

  const orderAgentContract = new Contract(ORDER_AGENT, OrderAgentAbi, provider);
  const callbackGasLimit = await orderAgentContract.callbackGasLimit();

  const estimatedWithdrawGasLimit = estimateExecuteWithdrawalGasLimit(
    gasLimits,
    callbackGasLimit
  );

  const executionFee = await getExecutionFee(
    gasLimits,
    estimatedWithdrawGasLimit,
    provider
  );

  //@ts-ignore
  const { shortAmountOut, longAmountOut } = await getWithdrawalAmountsByMarket(
    inputToken,
    inputAmount,
    provider
  );

  const updatedCookData = actions.createOrder(
    cookData,
    executionFee,
    inputToken,
    deposit,
    inputAmount,
    executionFee,
    shortAmountOut,
    longAmountOut
  );

  return {
    updatedCookData,
    executionFee: executionFee,
  };
};
