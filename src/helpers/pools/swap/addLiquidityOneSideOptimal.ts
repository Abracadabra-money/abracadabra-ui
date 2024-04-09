import { type Address, formatUnits, maxUint256, parseAbi } from "viem";
import { simulateContract } from "viem/actions";
import store from "@/store";

import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { getSwapRouterByChain } from "@/configs/pools/routers";

export const addLiquidityOneSideOptimal = async (
  account: Address,
  chainId: number = 81457,
  lp: Address,
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
    const shares = await simulateAddLiquidityOneSide(
      account,
      chainId,
      lp,
      amountIn,
      amountInIsBase,
      amountSwapIn
    );

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
        ? await simulateAddLiquidityOneSide(
            account,
            chainId,
            lp,
            amountIn,
            amountInIsBase,
            leftSwapIn
          )
        : 0n;
    const rightShares =
      rightSwapIn <= right
        ? await simulateAddLiquidityOneSide(
            account,
            chainId,
            lp,
            amountIn,
            amountInIsBase,
            rightSwapIn
          )
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

    //console.log(`amountSwapIn = ${bestAmountSwapIn}, Shares = ${formatUnits(shares, 18)}`);
  }

  // console.log(
  //   `Best amountSwapIn: ${bestAmountSwapIn}, Best Shares: ${formatUnits(
  //     bestShares,
  //     18
  //   )}`
  // );

  return { inAmountToSwap: bestAmountSwapIn, shares: bestShares };
};

const simulateAddLiquidityOneSide = async (
  account: Address,
  chainId: number,
  lp: Address,
  amountIn: bigint,
  amountInIsBase: boolean,
  amountSwapIn: bigint
): Promise<bigint> => {
  const client = store.getters.getChainById(chainId).publicClient;
  const router = getSwapRouterByChain(chainId);

  try {
    const { result } = await simulateContract(client, {
      account,
      address: router,
      abi: BlastMIMSwapRouterAbi,
      functionName: "addLiquidityOneSide",
      args: [
        lp,
        account,
        amountInIsBase,
        amountIn,
        amountSwapIn,
        0n,
        maxUint256,
      ],
    });
    return result[2];
  } catch (error) {
    // console.log("simulateAddLiquidityOneSide error", error);

    return 0n;
  }
};
