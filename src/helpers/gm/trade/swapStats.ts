import { convertToTokenAmount, convertToUsd } from "../utils";
import { getPriceImpactForSwap, applySwapImpactWithCap } from "./priceImpact";
import { getSwapFee } from "./getSwapFee";
import { getAvailableUsdLiquidityForCollateral } from "./getAvailableUsdLiquidityForCollateral";
import { BigNumber } from "ethers";
import type { SwapMarketInfo } from "../types";
import type { Address } from "viem";

export const getSwapStats = (
  marketInfo: SwapMarketInfo,
  tokenInAddress: Address,
  tokenOutAddress: Address,
  usdIn: BigNumber,
  shouldApplyPriceImpact: boolean
) => {
  const tokenIn = tokenInAddress;
  const tokenOut = tokenOutAddress;

  const priceIn = marketInfo.prices.longTokenPrice.min;
  const priceOut = marketInfo.prices.shortTokenPrice.max;
  const longTokenDecimals = marketInfo.longTokenDecimals;
  const shortTokenDecimals = marketInfo.shortTokenDecimals;

  const amountIn = convertToTokenAmount(usdIn, longTokenDecimals, priceIn);

  const priceImpactDeltaUsd = getPriceImpactForSwap(
    marketInfo,
    tokenIn,
    tokenOut,
    usdIn,
    usdIn.mul(-1)
  );

  const swapFeeAmount = getSwapFee(
    marketInfo,
    amountIn,
    priceImpactDeltaUsd.gt(0)
  );
  const swapFeeUsd = getSwapFee(marketInfo, usdIn, priceImpactDeltaUsd.gt(0));

  const amountInAfterFees = amountIn.sub(swapFeeAmount);
  const usdInAfterFees = usdIn.sub(swapFeeUsd);

  let usdOut = usdInAfterFees;
  let amountOut = convertToTokenAmount(usdOut, shortTokenDecimals, priceOut);

  let cappedImpactDeltaUsd;

  if (priceImpactDeltaUsd.gt(0)) {
    const positiveImpactAmount = applySwapImpactWithCap(
      marketInfo,
      {
        type: "short",
        prices: marketInfo.prices.shortTokenPrice,
        decimals: shortTokenDecimals,
      },
      priceImpactDeltaUsd
    );
    cappedImpactDeltaUsd = convertToUsd(
      positiveImpactAmount,
      shortTokenDecimals,
      priceOut
    );
  } else {
    const negativeImpactAmount = applySwapImpactWithCap(
      marketInfo,
      {
        type: "long",
        prices: marketInfo.prices.longTokenPrice,
        decimals: longTokenDecimals,
      },
      priceImpactDeltaUsd
    );
    cappedImpactDeltaUsd = convertToUsd(
      negativeImpactAmount,
      longTokenDecimals,
      priceIn
    );
  }

  if (shouldApplyPriceImpact) {
    usdOut = usdOut.add(cappedImpactDeltaUsd);
  }

  if (usdOut.lt(0)) {
    usdOut = BigNumber.from(0);
  }

  amountOut = convertToTokenAmount(usdOut, shortTokenDecimals, priceOut);

  const isLong = false; // use short token
  const liquidity = getAvailableUsdLiquidityForCollateral(marketInfo, isLong);

  const isOutLiquidity = liquidity.lt(usdOut);

  return {
    swapFeeUsd,
    swapFeeAmount,
    marketAddress: marketInfo.marketTokenAddress,
    tokenInAddress,
    tokenOutAddress,
    priceImpactDeltaUsd: cappedImpactDeltaUsd,
    amountIn,
    amountInAfterFees,
    usdIn,
    amountOut,
    usdOut,
    isOutLiquidity,
  };
};

export function getSwapPathStats(
  marketInfo: SwapMarketInfo,
  swapPath: Array<Address>,
  tokenInAddress: Address,
  tokenOutAddress: Address,
  usdIn: BigNumber,
  shouldApplyPriceImpact: boolean
) {
  if (swapPath.length === 0) {
    return undefined;
  }

  const swapSteps = [];

  let usdOut = usdIn;

  let totalSwapPriceImpactDeltaUsd = BigNumber.from(0);
  let totalSwapFeeUsd = BigNumber.from(0);

  for (let i = 0; i < swapPath.length; i++) {
    const swapStep = getSwapStats(
      marketInfo,
      tokenInAddress,
      tokenOutAddress,
      usdOut,
      shouldApplyPriceImpact
    );

    tokenInAddress = swapStep.tokenOutAddress;
    usdOut = swapStep.usdOut;

    totalSwapPriceImpactDeltaUsd = totalSwapPriceImpactDeltaUsd.add(
      swapStep.priceImpactDeltaUsd
    );
    totalSwapFeeUsd = totalSwapFeeUsd.add(swapStep.swapFeeUsd);

    swapSteps.push(swapStep);
  }

  const lastStep = swapSteps[swapSteps.length - 1];
  const targetMarketAddress = lastStep.marketAddress;
  const amountOut = lastStep.amountOut;

  const totalFeesDeltaUsd = BigNumber.from(0)
    .sub(totalSwapFeeUsd)
    .add(totalSwapPriceImpactDeltaUsd);

  return {
    swapPath,
    tokenInAddress,
    tokenOutAddress,
    targetMarketAddress,
    swapSteps,
    usdOut,
    amountOut,
    totalSwapFeeUsd,
    totalSwapPriceImpactDeltaUsd,
    totalFeesDeltaUsd,
  };
}
