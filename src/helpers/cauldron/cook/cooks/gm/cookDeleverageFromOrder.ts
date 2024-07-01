// @ts-nocheck
import store from "@/store";
import { getOrderBalances } from "@/helpers/gm/orders";
import { actions } from "@/helpers/cauldron/cook/actions";
import { USDC_ADDRESS } from "@/constants/gm";
import { recipeDeleverage } from "@/helpers/cauldron/cook/recipies/gm/recipeDeleverage";
import { repayEncodeHandler } from "@/helpers/cauldron/cook/degenBoxHelper/actionHandlers.js";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";
import { cook } from "@/helpers/cauldron/cauldron";

import type { CookData, PayloadDeleverageFromOrderGm } from "../types";

// TODO: update payload type & naming
const cookDeleverageFromOrder = async (
  {
    repayAmount,
    removeCollateralShare,
    itsMax,
    slipage,
    to,
    order,
  }: PayloadDeleverageFromOrderGm,
  cauldronObject
): Promise<void> => {
  const { liquidationSwapper, cauldron, bentoBox } = cauldronObject.contracts;
  const collateralAddress = cauldronObject.config.collateralInfo.address;

  const provider = store.getters.getProvider; // TODO: check provider
  const { balanceUSDC } = await getOrderBalances(order, provider);

  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = actions.withdrawFromOrder(
    cookData,
    USDC_ADDRESS,
    liquidationSwapper.address,
    balanceUSDC,
    true
  );

  const shareFrom = await bentoBox.toShare(USDC_ADDRESS, balanceUSDC, false);

  const deleverageData = await recipeDeleverage(
    cookData,
    cauldronObject,
    shareFrom,
    repayAmount,
    slipage
  );

  cookData = deleverageData.cookData;

  const { userBorrowPart } = cauldronObject.userPosition.borrowInfo;

  if (itsMax || deleverageData.buyAmount.gt(userBorrowPart)) {
    cookData = await repayEncodeHandler(
      cookData,
      cauldron.address,
      userBorrowPart,
      to
    );
  } else {
    cookData = await actions.getRepayPart(cookData, "-2");
    cookData = await repayEncodeHandler(
      cookData,
      cauldron.address,
      "-1",
      to,
      false,
      true
    );
  }

  if (+removeCollateralShare > 0) {
    cookData = await recipeRemoveCollateral(
      cookData,
      cauldronObject,
      removeCollateralShare,
      to,
      collateralAddress
    );
  }

  await cook(cauldron, cookData, 0);
};

export default cookDeleverageFromOrder;
