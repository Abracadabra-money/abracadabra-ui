// @ts-nocheck

import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
import toAmount from "@/helpers/toAmount";
import { ORDER_AGENT } from "@/constants/gm";
import { recipeCreateDeleverageOrder } from "@/helpers/cauldron/cook/recipies/gm/recipeCreateDeleverageOrder";

// TODO: update payload type & naming
const cookWitdrawToOrderGM = async (
  {
    borrowAmount,
    collateralAmount, // share TODO
    removeCollateralAmount,
    updatePrice,
    itsMax,
    slipage,
  },
  isApprowed,
  pool,
  account
) => {
  const { collateral, cauldron, bentoBox } = pool.contracts;

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, pool, isApprowed);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  // remove collateral to order agent & create order
  cookData = await actions.removeCollateral(
    cookData,
    collateralAmount,
    ORDER_AGENT
  );

  const amount = await toAmount(bentoBox, collateral.address, collateralAmount);

  const { updatedCookData, executionFee } = await recipeCreateDeleverageOrder(
    cookData,
    collateral.address,
    amount
  );

  await cook(cauldron, updatedCookData, executionFee);
};

export default cookWitdrawToOrderGM
