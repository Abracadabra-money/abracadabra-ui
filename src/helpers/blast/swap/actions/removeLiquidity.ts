import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type RemoveLiquidityPayload = {
  lp: Address;
  to: Address;
  sharesIn: bigint;
  minimumBaseAmount: bigint;
  minimumQuoteAmount: bigint;
  deadline: bigint;
};

export const removeLiquidity = async (
  swapRouterAddress: Address,
  payload: RemoveLiquidityPayload
) => {
  const { lp, to, sharesIn, minimumBaseAmount, minimumQuoteAmount, deadline } =
    payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "removeLiquidity",
    args: [lp, to, sharesIn, minimumBaseAmount, minimumQuoteAmount, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
