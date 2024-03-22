import type { Address } from "viem";
import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";

export type AddLiquidityETHPayload = {
  payableAmount: bigint;
  lp: Address;
  to: Address;
  refundTo: Address;
  tokenInAmount: bigint;
  minimumShares: bigint;
  deadline: bigint;
};

export const addLiquidityETH = async (
  swapRouterAddress: Address,
  payload: AddLiquidityETHPayload
) => {
  const {
    payableAmount,
    lp,
    to,
    refundTo,
    tokenInAmount,
    minimumShares,
    deadline,
  } = payload;

  const config = await prepareWriteContract({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidityETH",
    args: [lp, to, refundTo, tokenInAmount, minimumShares, deadline],
    value: payableAmount,
  });

  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};
