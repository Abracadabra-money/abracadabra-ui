import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import checkWhitelistLogic from "@/helpers/cauldron/cook/checkWhitelistLogic";
import recipeSetMaxBorrow from "@/helpers/cauldron/cook/recipies/recipeSetMaxBorrow";

import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import recipeLeverage from "@/helpers/cauldron/cook/recipies/recipeLeverage";

import type { CookData, PayloadLeverage } from "./types";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const defaultTokenAddress = "0x0000000000000000000000000000000000000000";

const cookLeverage = async (
  {
    collateralAmount,
    mimAmount,
    shareToMin,
    useNativeToken,
    slipage,
    useWrapper,
    to,
  }: PayloadLeverage,
  cauldronObject: CauldronInfo
): Promise<void> => {
  const { whitelistedInfo, isMasterContractApproved } =
    cauldronObject.additionalInfo;
  //@ts-ignore
  const { collateral, leverageSwapper, cauldron } = cauldronObject.contracts;
  const { is0xSwap, useDegenBoxHelper, isOpenocean } =
    cauldronObject.config.cauldronSettings;
  const { updatePrice } = cauldronObject.mainParams;

  const value = useNativeToken ? collateralAmount.toString() : "0";
  const tokenAddr = useNativeToken ? defaultTokenAddress : collateral.address;

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

  if (checkWhitelistLogic(cauldronObject)) {
    cookData = await recipeSetMaxBorrow(cookData, whitelistedInfo, to);
  }

  if (collateralAmount.gt(0)) {
    cookData = await recipeAddCollatral(
      cookData,
      cauldronObject,
      tokenAddr,
      useWrapper,
      to,
      collateralAmount,
      value
    );
  }

  cookData = await actions.borrow(
    cookData,
    mimAmount,
    leverageSwapper!.address
  );

  cookData = await recipeLeverage(
    cookData,
    cauldronObject,
    mimAmount,
    shareToMin,
    slipage,
    is0xSwap,
    isOpenocean,
    to
  );

  cookData = await actions.addCollateral(cookData, "-2", to, false);

  if (isMasterContractApproved && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract(),
      to
    );

  await cookViem(cauldronObject, cookData, value);
};

export default cookLeverage;
