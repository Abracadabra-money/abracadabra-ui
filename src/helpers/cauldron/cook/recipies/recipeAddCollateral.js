import {
  bentoDepositEncodeHandler,
  bentoWithdrawEncodeHandler,
} from "@/mixins/borrow/cook/degenBoxHelper/actionHandlers";
import { actions } from "@/helpers/cauldron/cook/actions";

const recipeAddCollatral = async (
  cookData,
  cauldronObject,
  token,
  isWrap,
  to,
  amount,
  collateralValue
) => {
  const { unwrappedToken, wrapper, cauldron } = cauldronObject.contracts;

  if (isWrap) {
    cookData = await bentoDepositEncodeHandler(
      cookData,
      cauldronObject,
      unwrappedToken.address,
      to,
      amount,
      "0",
      collateralValue,
      false,
      false,
      2
    );

    cookData = await bentoWithdrawEncodeHandler(
      cookData,
      cauldronObject,
      unwrappedToken.address,
      wrapper.address,
      "0",
      "-2",
      false,
      true,
      1
    );

    const swapStaticTx = await wrapper.populateTransaction.wrap(
      cauldron.address,
      amount
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
  } else {
    cookData = await bentoDepositEncodeHandler(
      cookData,
      cauldronObject,
      token,
      cauldron.address,
      amount,
      "0",
      collateralValue,
      false,
      false,
      2
    );
  }

  cookData = await actions.addCollateral(cookData, "-2", to, true);

  return cookData;
};

export default recipeAddCollatral;
