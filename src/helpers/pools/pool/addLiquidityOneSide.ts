import { type Address, formatUnits, maxUint256, parseAbi } from "viem";
import { simulateContract } from "viem/actions";
import store from "@/store";

//be awared. it could be old router address and abi and has no necessary methods
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { getSwapRouterByChain } from "@/configs/pools/routers";
//

const BLAST_ID = 81457;

const account = "0xfB3485c2e209A5cfBDC1447674256578f1A80eE3";
const router = "0x94Ea0183A3268635E34332A76DD2e9Eff13A00f4";
const lp = "0x163B234120aaE59b46b228d8D88f5Bc02e9baeEa";

const abi = parseAbi([
  "struct AddLiquidityImbalancedParams { address lp; address to; uint256 baseInAmount; uint256 quoteInAmount; bool remainingAmountToSwapIsBase; uint256 remainingAmountToSwap; uint256 minimumShares; uint256 deadline; }",
  "function addLiquidity(address lp, address to, uint256 baseInAmount, uint256 quoteInAmount, uint256 minimumShares, uint256 deadline) returns (uint256 baseAdjustedInAmount, uint256 quoteAdjustedInAmount, uint256 shares)",
  "function addLiquidityOneSide(address lp, address to, bool inAmountIsBase, uint256 inAmount, uint256 inAmountToSwap, uint256 minimumShares, uint256 deadline) returns (uint256 baseAmount, uint256 quoteAmount, uint256 shares)",
  "function addLiquidityImbalanced(AddLiquidityImbalancedParams params) returns (uint256 baseAdjustedInAmount, uint256 quoteAdjustedInAmount, uint256 shares)",
]);

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

  //use when old router address will be replace in routers.ts
  //   const routerAddress = getSwapRouterByChain(chainId);

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

  console.log(
    `Best amountSwapIn: ${bestAmountSwapIn}, Best Shares: ${formatUnits(
      bestShares,
      18
    )}`
  );

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
  try {
    const { result } = await simulateContract(client, {
      account,
      address: router,
      abi,
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
    console.log("simulateAddLiquidityOneSide error", error);

    return 0n;
  }
};
