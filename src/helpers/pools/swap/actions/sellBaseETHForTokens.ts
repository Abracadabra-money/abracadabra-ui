import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type SellBaseETHForTokensPayload = {
  payableAmount: bigint;
  lp: Address;
  to: Address;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellBaseETHForTokens = async (
  swapRouterAddress: Address,
  payload: SellBaseETHForTokensPayload
) => {
  const { payableAmount, lp, to, minimumOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellBaseETHForTokens",
    args: [lp, to, minimumOut, deadline],
    value: payableAmount,
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
