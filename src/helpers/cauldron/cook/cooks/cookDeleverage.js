import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeDeleverage from "@/helpers/cauldron/cook/recipies/recipeDeleverage";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";
import { repayEncodeHandler } from "@/mixins/borrow/cook/degenBoxHelper/actionHandlers.js";

const cookDeleverage = async (
  {
    borrowAmount,
    collateralAmount,
    removeCollateralAmount,
    updatePrice,
    itsMax,
    slipage,
  },
  isApprowed,
  cauldronObject,
  account,
  notificationId
) => {
  const { collateral, liquidationSwapper, cauldron } = cauldronObject.contracts;
  const { userBorrowPart } = cauldronObject.userPosition.borrowInfo;
  const { is0xSwap } = cauldronObject.config.cauldronSettings;
  const collateralTokenAddr = collateral.address;
  const reverseSwapperAddr = liquidationSwapper.address;
  const userAddr = account;

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, cauldronObject, isApprowed);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  cookData = await actions.removeCollateral(
    cookData,
    collateralAmount,
    reverseSwapperAddr
  );

  cookData = await recipeDeleverage(
    cookData,
    cauldronObject,
    collateralAmount,
    borrowAmount,
    slipage,
    is0xSwap
  );

  if (itsMax) {
    cookData = await repayEncodeHandler(
      cookData,
      cauldronObject,
      userBorrowPart,
      userAddr
    );
  } else {
    cookData = await actions.getRepayPart(cookData, "-2");
    cookData = await repayEncodeHandler(
      cookData,
      cauldronObject,
      "-1",
      userAddr,
      false,
      true
    );
  }

  if (+removeCollateralAmount > 0) {
    cookData = await recipeRemoveCollateral(
      cookData,
      cauldronObject,
      removeCollateralAmount,
      userAddr,
      collateralTokenAddr
    );
  }

  if (isApprowed && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract()
    );

  await sendCook(cauldron, cookData, 0, notificationId);
};

export default cookDeleverage;
