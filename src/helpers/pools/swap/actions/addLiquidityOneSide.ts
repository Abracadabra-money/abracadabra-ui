import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import type { Address } from "viem";

export type AddLiquidityPayload = {
  lp: Address;
  to: Address;
  inAmountIsBase: boolean;
  inAmount: bigint;
  inAmountToSwap: bigint;
  minimumShares: bigint;
  deadline: bigint;
};

export const addLiquidityOneSide = async (
  swapRouterAddress: Address,
  payload: AddLiquidityPayload
) => {
  const {
    lp,
    to,
    inAmountIsBase,
    inAmount,
    inAmountToSwap,
    minimumShares,
    deadline,
  } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidityOneSide",
    args: [
      lp,
      to,
      inAmountIsBase,
      inAmount,
      inAmountToSwap,
      minimumShares,
      deadline,
    ],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
