import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type SellQuoteTokensForTokensPayload = {
  lp: Address;
  to: Address;
  amountIn: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellQuoteTokensForTokens = async (
  swapRouterAddress: Address,
  payload: SellQuoteTokensForTokensPayload
) => {
  const { lp, to, amountIn, minimumOut, deadline } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellQuoteTokensForTokens",
    args: [lp, to, amountIn, minimumOut, deadline],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
