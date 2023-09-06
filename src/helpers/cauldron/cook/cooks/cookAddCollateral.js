import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

const defaultTokenAddress = "0x0000000000000000000000000000000000000000";

const cookAddCollateral = async (
  { amount, updatePrice, itsDefaultBalance },
  isApprowed,
  cauldronObject,
  notificationId,
  isLpLogic = false,
  wrap = false
) => {
  const { address } = cauldronObject.config.collateralInfo;
  const { cauldron } = cauldronObject.contracts;

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  const token = itsDefaultBalance ? defaultTokenAddress : address;
  const value = itsDefaultBalance ? amount.toString() : 0;
  const to = this.account; // TODO
  const isWrap = wrap && isLpLogic;

  let cookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = await checkAndSetMcApprove(cookData, cauldronObject, isApprowed);

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  cookData = await recipeAddCollatral(
    cookData,
    cauldronObject,
    token,
    isWrap,
    to,
    amount,
    value
  );

  if (isApprowed && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract()
    );

  await sendCook(cauldron, cookData, value, notificationId);
};

export default cookAddCollateral;
