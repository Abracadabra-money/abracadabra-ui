import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeRepay from "@/helpers/cauldron/cook/recipies/recipeRepay";

import type { CookData, PayloadRepay } from "./types";

const cookRepay = async (
  { amount, itsMax, to }: PayloadRepay,
  cauldronObject: any
): Promise<void> => {
  const { cauldron } = cauldronObject.contracts;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
  const { updatePrice } = cauldronObject.mainParams;
  const { useDegenBoxHelper } = cauldronObject.config.cauldronSettings;

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

  cookData = await recipeRepay(cookData, cauldronObject, itsMax, amount, to);

  if (isMasterContractApproved && useDegenBoxHelper)
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      false,
      await cauldron.masterContract(),
      to
    );

  await cook(cauldron, cookData, 0);
};

export default cookRepay;
