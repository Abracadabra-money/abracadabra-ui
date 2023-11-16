
import { convertToUsd } from "../utils";
import { BigNumber } from "ethers";
import { getSwapPathStats } from "./swapStats";

export function getSwapAmountsByFromValue({
    marketInfo,
    market,
    tokenIn,
    tokenOut,
    amountIn,
  }) {
  
    const priceIn = marketInfo.prices.longTokenPrice.min;
    const priceOut = marketInfo.prices.shortTokenPrice.max;
  
    const usdIn = convertToUsd(amountIn, marketInfo.longTokenDecimals, priceIn);
  
    let amountOut = BigNumber.from(0);
    let usdOut = BigNumber.from(0);
    let minOutputAmount = BigNumber.from(0);
  
    const defaultAmounts = {
      amountIn,
      usdIn,
      amountOut,
      usdOut,
      minOutputAmount,
      priceIn,
      priceOut,
      swapPathStats: undefined,
    };
  
    if (amountIn.lte(0)) {
      return defaultAmounts;
    }
  
    const swapPathStats = getSwapPathStats({
        marketInfo,
        swapPath: [market],
        tokenInAddress: tokenIn,
        tokenOutAddress: tokenOut,
        usdIn,
        shouldApplyPriceImpact: true
    });
  
    if (!swapPathStats) {
      return defaultAmounts;
    }

    usdOut = swapPathStats.usdOut;
    amountOut = swapPathStats.amountOut;
    minOutputAmount = amountOut;
  
    if (amountOut.lt(0)) {
      amountOut = BigNumber.from(0);
      usdOut = BigNumber.from(0);
      minOutputAmount = BigNumber.from(0);
    }
  
    return {
      amountIn,
      usdIn,
      amountOut,
      usdOut,
      priceIn,
      priceOut,
      minOutputAmount,
      swapPathStats,
    };
  }