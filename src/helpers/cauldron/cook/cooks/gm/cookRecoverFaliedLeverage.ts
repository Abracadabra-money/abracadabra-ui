import store from "@/store";
import { getOrderBalances } from "@/helpers/gm/orders";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
import { USDC_ADDRESS, WETH_ADDRESS, ORDER_AGENT } from "@/constants/gm";
import { recipeCreateLeverageOrder } from "@/helpers/cauldron/cook/recipies/gm/recipeCreateLeverageOrder";

const cookRecoverFaliedLeverage = async (
  cauldronObject: any,
  order: any,
  account: any
) => {
  const { cauldron, collateral } = cauldronObject.contracts;
  const provider = store.getters.getProvider; // TODO: check provider
  const { balanceUSDC, balanceWETH } = await getOrderBalances(order, provider);

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = balanceWETH.gt(0)
    ? await actions.withdrawFromOrder(
        cookData,
        WETH_ADDRESS,
        account,
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

  await cook(cauldron, updatedCookData, executionFee);
};

export default cookRecoverFaliedLeverage;