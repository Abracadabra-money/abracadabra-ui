import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

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
  const {
    baseToken,
    quoteToken,
    lpFeeRate,
    I,
    K,
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
      I,
      K,
      to,
      baseInAmount,
      quoteInAmount,
      protocolOwnedPool,
    ],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};

export const createPoolNative = async (
  swapRouterAddress: Address,
  payload: ActionConfig,
  useTokenAsQuote: boolean
) => {
  const {
    baseToken,
    quoteToken,
    lpFeeRate,
    I,
    K,
    to,
    baseInAmount,
    quoteInAmount,
    protocolOwnedPool,
  } = payload;

  const value = useTokenAsQuote ? quoteInAmount : baseInAmount;
  const token = useTokenAsQuote ? quoteToken : baseToken;
  const tokenInAmount = useTokenAsQuote ? quoteInAmount : baseInAmount;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "createPoolETH",
    args: [
      token,
      useTokenAsQuote,
      lpFeeRate,
      I,
      K,
      to,
      tokenInAmount,
      protocolOwnedPool,
    ],
    value,
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
