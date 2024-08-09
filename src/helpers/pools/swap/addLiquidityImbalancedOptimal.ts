import {
  previewAddLiquidity,
  previewAddLiquidityImbalanced,
} from "@/helpers/pools/swap/liquidity";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";

export const addLiquidityImbalancedOptimal = async (
  lpInfo: MagicLPInfo,
  baseInAmount: bigint,
  quoteInAmount: bigint,
  //default 100n == 1%
  stepInBips: bigint = 100n
) => {
  if (baseInAmount == 0n && quoteInAmount == 0n)
    return { inAmountToSwap: 0n, shares: 0n };

  const previewAddLiquidityResult = previewAddLiquidity(
    baseInAmount,
    quoteInAmount,
    lpInfo
  );

  const remainingBaseAmount =
    baseInAmount - previewAddLiquidityResult.baseAdjustedInAmount;
  const remainingQuoteAmount =
    quoteInAmount - previewAddLiquidityResult.quoteAdjustedInAmount;
  const remainingAmountToSwapIsBase = remainingBaseAmount > 0n;
  const remainingAmountToSwap = remainingAmountToSwapIsBase
    ? remainingBaseAmount
    : remainingQuoteAmount;

  let left = 0n;
  let right = remainingAmountToSwap;
  let bestShares = 0n;
  let bestAmountSwapIn = 0n;
  const amountInStep = (remainingAmountToSwap * stepInBips) / 10_000n;
  let direction: "left" | "right" = "right";
  let baseRefundAmount = 0n;
  let quoteRefundAmount = 0n;
  let swapOutAmount = 0n;
  let swapFeeAmount = 0n;

  while (left <= right) {
    const amountSwapIn = left + (right - left) / 2n;

    const previewData = previewAddLiquidityImbalanced(
      lpInfo,
      baseInAmount,
      quoteInAmount,
      remainingAmountToSwapIsBase,
      amountSwapIn
    );

    if (previewData.shares > bestShares) {
      bestShares = previewData.shares;
      bestAmountSwapIn = amountSwapIn;
    } else if (direction === "left") {
      left = amountSwapIn + 1n;
    } else {
      right = amountSwapIn - 1n;
    }

    // Explore left and right sides
    const leftSwapIn = bestAmountSwapIn - amountInStep;
    const rightSwapIn = bestAmountSwapIn + amountInStep;

    const previewLeftData = previewAddLiquidityImbalanced(
      lpInfo,
      baseInAmount,
      quoteInAmount,
      remainingAmountToSwapIsBase,
      leftSwapIn
    );

    const leftShares = leftSwapIn >= left ? previewLeftData.shares : 0n;

    const previewRightData = previewAddLiquidityImbalanced(
      lpInfo,
      baseInAmount,
      quoteInAmount,
      remainingAmountToSwapIsBase,
      rightSwapIn
    );

    const rightShares = rightSwapIn <= right ? previewRightData.shares : 0n;

    // doesn't lead to better results, consider the search done
    if (leftShares <= bestShares && rightShares <= bestShares) {
      break;
    }

    // explore left side
    if (leftShares > rightShares) {
      bestShares = leftShares;
      bestAmountSwapIn = leftSwapIn;
      right = bestAmountSwapIn - 1n;
      direction = "left";
      baseRefundAmount = previewLeftData.baseRefundAmount;
      quoteRefundAmount = previewLeftData.quoteRefundAmount;
      swapOutAmount = previewLeftData.swapOutAmount;
      swapFeeAmount = previewLeftData.swapFeeAmount;
    }

    // explore right side
    else {
      bestShares = rightShares;
      bestAmountSwapIn = rightSwapIn;
      left = bestAmountSwapIn + 1n;
      direction = "right";
      baseRefundAmount = previewRightData.baseRefundAmount;
      quoteRefundAmount = previewRightData.quoteRefundAmount;
      swapOutAmount = previewRightData.swapOutAmount;
      swapFeeAmount = previewRightData.swapFeeAmount;
    }
  }

  return {
    remainingAmountToSwapIsBase,
    remainingAmountToSwap: bestAmountSwapIn,
    shares: bestShares,
    swapOutAmount,
    swapFeeAmount,
    baseRefundAmount,
    quoteRefundAmount,
  };
};
