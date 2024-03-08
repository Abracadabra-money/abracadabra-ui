import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SwapTokensForTokensPayload = {
  to: Address;
  amountIn: bigint;
  path: Address[];
  directions: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const swapTokensForTokens = async (
  swapRouterAddress: Address,
  payload: SwapTokensForTokensPayload
) => {
  const { to, amountIn, path, directions, minimumOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "swapTokensForTokens",
    args: [to, amountIn, path, directions, minimumOut, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
