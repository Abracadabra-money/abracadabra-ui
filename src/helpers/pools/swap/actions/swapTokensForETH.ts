import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type SwapTokensForETHPayload = {
  payableAmount: bigint;
  to: Address;
  amountIn: bigint;
  path: Address[];
  directions: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const swapTokensForETH = async (
  swapRouterAddress: Address,
  payload: SwapTokensForETHPayload
) => {
  const {
    payableAmount,
    to,
    amountIn,
    path,
    directions,
    minimumOut,
    deadline,
  } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "swapTokensForETH",
    args: [to, amountIn, path, directions, minimumOut, deadline],
    value: payableAmount,
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
