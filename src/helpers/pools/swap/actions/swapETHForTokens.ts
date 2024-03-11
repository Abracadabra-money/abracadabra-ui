import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SwapETHForTokensPayload = {
  payableAmount: bigint;
  to: Address;
  path: Address[];
  directions: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const swapETHForTokens = async (
  swapRouterAddress: Address,
  payload: SwapETHForTokensPayload
) => {
  const { payableAmount, to, path, directions, minimumOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "swapETHForTokens",
    args: [to, path, directions, minimumOut, deadline],
    value: payableAmount,
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
