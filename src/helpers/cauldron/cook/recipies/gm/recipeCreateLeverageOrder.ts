import { actions } from "@/helpers/cauldron/cook/actions";
import { USDC_ADDRESS, WBTC_ADDRESS } from "@/constants/gm";
import { getGasLimits } from "@/helpers/gm/fee/getGasLimits";
import {
  estimateExecuteDepositGasLimit,
  getExecutionFee,
} from "@/helpers/gm/fee/getExecutionFee";
import { getDepositAmount } from "@/helpers/gm/getDepositAmount";

import { getSwapTokenByMarket } from "@/helpers/gm/utils";

import store from "@/store";

import { BigNumber } from "ethers";

import type { CauldronInfo } from "@/helpers/cauldron/types";

export const recipeCreateLeverageOrder = async (
  cauldronObject: CauldronInfo,
  cookData: any,
  market: any,
  inputAmount: any
) => {
  const inputToken = cauldronObject.additionalInfo.gmInfo.marketInfo.shortToken;
  const deposit = true;

  const provider = store.getters.getProvider;

  const gasLimits = await getGasLimits(provider);
  console.log("gasLimits", gasLimits);
  const estimatedDepositGasLimit = estimateExecuteDepositGasLimit(gasLimits);
  console.log("estimatedDepositGasLimit", estimatedDepositGasLimit);
  const executionFee = await getExecutionFee(
    gasLimits,
    estimatedDepositGasLimit,
    provider
  );
  console.log("executionFee", executionFee);
  const minOutput = await getDepositAmount(
    market,
    BigNumber.from(0),
    inputAmount,
    provider
  );
  console.log("minOutput", minOutput.toString());
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
