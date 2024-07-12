import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeDeleverage from "@/helpers/cauldron/cook/recipies/recipeDeleverage";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";
import { repayEncodeHandler } from "@/helpers/cauldron/cook/degenBoxHelper/actionHandlers.js";

import type { CookData, PayloadDeleverage } from "./types";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const cookDeleverage = async (
  {
    repayAmount,
    collateralShare,
    removeCollateralShare,
    itsMax,
    slipage,
    to,
    withdrawUnwrapToken,
  }: PayloadDeleverage,
  cauldronObject: CauldronInfo
): Promise<void> => {
  //@ts-ignore
  const { collateral, liquidationSwapper, cauldron } = cauldronObject.contracts;
  const { userBorrowPart } = cauldronObject.userPosition.borrowInfo;
  const { is0xSwap, useDegenBoxHelper } =
    cauldronObject.config.cauldronSettings;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
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

  cookData = await actions.removeCollateral(
    cookData,
    collateralShare,
    liquidationSwapper.address
  );

  cookData = await recipeDeleverage(
    cookData,
    cauldronObject,
    collateralShare,
    repayAmount,
    slipage,
    !!is0xSwap,
    to
  );

  if (itsMax) {
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
      collateral.address,
      withdrawUnwrapToken
    );
  }

  if (isMasterContractApproved && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract(),
      to
    );

  await cookViem(cauldronObject, cookData, 0);
};

export default cookDeleverage;
