// @ts-nocheck

import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import toAmount from "@/helpers/toAmount";
import { ORDER_AGENT } from "@/constants/gm";
import { recipeCreateDeleverageOrder } from "@/helpers/cauldron/cook/recipies/gm/recipeCreateDeleverageOrder";

import type { CookData, PayloadWithdrawToOrderGm } from "../types";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const cookWitdrawToOrderGM = async (
  { collateralShare }: PayloadWithdrawToOrderGm,
  cauldronObject: CauldronInfo
): Promise<void> => {
  const { collateral, cauldron, bentoBox } = cauldronObject.contracts;
  const { updatePrice } = cauldronObject.mainParams;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;

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

  // remove collateral to order agent & create order
  cookData = await actions.removeCollateral(
    cookData,
    collateralShare,
    ORDER_AGENT
  );

  const amount = await toAmount(bentoBox, collateral.address, collateralShare);

  const { updatedCookData, executionFee } = await recipeCreateDeleverageOrder(
    cookData,
    collateral.address,
    amount
  );

  await cookViem(cauldronObject, updatedCookData, executionFee);
};

export default cookWitdrawToOrderGM;
