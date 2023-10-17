import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeRepay from "@/helpers/cauldron/cook/recipies/recipeRepay";

const cookRepay = async (
  { amount, updatePrice, itsMax } : any,
  isApprowed: boolean,
  cauldronObject: any,
  notificationId: number,
  userAddr: string
): Promise<void> => {
  const { cauldron } = cauldronObject.contracts;

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
    amount,
    userAddr
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

export default cookRepay;
