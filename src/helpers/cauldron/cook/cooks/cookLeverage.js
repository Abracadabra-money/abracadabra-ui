import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import checkWhitelistLogic from "@/helpers/cauldron/cook/checkWhitelistLogic";
import recipeSetMaxBorrow from "@/helpers/cauldron/cook/recipies/recipeSetMaxBorrow";

import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import recipeLeverage from "@/helpers/cauldron/cook/recipies/recipeLeverage";

const defaultTokenAddress = "0x0000000000000000000000000000000000000000"; // FIX ADDRESS

const cookLeverage = async (
  {
    collateralAmount,
    amount,
    updatePrice,
    minExpected,
    itsDefaultBalance,
    slipage,
  },
  isApprowed,
  cauldronObject,
  notificationId,
  isWrap
) => {
  const { whitelistedInfo } = cauldronObject.additionalInfo;
  const { collateral, leverageSwapper } = cauldronObject.contracts;
  const { is0xSwap } = cauldronObject.config.cauldronSettings;
  const { cauldron } = cauldronObject.contracts;
  const userAddr = this.account; // TODO
  const collateralValue = itsDefaultBalance ? collateralAmount.toString() : 0;
  const tokenAddr = itsDefaultBalance
  ? this.defaultTokenAddress
  : collateral.address;

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

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

  cookData = await recipeAddCollatral(
    cookData,
    cauldronObject,
    tokenAddr,
    isWrap,
    this.account,
    collateralAmount,
    collateralValue
  );

  cookData = await actions.borrow(cookData, amount, leverageSwapper.address);

  cookData = await recipeLeverage(
    cookData,
    cauldronObject,
    amount,
    minExpected,
    slipage,
    is0xSwap
  );

  cookData = await actions.addCollateral(cookData, "-2", this.account, false);

  if (isApprowed && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract()
    );

  await sendCook(cauldron, cookData, collateralValue, notificationId);
};

export default cookLeverage;
