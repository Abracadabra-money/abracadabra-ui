import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

const defaultTokenAddress = "0x0000000000000000000000000000000000000000";

import recipeBorrow from "@/helpers/cauldron/cook/recipies/recipeBorrow";
import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";

const cookAddCollateralAndBorrow = async (
  { collateralAmount, amount, updatePrice, itsDefaultBalance },
  isApprowed,
  cauldronObject,
  notificationId,
  isLpLogic = false,
  isWrap = false,
  userAddr // TODO
) => {
  const { address } = cauldronObject.config.collateralInfo;
  const { address: mimAddress } = cauldronObject.config.mimInfo;
  const { cauldron } = cauldronObject.contracts;

  const tokenAddr = itsDefaultBalance ? defaultTokenAddress : address;

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  const collateralValue = itsDefaultBalance ? collateralAmount.toString() : 0;

  const pairToken = mimAddress;

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, cauldronObject, isApprowed);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  cookData = await recipeBorrow(
    cookData,
    cauldronObject,
    amount,
    userAddr,
    pairToken
  );

  cookData = await recipeAddCollatral(
    cookData,
    cauldronObject,
    tokenAddr,
    isLpLogic && isWrap,
    userAddr,
    collateralAmount,
    collateralValue
  );

  if (isApprowed && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract(),
      userAddr
    );

  await sendCook(cauldron, cookData, collateralValue, notificationId);
};

export default cookAddCollateralAndBorrow;
