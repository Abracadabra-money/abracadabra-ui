import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import checkWhitelistLogic from "@/helpers/cauldron/cook/checkWhitelistLogic";
import recipeSetMaxBorrow from "@/helpers/cauldron/cook/recipies/recipeSetMaxBorrow";
import recipeBorrow from "@/helpers/cauldron/cook/recipies/recipeBorrow";

import type { CookData, PayloadBorrow } from "./types";

const cookBorrow = async (
  { amount, to }: PayloadBorrow,
  cauldronObject: any,
): Promise<void> => {
  const { address: mimAddress } = cauldronObject.config.mimInfo;
  const { whitelistedInfo } = cauldronObject.additionalInfo;
  const { cauldron } = cauldronObject.contracts;
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

  if (checkWhitelistLogic(cauldronObject)) {
    cookData = await recipeSetMaxBorrow(cookData, whitelistedInfo, to);
  }

  cookData = await recipeBorrow(
    cookData,
    cauldronObject,
    amount,
    to,
    mimAddress
  );

  if (isMasterContractApproved && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract(),
      to
    );

  await cookViem(cauldronObject, cookData, 0);
};

export default cookBorrow;