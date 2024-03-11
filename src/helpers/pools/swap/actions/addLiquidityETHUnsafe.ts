import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type AddLiquidityETHUnsafePayload = {
  payableAmount: bigint;
  lp: Address;
  to: Address;
  tokenInAmount: bigint;
  minimumShares: bigint;
  deadline: bigint;
};

export const addLiquidityETHUnsafe = async (
  swapRouterAddress: Address,
  payload: AddLiquidityETHUnsafePayload
) => {
  const { payableAmount, lp, to, tokenInAmount, minimumShares, deadline } =
    payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidityETHUnsafe",
    args: [lp, to, tokenInAmount, minimumShares, deadline],
    value: payableAmount,
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
