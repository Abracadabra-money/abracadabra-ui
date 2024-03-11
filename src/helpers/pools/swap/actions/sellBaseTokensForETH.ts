import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SellBaseTokensForETHPayload = {
  lp: Address;
  to: Address;
  amountIn: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellBaseTokensForETH = async (
  swapRouterAddress: Address,
  payload: SellBaseTokensForETHPayload
) => {
  const { lp, to, amountIn, minimumOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellBaseTokensForETH",
    args: [lp, to, amountIn, minimumOut, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
