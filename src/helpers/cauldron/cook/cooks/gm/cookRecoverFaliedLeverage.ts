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
import { BigNumber, utils } from "ethers";

import orderAbi from "@/abis/gm/order";

const cookRecoverFaliedLeverage = async (
  { order, to }: PayloadRecoverFailedLeverageGm,
  cauldronObject: CauldronInfo
): Promise<void> => {
  //@ts-ignore
  const { collateral } = cauldronObject.contracts;

  const provider = store.getters.getProvider;
  const { balanceUSDC, balanceWETH } = await getOrderBalances(order, provider);

  console.log("balanceUSDC, balanceWETH", balanceUSDC, balanceWETH, order);

  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  const balance = await collateral.balanceOf(order);

  console.log(
    "balance",
    cookData,
    cauldronObject.config.collateralInfo.address,
    cauldronObject.config.contract.address,
    balance.toString(),
    true
  );

  cookData = await actions.withdrawFromOrder(
    cookData,
    cauldronObject.config.collateralInfo.address,
    cauldronObject.config.contract.address,
    balance,
    true
  );

  console.log("cookData", cookData);

  await cookViem(cauldronObject, cookData, 0);
};

export default cookRecoverFaliedLeverage;
