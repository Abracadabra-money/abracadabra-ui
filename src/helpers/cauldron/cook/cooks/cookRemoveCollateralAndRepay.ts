import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeRepay from "@/helpers/cauldron/cook/recipies/recipeRepay";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";

import type { CookData, PayloadRemoveCollateralAndRepay } from "./types";

const cookRemoveCollateralAndRepay = async (
  { collateralShare, mimPart, itsMax, to }: PayloadRemoveCollateralAndRepay,
  cauldronObject: any,
): Promise<void> => {
  const { cauldron } = cauldronObject.contracts;
  const tokenAddr = cauldronObject.config.collateralInfo.address;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
  const { updatePrice } = cauldronObject.mainParams;
  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, cauldronObject, isMasterContractApproved);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  cookData = await recipeRepay(
    cookData,
    cauldronObject,
    itsMax,
    mimPart,
    to
  );

  cookData = await recipeRemoveCollateral(
    cookData,
    cauldronObject,
    collateralShare,
    to,
    tokenAddr
  );

  if (isMasterContractApproved && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract(),
      to
    );

  await cook(cauldron, cookData, 0);
};

export default cookRemoveCollateralAndRepay;
