import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { type Address, parseAbi } from "viem";

const router = "0x94Ea0183A3268635E34332A76DD2e9Eff13A00f4";

const abi = parseAbi([
  "struct AddLiquidityImbalancedParams { address lp; address to; uint256 baseInAmount; uint256 quoteInAmount; bool remainingAmountToSwapIsBase; uint256 remainingAmountToSwap; uint256 minimumShares; uint256 deadline; }",
  "function addLiquidity(address lp, address to, uint256 baseInAmount, uint256 quoteInAmount, uint256 minimumShares, uint256 deadline) returns (uint256 baseAdjustedInAmount, uint256 quoteAdjustedInAmount, uint256 shares)",
  "function addLiquidityOneSide(address lp, address to, bool inAmountIsBase, uint256 inAmount, uint256 inAmountToSwap, uint256 minimumShares, uint256 deadline) returns (uint256 baseAmount, uint256 quoteAmount, uint256 shares)",
  "function addLiquidityImbalanced(AddLiquidityImbalancedParams params) returns (uint256 baseAdjustedInAmount, uint256 quoteAdjustedInAmount, uint256 shares)",
]);

export type AddLiquidityPayload = {
  lp: Address;
  to: Address;
  inAmountIsBase: boolean;
  inAmount: bigint;
  inAmountToSwap: bigint;
  minimumShares: bigint;
  deadline: bigint;
};

export const addLiquidityOneSide = async (
  swapRouterAddress: Address,
  payload: AddLiquidityPayload
) => {
  const {
    lp,
    to,
    inAmountIsBase,
    inAmount,
    inAmountToSwap,
    minimumShares,
    deadline,
  } = payload;

  const config = await prepareWriteContract({
    address: router,
    abi: abi,
    functionName: "addLiquidityOneSide",
    args: [
      lp,
      to,
      inAmountIsBase,
      inAmount,
      inAmountToSwap,
      minimumShares,
      deadline,
    ],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
