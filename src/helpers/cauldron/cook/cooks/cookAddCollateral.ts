import { actions } from "@/helpers/cauldron/cook/actions";
import sendCook from "@/helpers/cauldron/cook/sendCook";
import checkAndSetMcApprove from "@/helpers/cauldron/cook/checkAndSetMcApprove";
import recipeAddCollatral from "@/helpers/cauldron/cook/recipies/recipeAddCollateral";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

const defaultTokenAddress = "0x0000000000000000000000000000000000000000";

const cookAddCollateral = async (
  { amount, useNativeToken }: any,
  cauldronObject: any,
  notificationId: number,
  useWrapper: boolean = false,
  to: string
): Promise<void> => {
  const { address } = cauldronObject.config.collateralInfo;
  const { cauldron } = cauldronObject.contracts;
  const { isMasterContractApproved } = cauldronObject.additionalInfo;
  const { updatePrice } = cauldronObject.mainParams;
  const { useDegenBoxHelper } = cauldronObject.config.cauldronSettings;

  const token = useNativeToken ? defaultTokenAddress : address;
  const value = useNativeToken ? amount.toString() : 0;

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

  await sendCook(cauldron, cookData, value, notificationId);
};

export default cookAddCollateral;
