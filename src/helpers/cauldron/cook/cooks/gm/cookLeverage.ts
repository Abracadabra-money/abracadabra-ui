// @ts-nocheck

import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import { recipeLeverage } from "@/helpers/cauldron/cook/recipies/gm/recipeLeverage";
import { recipeCreateLeverageOrder } from "@/helpers/cauldron/cook/recipies/gm/recipeCreateLeverageOrder";


// TODO: update payload type & naming
const cookLeverage = async (
  { collateralAmount, amount, updatePrice, slipage, to },
  mcApproved,
  cauldronObject,
  isWrap = false
) => {
  const { collateral, leverageSwapper, cauldron } = cauldronObject.contracts;

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, cauldronObject, mcApproved);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  // NOTICE: added in v3 revamp
  if (collateralAmount.gt(0)) {
    cookData = await recipeAddCollatral(
      cookData,
      cauldronObject,
      collateral.address,
      isWrap,
      to,
      collateralAmount,
      0
    );
  }

  cookData = await actions.borrow(cookData, amount, leverageSwapper.address);

  const { swapStaticTx, buyAmount } = await recipeLeverage(
    cauldronObject,
    amount,
    slipage
  );

  cookData = await actions.call(
    cookData,
    leverageSwapper.address,
    swapStaticTx.data,
    false,
    false,
    2
  );

  const { updatedCookData, executionFee } = await recipeCreateLeverageOrder(
    cookData,
    collateral.address,
    buyAmount
  );

  await cook(cauldron, updatedCookData, executionFee);
};

export default cookLeverage