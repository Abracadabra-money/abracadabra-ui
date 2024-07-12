import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const defaultTokenAddress = "0x0000000000000000000000000000000000000000";

import type { CookData, PayloadAddCollateral } from "./types";

const cookAddCollateral = async (
  { amount, useNativeToken, useWrapper, to }: PayloadAddCollateral,
  cauldronObject: CauldronInfo
): Promise<void> => {
  const { address } = cauldronObject.config.collateralInfo;
  //@ts-ignore
  const { cauldron } = cauldronObject.contracts;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
  const { updatePrice } = cauldronObject.mainParams;
  const { useDegenBoxHelper } = cauldronObject.config.cauldronSettings;

  const token = useNativeToken ? defaultTokenAddress : address;
  const value = useNativeToken ? amount.toString() : 0;

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

  cookData = await recipeAddCollatral(
    cookData,
    cauldronObject,
    token,
    useWrapper,
    to,
    amount,
    value
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

export default cookAddCollateral;
