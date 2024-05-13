import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type SellBaseTokensForTokensPayload = {
  lp: Address;
  to: Address;
  amountIn: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellBaseTokensForTokens = async (
  swapRouterAddress: Address,
  payload: SellBaseTokensForTokensPayload
) => {
  const { lp, to, amountIn, minimumOut, deadline } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellBaseTokensForTokens",
    args: [lp, to, amountIn, minimumOut, deadline],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
