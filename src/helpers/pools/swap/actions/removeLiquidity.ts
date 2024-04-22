import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type RemoveLiquidityPayload = {
  lp: Address;
  to: Address;
  sharesIn: bigint;
  minimumBaseAmount: bigint;
  minimumQuoteAmount: bigint;
  deadline: bigint;
};

export const removeLiquidity = async (
  swapRouterAddress: Address,
  payload: RemoveLiquidityPayload
) => {
  const { lp, to, sharesIn, minimumBaseAmount, minimumQuoteAmount, deadline } =
    payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "removeLiquidity",
    args: [lp, to, sharesIn, minimumBaseAmount, minimumQuoteAmount, deadline],
  });

  const hash = await writeContractHelper(request);
  return await waitForTransactionReceiptHelper({ hash });
};
