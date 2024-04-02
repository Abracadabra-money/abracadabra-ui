import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SellQuoteTokensForETHPayload = {
  lp: Address;
  to: Address;
  amountIn: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellQuoteTokensForETH = async (
  swapRouterAddress: Address,
  payload: SellQuoteTokensForETHPayload
) => {
  const { lp, to, amountIn, minimumOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellQuoteTokensForETH",
    args: [lp, to, amountIn, minimumOut, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
