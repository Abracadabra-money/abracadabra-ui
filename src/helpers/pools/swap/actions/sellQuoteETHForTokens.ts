import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SellQuoteETHForTokensPayload = {
  payableAmount: bigint;
  lp: Address;
  to: Address;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellQuoteETHForTokens = async (
  swapRouterAddress: Address,
  payload: SellQuoteETHForTokensPayload
) => {
  const { payableAmount, lp, to, minimumOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellQuoteETHForTokens",
    args: [lp, to, minimumOut, deadline],
    value: payableAmount,
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
