// @ts-nocheck

import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import { recipeLeverage } from "@/helpers/cauldron/cook/recipies/gm/recipeLeverage";
import { recipeCreateLeverageOrder } from "@/helpers/cauldron/cook/recipies/gm/recipeCreateLeverageOrder";

import type { CookData, PayloadLeverageGm } from "../types";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const cookLeverage = async (
  { collateralAmount, mimAmount, slipage, to, useWrapper }: PayloadLeverageGm,
  cauldronObject: CauldronInfo
): Promise<void> => {
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
  const { collateral, leverageSwapper, cauldron } = cauldronObject.contracts;
  const { updatePrice } = cauldronObject.mainParams;

  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(
    cookData,
    cauldronObject,
    isMasterContractApproved
  );

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  // NOTICE: added in v3 revamp
  if (collateralAmount.gt(0)) {
    cookData = await recipeAddCollatral(
      cookData,
      cauldronObject,
      collateral.address,
      useWrapper,
      to,
      collateralAmount,
      0
    );
  }

  cookData = await actions.borrow(cookData, mimAmount, leverageSwapper.address);

  const { swapStaticTx, buyAmount } = await recipeLeverage(
    cauldronObject,
    mimAmount,
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

  await cookViem(cauldronObject, updatedCookData, executionFee);
};

export default cookLeverage;
