import { actions } from "@/helpers/cauldron/cook/actions";
import { bentoWithdrawEncodeHandler } from "@/helpers/cauldron/cook/degenBoxHelper/actionHandlers.js";

const recipeBorrow = async (
  cookData: any,
  cauldronObject: any,
  part: any,
  to: string,
  mim: string
): Promise<any> => {
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
