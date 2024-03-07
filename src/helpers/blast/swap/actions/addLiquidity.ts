import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type AddLiquidityPayload = [
  lp: Address,
  to: Address,
  baseInAmount: bigint,
  quoteInAmount: bigint,
  minimumShares: bigint,
  deadline: bigint
];

export const addLiquidity = async (
  swapRouterAddress: Address,
  payload: AddLiquidityPayload
) => {
  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidity",
    args: [...payload],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
