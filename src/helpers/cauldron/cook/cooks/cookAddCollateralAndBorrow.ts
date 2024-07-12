import { actions } from "@/helpers/cauldron/cook/actions";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

const defaultTokenAddress = "0x0000000000000000000000000000000000000000";

import type { CookData, PayloadAddCollateralAndBorrow } from "./types";

import recipeBorrow from "@/helpers/cauldron/cook/recipies/recipeBorrow";
import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const cookAddCollateralAndBorrow = async (
  {
    collateralAmount,
    mimAmount,
    useNativeToken,
    useWrapper,
    to,
  }: PayloadAddCollateralAndBorrow,
  cauldronObject: CauldronInfo
): Promise<void> => {
  const { address } = cauldronObject.config.collateralInfo;
  const { address: mimAddress } = cauldronObject.config.mimInfo;
  //@ts-ignore
  const { cauldron } = cauldronObject.contracts;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
  const { updatePrice } = cauldronObject.mainParams;
  const { useDegenBoxHelper } = cauldronObject.config.cauldronSettings;

  const tokenAddr = useNativeToken ? defaultTokenAddress : address;
  const value = useNativeToken ? collateralAmount.toString() : 0;

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

  cookData = await recipeBorrow(
    cookData,
    cauldronObject,
    mimAmount,
    to,
    mimAddress
  );

  cookData = await recipeAddCollatral(
    cookData,
    cauldronObject,
    tokenAddr,
    useWrapper,
    to,
    collateralAmount,
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

export default cookAddCollateralAndBorrow;
