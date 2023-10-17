import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import checkWhitelistLogic from "@/helpers/cauldron/cook/checkWhitelistLogic";
import recipeSetMaxBorrow from "@/helpers/cauldron/cook/recipies/recipeSetMaxBorrow";
import recipeBorrow from "@/helpers/cauldron/cook/recipies/recipeBorrow";

const cookBorrow = async (
  { amount, updatePrice }: any,
  isApprowed: boolean,
  cauldronObject: any,
  notificationId: number,
  userAddr: string
): Promise<void> => {
  const { address } = cauldronObject.config.mimInfo;
  const { whitelistedInfo } = cauldronObject.additionalInfo;
  const { cauldron } = cauldronObject.contracts;

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  const mim = address;

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, cauldronObject, isApprowed);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  if (checkWhitelistLogic(cauldronObject)) {
    cookData = await recipeSetMaxBorrow(cookData, whitelistedInfo, userAddr);
  }

  cookData = await recipeBorrow(
    cookData,
    cauldronObject,
    amount,
    userAddr,
    mim
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

export default cookBorrow;