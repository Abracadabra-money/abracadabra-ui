import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type AddLiquidityUnsafePayload = {
  lp: Address;
  to: Address;
  baseInAmount: bigint;
  quoteInAmount: bigint;
  minimumShares: bigint;
  deadline: bigint;
};

export const addLiquidityUnsafe = async (
  swapRouterAddress: Address,
  payload: AddLiquidityUnsafePayload
) => {
  const { lp, to, baseInAmount, quoteInAmount, minimumShares, deadline } =
    payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidityUnsafe",
    args: [lp, to, baseInAmount, quoteInAmount, minimumShares, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
