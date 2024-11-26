// @ts-nocheck
import store from "@/store";
import { getOrderBalances } from "@/helpers/gm/orders";
import { actions } from "@/helpers/cauldron/cook/actions";
import { USDC_ADDRESS } from "@/constants/gm";
import { recipeDeleverage } from "@/helpers/cauldron/cook/recipies/gm/recipeDeleverage";
import { repayEncodeHandler } from "@/helpers/cauldron/cook/degenBoxHelper/actionHandlers.js";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";

import type { CookData, PayloadDeleverageFromOrderGm } from "../types";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const cookDeleverageFromOrder = async (
  {
    repayAmount,
    removeCollateralShare,
    itsMax,
    slipage,
    to,
    order,
  }: PayloadDeleverageFromOrderGm,
  cauldronObject: CauldronInfo
): Promise<void> => {
  const { liquidationSwapper, cauldron, bentoBox } = cauldronObject.contracts;
  const collateralAddress = cauldronObject.config.collateralInfo.address;

  const provider = store.getters.getProvider;

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

  const { userBorrowPart, userBorrowAmount } = cauldronObject.userPosition.borrowInfo;

  if (itsMax || deleverageData.buyAmount.gt(userBorrowAmount)) {
    cookData = await repayEncodeHandler(
      cookData,
      cauldronObject,
      userBorrowPart,
      to
    );
  } else {
    cookData = await actions.getRepayPart(cookData, "-2");
    cookData = await repayEncodeHandler(
      cookData,
      cauldronObject,
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

  await cookViem(cauldronObject, cookData, 0);
};

export default cookDeleverageFromOrder;
