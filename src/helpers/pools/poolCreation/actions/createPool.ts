import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type CreatePoolPayload = {
  baseToken: Address;
  quoteToken: Address;
  lpFeeRate: bigint;
  i: bigint;
  k: bigint;
  to: Address;
  baseInAmount: bigint;
  quoteInAmount: bigint;
  protocolOwnedPool: boolean;
};

export const createPool = async (
  swapRouterAddress: Address,
  payload: CreatePoolPayload
) => {
  const {
    baseToken,
    quoteToken,
    lpFeeRate,
    i,
    k,
    to,
    baseInAmount,
    quoteInAmount,
    protocolOwnedPool,
  } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "createPool",
    args: [
      baseToken,
      quoteToken,
      lpFeeRate,
      i,
      k,
      to,
      baseInAmount,
      quoteInAmount,
      protocolOwnedPool,
    ],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
