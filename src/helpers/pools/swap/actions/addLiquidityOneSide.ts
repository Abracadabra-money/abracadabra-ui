import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type AddLiquidityOneSidePayload = {
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
  payload: AddLiquidityOneSidePayload
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

  const { request } = await simulateContractHelper({
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

  const hash = await writeContractHelper(request);
  return await waitForTransactionReceiptHelper({ hash });
};
