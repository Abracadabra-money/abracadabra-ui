import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type SellBaseETHForTokensPayload = {
  payableAmount: bigint;
  lp: Address;
  to: Address;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellBaseETHForTokens = async (
  swapRouterAddress: Address,
  payload: SellBaseETHForTokensPayload
) => {
  const { payableAmount, lp, to, minimumOut, deadline } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellBaseETHForTokens",
    args: [lp, to, minimumOut, deadline],
    value: payableAmount,
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
