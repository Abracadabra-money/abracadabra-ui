// @ts-nocheck
import store from "@/store";
import { getOrderTokensInfo } from "@/helpers/gm/orders";
import { actions } from "@/helpers/cauldron/cook/actions";
import { USDC_ADDRESS, WETH_ADDRESS, WBTC_ADDRESS } from "@/constants/gm";
import { recipeDeleverage } from "@/helpers/cauldron/cook/recipies/gm/recipeDeleverage";
import { repayEncodeHandler } from "@/helpers/cauldron/cook/degenBoxHelper/actionHandlers.js";
import recipeRemoveCollateral from "@/helpers/cauldron/cook/recipies/recipeRemoveCollateral";
import { cook, cookViem } from "@/helpers/cauldron/cauldron";

import type { CookData, PayloadDeleverageFromOrderGm } from "../types";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const cookDeleverageFromOrder = async (
  {
    repayAmount,
    removeCollateralShare,
    itsMax,
    slipage,
    to,
    order,
  }: PayloadDeleverageFromOrderGm,
  cauldronObject: CauldronInfo
): Promise<void> => {
  const { liquidationSwapper, cauldron, bentoBox } = cauldronObject.contracts;
  const collateralAddress = cauldronObject.config.collateralInfo.address;

  const provider = store.getters.getProvider;

  const orderTokensInfo = await getOrderTokensInfo(order, provider);
  const shortToken = cauldronObject.additionalInfo.gmInfo.marketInfo.shortToken;

  const activeToken = orderTokensInfo.find(
    (token) => token.address.toLowerCase() === shortToken.toLowerCase()
  );

  let sellToken = shortToken;

  let cookData: CookData = {
    events: [],
    values: [],
    datas: [],
  };

  cookData = actions.withdrawFromOrder(
    cookData,
    activeToken!.address,
    liquidationSwapper.address,
    activeToken!.balance,
    true
  );

  const shareFrom = await bentoBox.toShare(
    activeToken!.address,
    activeToken!.balance,
    false
  );

  const deleverageData = await recipeDeleverage(
    cookData,
    cauldronObject,
    shareFrom,
    repayAmount,
    slipage
  );

  cookData = deleverageData.cookData;

  const { userBorrowPart, userBorrowAmount } =
    cauldronObject.userPosition.borrowInfo;

  if (itsMax || deleverageData.buyAmount.gt(BigNumber.from(userBorrowAmount))) {
    cookData = await repayEncodeHandler(
      cookData,
      cauldronObject,
      BigNumber.from(userBorrowPart),
      to
    );
  } else {
    cookData = await actions.getRepayPart(cookData, "-2");
    cookData = await repayEncodeHandler(
      cookData,
      cauldronObject,
      "-1",
      to,
      false,
      true
    );
  }

  if (+removeCollateralShare > 0) {
    cookData = await recipeRemoveCollateral(
      cookData,
      cauldronObject,
      removeCollateralShare,
      to,
      collateralAddress
    );
  }

  await cookViem(cauldronObject, cookData, 0);
};

export default cookDeleverageFromOrder;
