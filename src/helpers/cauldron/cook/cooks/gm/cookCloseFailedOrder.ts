import { cookViem } from "@/helpers/cauldron/cauldron";
import { actions } from "@/helpers/cauldron/cook/actions";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { CookData } from "@/helpers/cauldron/cook/cooks/types";

const AVAILABLE_SKIM = "0xd1a840df";
const SKIM_HELPER_CONTRACT_ADDRESS =
  "0x7BE10723Acd0FC9A9d74E1b2d0A85AC136e00C66";

export const cookCloseFailedOrder = async (
  order: string,
  account: string,
  cauldronObject: CauldronInfo
) => {
  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  const { collateral } = cauldronObject.contracts;
  const orderBalance = await collateral.balanceOf(order);

  cookData = await actions.withdrawFromOrder(
    cookData,
    cauldronObject.config.collateralInfo.address,
    cauldronObject.config.contract.address,
    orderBalance,
    true
  );

  cookData = await actions.call(
    cookData,
    SKIM_HELPER_CONTRACT_ADDRESS,
    AVAILABLE_SKIM, // availableSkim()(uint256 share)
    false,
    false,
    1
  );

  cookData = await actions.addCollateral(cookData, -1, account, true);

  await cookViem(cauldronObject, cookData, 0);
};
