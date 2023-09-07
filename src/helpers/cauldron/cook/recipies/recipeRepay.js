import {
  bentoDepositEncodeHandler,
  repayEncodeHandler,
} from "@/helpers/cauldron/cook/degenBoxHelper/actionHandlers.js";
import { actions } from "@/helpers/cauldron/cook/actions";

const recipeRepay = async (cookData, cauldronObject, itsMax, part, to) => {
  const { userBorrowPart } = cauldronObject.userPosition.borrowInfo;
  const mim = cauldronObject.config.mimInfo.address;

  if (!itsMax) {
    cookData = await bentoDepositEncodeHandler(
      cookData,
      cauldronObject,
      mim,
      to,
      part,
      "0",
      "0",
      false,
      false,
      2
    );
    cookData = await actions.getRepayPart(cookData, "-2");
    cookData = await repayEncodeHandler(
      cookData,
      cauldronObject,
      "-1",
      to,
      false,
      true,
      false,
      0
    );

    return cookData;
  }

  cookData = await actions.getRepayShare(cookData, userBorrowPart);
  cookData = await bentoDepositEncodeHandler(
    cookData,
    cauldronObject,
    mim,
    to,
    "0",
    "-1",
    "0",
    true,
    false,
    0
  );
  cookData = await repayEncodeHandler(
    cookData,
    cauldronObject,
    userBorrowPart,
    to
  );

  return cookData;
};


export default recipeRepay;