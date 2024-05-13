import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type SwapTokensForTokensPayload = {
  to: Address;
  amountIn: bigint;
  path: Address[];
  directions: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const swapTokensForTokens = async (
  swapRouterAddress: Address,
  payload: SwapTokensForTokensPayload
) => {
  const { to, amountIn, path, directions, minimumOut, deadline } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "swapTokensForTokens",
    args: [to, amountIn, path, directions, minimumOut, deadline],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
