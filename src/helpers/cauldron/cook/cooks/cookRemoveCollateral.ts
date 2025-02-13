import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";
import recipeUpdatePythOracle from "@/helpers/cauldron/cook/recipies/recipeUpdatePythOracle";

import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";

import type { CookData, PayloadRemoveCollateral } from "./types";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const cookRemoveCollateral = async (
  { collateralShare, to, withdrawUnwrapToken }: PayloadRemoveCollateral,
  cauldronObject: CauldronInfo
): Promise<void> => {
  //@ts-ignore
  const { cauldron } = cauldronObject.contracts;
  const tokenAddr = cauldronObject.config.collateralInfo.address;
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

  let value = 0n;
  if (cauldronObject.config.cauldronSettings.oracleInfo?.kind === "PYTH") {
    let updateValue: bigint;
    ({ cookData, value: updateValue } = await recipeUpdatePythOracle(cookData, cauldronObject));
    value += updateValue;
  }

  if (updatePrice) cookData = await actions.updateExchangeRate(cookData, true);

  cookData = await recipeRemoveCollateral(
    cookData,
    cauldronObject,
    collateralShare,
    to,
    tokenAddr,
    withdrawUnwrapToken
  );

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

export default cookRemoveCollateral;
