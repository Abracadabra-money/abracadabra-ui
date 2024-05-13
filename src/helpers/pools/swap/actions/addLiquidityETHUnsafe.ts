import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

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

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidityETHUnsafe",
    args: [lp, to, tokenInAmount, minimumShares, deadline],
    value: payableAmount,
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
