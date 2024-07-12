import store from "@/store";
import { getOrderBalances } from "@/helpers/gm/orders";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import { USDC_ADDRESS, WETH_ADDRESS, ORDER_AGENT } from "@/constants/gm";
import { recipeCreateLeverageOrder } from "@/helpers/cauldron/cook/recipies/gm/recipeCreateLeverageOrder";

import type { CookData, PayloadRecoverFailedLeverageGm } from "../types";

const cookRecoverFaliedLeverage = async (
  { order, to }: PayloadRecoverFailedLeverageGm,
  cauldronObject: any
): Promise<void> => {
  const { cauldron, collateral } = cauldronObject.contracts;
  const provider = store.getters.getProvider;
  const { balanceUSDC, balanceWETH } = await getOrderBalances(order, provider);

  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = balanceWETH.gt(0)
    ? await actions.withdrawFromOrder(
        cookData,
        WETH_ADDRESS,
        to,
        balanceWETH,
        false
      )
    : cookData;

  cookData = await actions.withdrawFromOrder(
    cookData,
    USDC_ADDRESS,
    ORDER_AGENT,
    balanceUSDC,
    true
  );

  const { updatedCookData, executionFee } = await recipeCreateLeverageOrder(
    cookData,
    collateral.address,
    balanceUSDC
  );

  await cookViem(cauldronObject, updatedCookData, executionFee);
};

export default cookRecoverFaliedLeverage;
