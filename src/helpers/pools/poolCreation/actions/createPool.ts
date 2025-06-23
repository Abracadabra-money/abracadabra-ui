import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import { getPoolAbiAndPayloadHandler } from "../utils/createPoolAbisAndPayloadHandler";

export type ActionConfig = {
  baseToken: Address;
  quoteToken: Address;
  lpFeeRate: bigint;
  K: bigint;
  I: bigint;
  to: Address;
  baseInAmount: bigint;
  quoteInAmount: bigint;
  protocolOwnedPool: boolean;
};

export const createPool = async (
  swapRouterAddress: Address,
  payload: ActionConfig
) => {
  const handler = getPoolAbiAndPayloadHandler(swapRouterAddress);
  const { request } = await simulateContractHelper(handler.createPool(payload));
  const hash = await writeContractHelper(request);
  return await waitForTransactionReceiptHelper({ hash });
};

export const createPoolNative = async (
  swapRouterAddress: Address,
  payload: ActionConfig,
  useTokenAsQuote: boolean
) => {
  const handler = getPoolAbiAndPayloadHandler(swapRouterAddress);

  const { request } = await simulateContractHelper(
    handler.createPoolETH(payload, useTokenAsQuote)
  );
  const hash = await writeContractHelper(request);
  return await waitForTransactionReceiptHelper({ hash });
};
