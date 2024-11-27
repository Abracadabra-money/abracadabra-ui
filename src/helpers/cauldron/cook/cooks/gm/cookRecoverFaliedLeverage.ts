import store from "@/store";
import { getOrderBalances } from "@/helpers/gm/orders";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import { USDC_ADDRESS, WETH_ADDRESS, ORDER_AGENT } from "@/constants/gm";
import { recipeCreateLeverageOrder } from "@/helpers/cauldron/cook/recipies/gm/recipeCreateLeverageOrder";

import type { CookData, PayloadRecoverFailedLeverageGm } from "../types";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getGasLimits } from "@/helpers/gm/fee/getGasLimits";
import {
  estimateExecuteDepositGasLimit,
  getExecutionFee,
} from "@/helpers/gm/fee/getExecutionFee";
import { utils } from "ethers";

const cookRecoverFaliedLeverage = async (
  { order, to }: PayloadRecoverFailedLeverageGm,
  cauldronObject: CauldronInfo
): Promise<void> => {
  //@ts-ignore
  const { collateral } = cauldronObject.contracts;

  // const provider = store.getters.getProvider;
  // const { balanceUSDC, balanceWETH } = await getOrderBalances(order, provider);

  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  console.log("cauldronObject", cauldronObject);

  // cookData = balanceWETH.gt(0)
  //   ? await actions.withdrawFromOrder(
  //       cookData,
  //       WETH_ADDRESS,
  //       to,
  //       balanceWETH,
  //       false
  //     )
  //   : cookData;

  const balance = await collateral.balanceOf(order);

  cookData = await actions.withdrawFromOrder(
    cookData,
    cauldronObject.config.collateralInfo.address,
    // ORDER_AGENT,
    cauldronObject.config.contract.address,
    // balanceUSDC,
    balance,
    true
  );

  // const { updatedCookData, executionFee } = await recipeCreateLeverageOrder(
  //   cookData,
  //   collateral.address,
  //   balanceUSDC
  // );

  // const gasLimits = await getGasLimits(provider);
  // const estimatedDepositGasLimit = estimateExecuteDepositGasLimit(gasLimits);

  // const executionFee = await getExecutionFee(
  //   gasLimits,
  //   estimatedDepositGasLimit,
  //   provider
  // );

  // console.log("executionFee", executionFee);

  // console.log("3333444", updatedCookData, executionFee);

  await cookViem(cauldronObject, cookData, 0);
};

export default cookRecoverFaliedLeverage;
