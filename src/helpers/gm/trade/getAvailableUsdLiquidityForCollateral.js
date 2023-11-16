import { getPoolUsdWithoutPnl, getReservedUsd } from "../utils";
import { PRECISION } from "@/constants/gm";

export const getAvailableUsdLiquidityForCollateral = (marketInfo, isLong) => {
    const poolUsd = getPoolUsdWithoutPnl(marketInfo, isLong, "minPrice");
  
    if (marketInfo.isSpotOnly) {
      return poolUsd;
    }
  
    const reservedUsd = getReservedUsd(marketInfo, isLong);
    const maxReserveFactor = isLong ? marketInfo.reserveFactorLong : marketInfo.reserveFactorShort;
  
    if (maxReserveFactor.eq(0)) {
      return BigNumber.from(0);
    }
  
    const minPoolUsd = reservedUsd.mul(PRECISION).div(maxReserveFactor);
  
    const liqudiity = poolUsd.sub(minPoolUsd);
  
    return liqudiity;
  }