import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type AddLiquidityETHPayload = {
  payableAmount: bigint;
  lp: Address;
  to: Address;
  refundTo: Address;
  tokenInAmount: bigint;
  minimumShares: bigint;
  deadline: bigint;
};

export const addLiquidityETH = async (
  swapRouterAddress: Address,
  payload: AddLiquidityETHPayload
) => {
  const {
    payableAmount,
    lp,
    to,
    refundTo,
    tokenInAmount,
    minimumShares,
    deadline,
  } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "addLiquidityETH",
    args: [lp, to, refundTo, tokenInAmount, minimumShares, deadline],
    value: payableAmount,
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
