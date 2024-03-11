import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SellBaseTokensForTokensPayload = {
  lp: Address;
  to: Address;
  amountIn: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellBaseTokensForTokens = async (
  swapRouterAddress: Address,
  payload: SellBaseTokensForTokensPayload
) => {
  const { lp, to, amountIn, minimumOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellBaseTokensForTokens",
    args: [lp, to, amountIn, minimumOut, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
