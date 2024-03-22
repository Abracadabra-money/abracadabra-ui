import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SwapTokensForETHPayload = {
  payableAmount: bigint;
  to: Address;
  amountIn: bigint;
  path: Address[];
  directions: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const swapTokensForETH = async (
  swapRouterAddress: Address,
  payload: SwapTokensForETHPayload
) => {
  const {
    payableAmount,
    to,
    amountIn,
    path,
    directions,
    minimumOut,
    deadline,
  } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "swapTokensForETH",
    args: [to, amountIn, path, directions, minimumOut, deadline],
    value: payableAmount,
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
