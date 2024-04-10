import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { previewAddLiquiditySingleSide } from "@/helpers/pools/swap/liquidity";

export const addLiquidityOneSideOptimal = async (
  lpInfo: MagicLPInfo,
  amountIn: bigint,
  amountInIsBase: boolean,
  //default 100n == 1%
  stepInBips: bigint = 100n
) => {
  if (amountIn == 0n) return { inAmountToSwap: 0n, shares: 0n };

  let left = 0n;
  let right = amountIn;
  let bestShares = 0n;
  let bestAmountSwapIn = 0n;
  const amountInStep = (amountIn * stepInBips) / 10_000n;
  let direction: "left" | "right" = "right";

  while (left <= right) {
    const amountSwapIn = left + (right - left) / 2n;

    const shares = (
      await previewAddLiquiditySingleSide(
        lpInfo,
        amountIn,
        amountSwapIn,
        amountInIsBase
      )
    ).shares;

    if (shares > bestShares) {
      bestShares = shares;
      bestAmountSwapIn = amountSwapIn;
    } else if (direction === "left") {
      left = amountSwapIn + 1n;
    } else {
      right = amountSwapIn - 1n;
    }

    // Explore left and right sides
    const leftSwapIn = bestAmountSwapIn - amountInStep;
    const rightSwapIn = bestAmountSwapIn + amountInStep;

    const leftShares =
      leftSwapIn >= left
        ? (
            await previewAddLiquiditySingleSide(
              lpInfo,
              amountIn,
              leftSwapIn,
              amountInIsBase
            )
          ).shares
        : 0n;

    const rightShares =
      rightSwapIn <= right
        ? (
            await previewAddLiquiditySingleSide(
              lpInfo,
              amountIn,
              rightSwapIn,
              amountInIsBase
            )
          ).shares
        : 0n;

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
    }

    // explore right side
    else {
      bestShares = rightShares;
      bestAmountSwapIn = rightSwapIn;
      left = bestAmountSwapIn + 1n;
      direction = "right";
    }
  }

  return { inAmountToSwap: bestAmountSwapIn, shares: bestShares };
};
