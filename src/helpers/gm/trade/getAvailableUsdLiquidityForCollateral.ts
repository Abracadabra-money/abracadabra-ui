import { getPoolUsdWithoutPnl, getReservedUsd } from "../utils";
import { PRECISION } from "@/constants/gm";
import type { SwapMarketInfo } from "../types";
import { BigNumber } from "ethers";

export const getAvailableUsdLiquidityForCollateral = (marketInfo: SwapMarketInfo, isLong: boolean): BigNumber => {
    const poolUsd = getPoolUsdWithoutPnl(marketInfo, isLong, "minPrice");

  
    const reservedUsd = getReservedUsd(marketInfo, isLong);
    const maxReserveFactor = isLong ? marketInfo.reserveFactorLong : marketInfo.reserveFactorShort;
  
    if (maxReserveFactor.eq(0)) {
      return BigNumber.from(0);
    }
  
    const minPoolUsd = reservedUsd.mul(PRECISION).div(maxReserveFactor);
  
    const liqudiity = poolUsd.sub(minPoolUsd);
  
    return liqudiity;
  }