import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";

const cookRemoveCollateral = async (
  { collateralShare, to }: any,
  cauldronObject: any
): Promise<void> => {
  const { cauldron } = cauldronObject.contracts;
  const tokenAddr = cauldronObject.config.collateralInfo.address;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
  const { updatePrice } = cauldronObject.mainParams;
  const { useDegenBoxHelper } = cauldronObject.config.cauldronSettings;

  let cookData = {
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

  cookData = await recipeRemoveCollateral(
    cookData,
    cauldronObject,
    collateralShare,
    to,
    tokenAddr
  );

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

export default cookRemoveCollateral;