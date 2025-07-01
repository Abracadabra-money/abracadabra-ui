import { BigNumber } from "ethers";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { CauldronListItem } from "@/helpers/cauldron/lists/getMarketList";

export const getMaxLeverageMultiplierPayload = (
  cauldron: CauldronInfo | CauldronListItem,
  ignoreUserPosition: boolean = true,
  depositAmount: BigNumber = BigNumber.from(0),
  slippage: BigNumber = BigNumber.from(0)
) => {
  return {
    oracleExchangeRate: cauldron.mainParams.oracleExchangeRate,
    mcr: cauldron.config.mcr,
    collateralDecimals: cauldron.config.collateralInfo.decimals,
    userBorrowAmount:
      cauldron.userPosition.borrowInfo.userBorrowAmount.toBigInt(),
    userCollateralAmount:
      cauldron.userPosition.collateralInfo.userCollateralAmount.toBigInt(),
    ignoreUserPosition,
    depositAmount: depositAmount.toBigInt(),
    slippage: slippage.toBigInt(),
  };
};
