import { actions } from "@/helpers/cauldron/cook/actions";
import { bentoWithdrawEncodeHandler } from "@/mixins/borrow/cook/degenBoxHelper/actionHandlers";

const recipeBorrow = async (cookData, cauldronObject, part, to, mim) => {
  cookData = await actions.borrow(cookData, part, to);
  cookData = await bentoWithdrawEncodeHandler(
    cookData,
    cauldronObject,
    mim,
    to,
    "0",
    "-0x02",
    false,
    true
  );
  return cookData;
};

export default recipeBorrow;
