import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

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

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "removeLiquidityOneSide",
    args: [lp, to, withdrawBase, sharesIn, minAmountOut, deadline],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
