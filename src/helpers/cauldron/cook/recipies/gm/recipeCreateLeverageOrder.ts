import { actions } from "@/helpers/cauldron/cook/actions";
import { USDC_ADDRESS } from "@/constants/gm";
import { getGasLimits } from "@/helpers/gm/fee/getGasLimits";
import {
  estimateExecuteDepositGasLimit,
  getExecutionFee,
} from "@/helpers/gm/fee/getExecutionFee";
import { getDepositAmount } from "@/helpers/gm/getDepositAmount";

import store from "@/store";

import { BigNumber } from "ethers";

export const recipeCreateLeverageOrder = async (
  cookData: any,
  market: any,
  inputAmount: any
) => {
  const inputToken = USDC_ADDRESS;
  const deposit = true;

  const provider = store.getters.getProvider;

  const gasLimits = await getGasLimits(provider);
  const estimatedDepositGasLimit = estimateExecuteDepositGasLimit(gasLimits);

  const executionFee = await getExecutionFee(
    gasLimits,
    estimatedDepositGasLimit,
    provider
  );

  const minOutput = await getDepositAmount(
    market,
    BigNumber.from(0),
    inputAmount,
    provider
  );
  const minOutLong = 0; // ok for leverage

  const updatedCookData = actions.createOrder(
    cookData,
    executionFee,
    inputToken,
    deposit,
    inputAmount,
    executionFee,
    minOutput,
    minOutLong
  );

  return {
    updatedCookData,
    executionFee: executionFee,
    minOutput,
  };
};
