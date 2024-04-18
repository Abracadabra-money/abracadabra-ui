import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type AddLiquidityPayload = {
  lp: Address;
  to: Address;
  baseInAmount: bigint;
  quoteInAmount: bigint;
  minimumShares: bigint;
  deadline: bigint;
};

export const addLiquidity = async (
  swapRouterAddress: Address,
  payload: AddLiquidityPayload
) => {
  const { lp, to, baseInAmount, quoteInAmount, minimumShares, deadline } =
    payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidity",
    args: [lp, to, baseInAmount, quoteInAmount, minimumShares, deadline],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
