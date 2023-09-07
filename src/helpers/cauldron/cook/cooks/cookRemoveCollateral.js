import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";

const cookRemoveCollateral = async (
  { amount, updatePrice },
  isApprowed,
  cauldronObject,
  notificationId,
  userAddr // TODO
) => {
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

  cookData = await recipeRemoveCollateral(
    cookData,
    cauldronObject,
    amount,
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

export default cookRemoveCollateral;
