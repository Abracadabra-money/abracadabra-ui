import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeRepay from "@/helpers/cauldron/cook/recipies/recipeRepay";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";

const cookRemoveCollateralAndRepay = async (
  { amount, collateralAmount, updatePrice, itsMax }: any,
  isApprowed: boolean,
  cauldronObject: any,
  notificationId: number,
  userAddr: string
): Promise<void> => {
  const { cauldron } = cauldronObject.contracts;
  const tokenAddr = cauldronObject.config.collateralInfo.address;

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, cauldronObject, isApprowed);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  cookData = await recipeRepay(
    cookData,
    cauldronObject,
    itsMax,
    collateralAmount, // mim part
    userAddr
  );

  cookData = await recipeRemoveCollateral(
    cookData,
    cauldronObject,
    amount, // collateral share
    userAddr,
    tokenAddr
  );

  if (isApprowed && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract(),
      userAddr
    );

  await sendCook(cauldron, cookData, 0, notificationId);
};

export default cookRemoveCollateralAndRepay;
