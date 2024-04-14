import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type RemoveLiquidityOneSidePayload = {
  lp: Address;
  to: Address;
  withdrawBase: boolean;
  sharesIn: bigint;
  minAmountOut: bigint;
  deadline: bigint;
};

export const removeLiquidityOneSide = async (
  swapRouterAddress: Address,
  payload: RemoveLiquidityOneSidePayload
) => {
  const { lp, to, withdrawBase, sharesIn, minAmountOut, deadline } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "removeLiquidityOneSide",
    args: [lp, to, withdrawBase, sharesIn, minAmountOut, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
