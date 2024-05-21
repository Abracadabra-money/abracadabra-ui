import { actions } from "@/helpers/cauldron/cook/actions";
import { bentoWithdrawEncodeHandler } from "@/helpers/cauldron/cook/degenBoxHelper/actionHandlers.js";

const recipeRemoveCollateral = async (
  cookData: any,
  cauldronObject: any,
  share: any,
  userAddr: string,
  tokenAddr: string,
  withdrawUnwrapToken: boolean = false
): Promise<any> => {
  const wrapInfo = cauldronObject.config?.wrapInfo;
  const { wrapper, unwrappedToken, collateral } = cauldronObject.contracts;
  if (wrapInfo && withdrawUnwrapToken) {
    cookData = await actions.removeCollateral(cookData, share, userAddr);

    cookData = await bentoWithdrawEncodeHandler(
      cookData,
      cauldronObject,
      collateral.address,
      wrapper.address,
      "0",
      share,
      false,
      false,
      1
    );

    // 30 unwrap and deposit for alice in degenbox
    const swapStaticTx = await wrapper.populateTransaction.unwrap(
      userAddr,
      share
    );

    const data = swapStaticTx.data.substring(0, 74);

    cookData = await actions.call(
      cookData,
      wrapper.address,
      data,
      true,
      false,
      2
    );

    cookData = await bentoWithdrawEncodeHandler(
      cookData,
      cauldronObject,
      unwrappedToken.address,
      userAddr,
      "0",
      "-2",
      false,
      true
    );
  } else {
    cookData = await actions.removeCollateral(cookData, share, userAddr);

    cookData = await bentoWithdrawEncodeHandler(
      cookData,
      cauldronObject,
      tokenAddr,
      userAddr,
      "0x00",
      share
    );
  }

  return cookData;
};

export default recipeRemoveCollateral;
