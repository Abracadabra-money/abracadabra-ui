import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type RemoveLiquidityETHPayload = {
  lp: Address;
  to: Address;
  sharesIn: bigint;
  minimumETHAmount: bigint;
  minimumTokenAmount: bigint;
  deadline: bigint;
};

export const removeLiquidityETH = async (
  swapRouterAddress: Address,
  payload: RemoveLiquidityETHPayload
) => {
  const { lp, to, sharesIn, minimumETHAmount, minimumTokenAmount, deadline } =
    payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "removeLiquidityETH",
    args: [lp, to, sharesIn, minimumETHAmount, minimumTokenAmount, deadline],
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
