import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type SwapETHForTokensPayload = {
  payableAmount: bigint;
  to: Address;
  path: Address[];
  directions: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const swapETHForTokens = async (
  swapRouterAddress: Address,
  payload: SwapETHForTokensPayload
) => {
  const { payableAmount, to, path, directions, minimumOut, deadline } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "swapETHForTokens",
    args: [to, path, directions, minimumOut, deadline],
    value: payableAmount,
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
